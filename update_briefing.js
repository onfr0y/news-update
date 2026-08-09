// Collects source material for Codex to turn into a Daily Intelligence Briefing.
const fs = require('fs');
const path = require('path');

// RSS Feeds (emphasizing high-trust sources requested: BBC, Bloomberg/Business, NYT)
const FEEDS = {
  tech: [
    'https://feeds.bbci.co.uk/news/technology/rss.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml'
  ],
  stocks: [
    'https://feeds.bbci.co.uk/news/business/rss.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml'
  ],
  crypto: [
    'https://www.coindesk.com/arc/outboundfeeds/rss/',
    'https://cointelegraph.com/rss'
  ]
};

// Helper to strip HTML tags and clean up string content
function cleanHtml(str) {
  if (!str) return '';
  return str
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '--')
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper to extract items from RSS feeds via simple regex parsing (zero-dependency)
function parseRss(xmlText) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];
    const titleMatch = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/.exec(itemContent);
    const descMatch = /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/.exec(itemContent);
    const linkMatch = /<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/.exec(itemContent);
    if (titleMatch) {
      items.push({
        title: cleanHtml(titleMatch[1]),
        description: descMatch ? cleanHtml(descMatch[1]) : '',
        link: linkMatch ? cleanHtml(linkMatch[1]).trim() : ''
      });
    }
  }
  return items;
}

// Fetch content with timeout
async function fetchWithTimeout(url, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function getFeedItems(url) {
  try {
    console.log(`Fetching feed: ${url}`);
    const response = await fetchWithTimeout(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const text = await response.text();
    return parseRss(text).slice(0, 15);
  } catch (error) {
    console.error(`Failed to fetch or parse feed ${url}:`, error.message);
    return [];
  }
}

// Fetch Real-time Market Ticker Quotes
async function fetchMacroData() {
  const symbols = {
    brentCrude: 'BZ=F',
    bitcoin: 'BTC-USD',
    sp500: '^GSPC',
    nasdaq: '^IXIC'
  };
  const macro = {};
  
  for (const [key, symbol] of Object.entries(symbols)) {
    try {
      const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const meta = data.chart?.result?.[0]?.meta;
      if (meta) {
        const price = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose;
        const changePercent = ((price - prevClose) / prevClose) * 100;
        
        let formattedValue = price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (key === 'bitcoin') {
          formattedValue = '$' + Math.round(price).toLocaleString('en-US');
        } else if (key === 'brentCrude') {
          formattedValue = '$' + price.toFixed(2);
        }
        
        const changeSign = changePercent >= 0 ? '+' : '';
        const trend = changePercent >= 0 ? 'up' : 'down';
        
        macro[key] = {
          value: formattedValue,
          change: `${changeSign}${changePercent.toFixed(2)}%`,
          trend: trend
        };
      }
    } catch (err) {
      console.error(`Failed to fetch macro symbol ${symbol}:`, err.message);
      macro[key] = { value: "N/A", change: "0.00%", trend: "neutral" };
    }
  }
  return macro;
}

async function main() {
  // Determine current date in YYYY-MM-DD local format
  const tzOffset = (new Date()).getTimezoneOffset() * 60000;
  const today = (new Date(Date.now() - tzOffset)).toISOString().slice(0, 10);
  console.log(`Collecting briefing source material for date: ${today}`);

  // Fetch all feeds
  const techItems = [];
  for (const url of FEEDS.tech) {
    techItems.push(...(await getFeedItems(url)));
  }

  const stocksItems = [];
  for (const url of FEEDS.stocks) {
    stocksItems.push(...(await getFeedItems(url)));
  }

  const cryptoItems = [];
  for (const url of FEEDS.crypto) {
    cryptoItems.push(...(await getFeedItems(url)));
  }

  if (techItems.length === 0 && stocksItems.length === 0 && cryptoItems.length === 0) {
    console.error('Error: No news items retrieved from any feed.');
    process.exit(1);
  }

  console.log(`Collected news items: Tech: ${techItems.length}, Stocks: ${stocksItems.length}, Crypto: ${cryptoItems.length}`);
  
  // Fetch real-time ticker data
  const macroQuotes = await fetchMacroData();
  console.log('Macro quotes compiled successfully:', JSON.stringify(macroQuotes));

  const rawData = {
    date: today,
    macro: macroQuotes,
    techItems,
    stocksItems,
    cryptoItems
  };
  const rawPath = path.join(__dirname, 'pending_briefing_raw.json');
  fs.writeFileSync(rawPath, JSON.stringify(rawData, null, 2), 'utf8');
  console.log(`Raw briefing data saved to ${rawPath}. Codex should now write and publish the completed briefing.`);
}

main().catch(err => {
  console.error('Fatal Error during update execution:', err);
  process.exit(1);
});
