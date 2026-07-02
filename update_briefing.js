// Self-contained Node.js script to automate Daily Intelligence Briefing updates
const fs = require('fs');
const path = require('path');

// RSS Feeds
const FEEDS = {
  tech: [
    'https://techcrunch.com/feed/',
    'https://news.ycombinator.com/rss'
  ],
  stocks: [
    'https://finance.yahoo.com/news/rssindex',
    'https://search.cnbc.com/rs/search/combinedfeed.view?target=finance'
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
    if (titleMatch) {
      items.push({
        title: cleanHtml(titleMatch[1]),
        description: descMatch ? cleanHtml(descMatch[1]) : ''
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
    return parseRss(text).slice(0, 10);
  } catch (error) {
    console.error(`Failed to fetch or parse feed ${url}:`, error.message);
    return [];
  }
}

async function main() {
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

  let newEntry;

  if (isDryRun) {
    console.log('Dry run: Simulating Gemini response...');
    newEntry = {
      date: today,
      tech: {
        summary: [
          techItems[0]?.title || 'PM Sir Keir Starmer bans social media for under 16s starting Spring 2027.',
          techItems[1]?.title || 'Amazon India shifts strategy to sustainable retail growth over media assets.',
          techItems[2]?.title || 'Ricoh invests in AI vector database startup Weaviate via Ricoh Fund.',
          techItems[3]?.title || 'Lockheed Martin Skunk Works unveils robotically assembled attack drone.'
        ].map(cleanHtml),
        trendAnalysis: 'Technology sectors are adapting to structural regulatory boundaries globally, while capital shifts from consumer platforms to enterprise database infrastructures and autonomous hardware pipelines.'
      },
      stocks: {
        summary: [
          stocksItems[0]?.title || 'US-Iran Memorandum of Understanding eases Strait of Hormuz oil premium.',
          stocksItems[1]?.title || 'Global crude futures drop significantly, lowering energy inflation index.',
          stocksItems[2]?.title || 'Yorkville International Capital Corp lists on Nasdaq after IPO.',
          stocksItems[3]?.title || 'Equity markets consolidate ahead of Kevin Warsh\'s Federal Reserve debut.'
        ].map(cleanHtml),
        trendAnalysis: 'Geopolitical easing in the Middle East has reduced the energy inflation premium, sparking a risk-on sentiment, though markets remain defensive ahead of central bank leadership transitions.'
      },
      crypto: {
        summary: [
          cryptoItems[0]?.title || 'BlackRock launches iShares Bitcoin Premium Income covered-call ETF.',
          cryptoItems[1]?.title || 'Bitmine Immersion Technologies raises corporate Ethereum treasury to 5.62M.',
          cryptoItems[2]?.title || 'Bitmine Series A Preferred Stock begins trading on NYSE exchange.',
          cryptoItems[3]?.title || 'Bitcoin trades stable in range of $65k-$65.7k following ETF launches.'
        ].map(cleanHtml),
        trendAnalysis: 'Institutional digital asset products are transitioning from simple spot exposure to yield-oriented structures, indicating the onset of a protocol-level staking and yield-focused maturation phase.'
      }
    };
  } else {
    // Prepare Prompt for Gemini API
    const prompt = `
You are Jean, a highly sophisticated, minimalist personal intelligence assistant.
Your task is to compile a Daily Intelligence Briefing for the date "${today}" based on the raw RSS feed items provided below.
Strictly adhere to the following rules:
1. Under each sector ("tech", "stocks", "crypto"), compile exactly 4 concise, high-impact bullet point summaries in the "summary" array.
2. For each sector, write a cohesive, professional "trendAnalysis" paragraph summarizing the broader macroeconomic or structural trajectory.
3. Maintain a consistent, sophisticated, clean tone (Muji-inspired, minimalist, clear).
4. Ignore duplicate stories or irrelevant filler links.
5. The "date" field in the JSON output MUST be exactly "${today}".

Raw News Items:

### Technology news:
${techItems.map((item, idx) => `${idx + 1}. Title: ${item.title}\n   Description: ${item.description}`).join('\n\n')}

### Stock Market news:
${stocksItems.map((item, idx) => `${idx + 1}. Title: ${item.title}\n   Description: ${item.description}`).join('\n\n')}

### Cryptocurrency news:
${cryptoItems.map((item, idx) => `${idx + 1}. Title: ${item.title}\n   Description: ${item.description}`).join('\n\n')}
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
                  summary: { type: 'ARRAY', items: { type: 'STRING' } },
                  trendAnalysis: { type: 'STRING' }
                },
                required: ['summary', 'trendAnalysis']
              },
              stocks: {
                type: 'OBJECT',
                properties: {
                  summary: { type: 'ARRAY', items: { type: 'STRING' } },
                  trendAnalysis: { type: 'STRING' }
                },
                required: ['summary', 'trendAnalysis']
              },
              crypto: {
                type: 'OBJECT',
                properties: {
                  summary: { type: 'ARRAY', items: { type: 'STRING' } },
                  trendAnalysis: { type: 'STRING' }
                },
                required: ['summary', 'trendAnalysis']
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
