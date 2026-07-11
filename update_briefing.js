// Self-contained Node.js script to automate Daily Intelligence Briefing updates
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
  // Load local .env file if it exists (zero-dependency env loading)
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const match = line.match(/^\s*GEMINI_API_KEY\s*=\s*(.+)$/);
      if (match) {
        process.env.GEMINI_API_KEY = match[1].replace(/['"]/g, '').trim();
      }
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const isDryRun = process.argv.includes('--dry-run');

  if (!apiKey && !isDryRun) {
    console.error('Error: GEMINI_API_KEY environment variable is not set. Use --dry-run to test without API key.');
    process.exit(1);
  }

  // Determine current date in YYYY-MM-DD local format
  const tzOffset = (new Date()).getTimezoneOffset() * 60000;
  const today = (new Date(Date.now() - tzOffset)).toISOString().slice(0, 10);
  console.log(`Starting briefing generation for date: ${today}${isDryRun ? ' (DRY RUN)' : ''}`);

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

  let newEntry;

  if (isDryRun) {
    console.log('Dry run: Simulating Gemini response with nested clickable links & sentiment...');
    newEntry = {
      date: today,
      macro: macroQuotes,
      tech: {
        sentiment: "Neutral",
        summary: [
          {
            text: techItems[0]?.title || 'UK bans social media accounts for minors under 16 years old.',
            source: 'BBC News',
            url: techItems[0]?.link || 'https://www.bbc.co.uk/news'
          },
          {
            text: techItems[1]?.title || 'Amazon visual retail search rollouts debut globally.',
            source: 'The New York Times',
            url: techItems[1]?.link || 'https://www.nytimes.com'
          }
        ],
        trendAnalysis: 'Regulatory frameworks continue to tighten user age verifications on social platforms, while large retail conglomerates expand their mobile visual pipelines.'
      },
      stocks: {
        sentiment: "Bullish",
        summary: [
          {
            text: stocksItems[0]?.title || 'US-Iran sign memorandum of understanding, reopening Strait of Hormuz.',
            source: 'The New York Times',
            url: stocksItems[0]?.link || 'https://www.nytimes.com'
          },
          {
            text: stocksItems[1]?.title || 'Brent crude pricing falls past $84 per barrel on ease of strikes.',
            source: 'Bloomberg',
            url: stocksItems[1]?.link || 'https://www.bloomberg.com'
          }
        ],
        trendAnalysis: 'Middle East geopolitical relief has dramatically stabilized energy indices, boosting global market sentiments ahead of the Federal Reserve transitions.'
      },
      crypto: {
        sentiment: "Bullish",
        summary: [
          {
            text: cryptoItems[0]?.title || 'BlackRock launches covered-call Bitcoin yield fund on US exchanges.',
            source: 'CoinDesk',
            url: cryptoItems[0]?.link || 'https://www.coindesk.com'
          },
          {
            text: cryptoItems[1]?.title || 'SEC approves T. Rowe Price multi-asset crypto ETF package.',
            source: 'The New York Times',
            url: cryptoItems[1]?.link || 'https://www.nytimes.com'
          }
        ],
        trendAnalysis: 'Derivative regulatory upgrades combined with multi-asset ETF options are establishing structural liquidity baselines for digital portfolios.'
      }
    };
  } else {
    // Prepare Prompt for Gemini API
    const prompt = `
You are Jean, a highly sophisticated, minimalist personal intelligence assistant.
Your task is to compile a Daily Intelligence Briefing for the date "${today}" based on the raw RSS feed items provided below.
Strictly adhere to the following rules:
1. Under each sector ("tech", "stocks", "crypto"), compile exactly 4 concise, high-impact bullet point summaries in the "summary" array.
2. For each bullet point, create an object containing:
   - "text": A concise, refined British English summary (e.g. colour, analyse).
   - "source": The publisher name matching the source item (e.g. 'BBC News', 'The New York Times', 'Bloomberg', 'CoinDesk', 'CoinTelegraph', etc.).
   - "url": The exact link URL of the source article from the provided raw items list.
3. For each sector, write a cohesive, professional "trendAnalysis" paragraph summarizing the broader macroeconomic or structural trajectory.
4. For each sector, assign a "sentiment" index value of either "Bullish", "Bearish", or "Neutral" based on the day's aggregated news.
5. Ignore duplicate stories or irrelevant filler links.
6. The "date" field in the JSON output MUST be exactly "${today}".

Raw News Items:

### Technology news:
${techItems.map((item, idx) => `${idx + 1}. Title: ${item.title}\n   Link: ${item.link}\n   Description: ${item.description}`).join('\n\n')}

### Stock Market news:
${stocksItems.map((item, idx) => `${idx + 1}. Title: ${item.title}\n   Link: ${item.link}\n   Description: ${item.description}`).join('\n\n')}

### Cryptocurrency news:
${cryptoItems.map((item, idx) => `${idx + 1}. Title: ${item.title}\n   Link: ${item.link}\n   Description: ${item.description}`).join('\n\n')}
`;

    console.log('Sending request to Gemini API...');
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              date: { type: 'STRING' },
              tech: {
                type: 'OBJECT',
                properties: {
                  sentiment: { type: 'STRING', enum: ['Bullish', 'Bearish', 'Neutral'] },
                  summary: {
                    type: 'ARRAY',
                    items: {
                      type: 'OBJECT',
                      properties: {
                        text: { type: 'STRING' },
                        source: { type: 'STRING' },
                        url: { type: 'STRING' }
                      },
                      required: ['text', 'source', 'url']
                    }
                  },
                  trendAnalysis: { type: 'STRING' }
                },
                required: ['sentiment', 'summary', 'trendAnalysis']
              },
              stocks: {
                type: 'OBJECT',
                properties: {
                  sentiment: { type: 'STRING', enum: ['Bullish', 'Bearish', 'Neutral'] },
                  summary: {
                    type: 'ARRAY',
                    items: {
                      type: 'OBJECT',
                      properties: {
                        text: { type: 'STRING' },
                        source: { type: 'STRING' },
                        url: { type: 'STRING' }
                      },
                      required: ['text', 'source', 'url']
                    }
                  },
                  trendAnalysis: { type: 'STRING' }
                },
                required: ['sentiment', 'summary', 'trendAnalysis']
              },
              crypto: {
                type: 'OBJECT',
                properties: {
                  sentiment: { type: 'STRING', enum: ['Bullish', 'Bearish', 'Neutral'] },
                  summary: {
                    type: 'ARRAY',
                    items: {
                      type: 'OBJECT',
                      properties: {
                        text: { type: 'STRING' },
                        source: { type: 'STRING' },
                        url: { type: 'STRING' }
                      },
                      required: ['text', 'source', 'url']
                    }
                  },
                  trendAnalysis: { type: 'STRING' }
                },
                required: ['sentiment', 'summary', 'trendAnalysis']
              }
            },
            required: ['date', 'tech', 'stocks', 'crypto']
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API HTTP Error! Status: ${response.status}. Details: ${errorText}`);
    }

    const resJson = await response.json();
    if (resJson.error) {
      throw new Error(`Gemini API Error: ${resJson.error.message}`);
    }

    const resultText = resJson.candidates[0].content.parts[0].text;
    newEntry = JSON.parse(resultText);
  }

  // Inject computed real-time macro quotes into the entry
  newEntry.macro = macroQuotes;

  console.log('Briefing successfully generated by Gemini. Updating data.js...');

  // Update data.js
  const dataPath = path.join(__dirname, 'data.js');
  const existingData = require(dataPath);

  const existingIndex = existingData.findIndex(entry => entry.date === newEntry.date);
  if (existingIndex !== -1) {
    console.log(`Briefing for ${newEntry.date} already exists. Replacing existing record.`);
    existingData[existingIndex] = newEntry;
  } else {
    console.log(`Prepending new briefing for ${newEntry.date}.`);
    existingData.unshift(newEntry);
  }

  const newFileContent = `const newsData = ${JSON.stringify(existingData, null, 2)};\n\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = newsData;\n}\n`;
  fs.writeFileSync(dataPath, newFileContent, 'utf8');

  console.log('Update complete! data.js has been successfully written.');

  // Auto commit and push to Git (skip on dry runs)
  if (!isDryRun) {
    const { execSync } = require('child_process');
    try {
      console.log('Checking git status...');
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.includes('data.js')) {
        console.log('Staging changes to data.js...');
        execSync('git add data.js');
        
        if (process.env.GITHUB_ACTIONS) {
          console.log('Configuring git bot credentials...');
          execSync('git config user.name "github-actions[bot]"');
          execSync('git config user.email "github-actions[bot]@users.noreply.github.com"');
        }
        
        console.log('Committing changes...');
        execSync(`git commit -m "auto: update daily briefing for ${newEntry.date} [skip ci]"`);
        
        console.log('Pushing to origin...');
        execSync('git push');
        console.log('Successfully pushed changes to remote Git!');
      } else {
        console.log('No changes detected in data.js. Skipping Git push.');
      }
    } catch (gitError) {
      console.error('Git auto-commit/push failed:', gitError.message);
    }
  }
}

main().catch(err => {
  console.error('Fatal Error during update execution:', err);
  process.exit(1);
});
