const newsData = [
  {
    date: "2026-07-02",
    macro: {
      brentCrude: { value: "$70.34", change: "-1.72%", trend: "down" },
      bitcoin: { value: "$61,281", change: "+2.20%", trend: "up" },
      sp500: { value: "7,483.23", change: "-0.22%", trend: "down" },
      nasdaq: { value: "26,040.03", change: "-0.66%", trend: "down" }
    },
    tech: {
      sentiment: "Neutral",
      summary: [
        {
          text: "Meta expands into the AI cloud space, planning to sell excess computing power to outside enterprise clients to drive new AI revenues.",
          source: "Bloomberg",
          url: "https://www.bloomberg.com"
        },
        {
          text: "Tech and finance sector layoffs average 28,000 monthly, with experts pointing to accelerating AI automation as a primary driver.",
          source: "The New York Times",
          url: "https://www.nytimes.com"
        },
        {
          text: "Big Tech's climate pledges face pressure as massive AI infrastructure builds outstrip the power grid's capacity to decarbonize.",
          source: "BBC News",
          url: "https://www.bbc.co.uk/news"
        },
        {
          text: "Apple reportedly explores sourcing semiconductor memory chips from blacklisted Chinese hardware manufacturers to stabilize supply chains.",
          source: "Bloomberg",
          url: "https://www.bloomberg.com"
        }
      ],
      trendAnalysis: "The technology sector is shifting focus from raw model research to compute monetization and infrastructure constraints. Meta's cloud business pivot highlights a need to turn massive AI hardware expenditures into revenue engines, while the environmental grid constraints of AI data centers emerge as a key structural bottleneck for the industry's scaling ambitions."
    },
    stocks: {
      sentiment: "Bearish",
      summary: [
        {
          text: "Global markets enter the second half of 2026 with caution, triggering profit-taking in the high-performing semiconductor sector.",
          source: "Bloomberg",
          url: "https://www.bloomberg.com"
        },
        {
          text: "Investors adopt a wait-and-see stance ahead of the highly anticipated US jobs report, expecting an increase of 115,000 jobs.",
          source: "Bloomberg",
          url: "https://www.bloomberg.com"
        },
        {
          text: "Crude oil prices extend declines, driven by reports of progress in US-Iran peace talks currently underway in Qatar.",
          source: "The New York Times",
          url: "https://www.nytimes.com"
        },
        {
          text: "Cooler-than-expected Euro area inflation data dampens the euro and adjusts expectations for ECB interest rate cuts.",
          source: "BBC News",
          url: "https://www.bbc.co.uk/news"
        }
      ],
      trendAnalysis: "Global equities are experiencing a healthy consolidation at the start of H2, characterized by rotation and profit-taking in the tech sector. The near-term trend is tightly bound to US employment numbers and their implications for the Fed's higher-for-longer policy stance, while the energy sector faces downward price pressure from progress in Middle East diplomacy."
    },
    crypto: {
      sentiment: "Bullish",
      summary: [
        {
          text: "Federal disclosure filings reveal the Trump family earned over $1 billion from cryptocurrency ventures and souvenir meme tokens.",
          source: "The New York Times",
          url: "https://www.nytimes.com"
        },
        {
          text: "Bitcoin climbs back above $60,000 on short covering and comments from Fed Chair Kevin Warsh signaling fading inflation risks.",
          source: "Bloomberg",
          url: "https://www.bloomberg.com"
        },
        {
          text: "UK's Financial Conduct Authority finalizes its digital assets and stablecoins regulatory roadmap, set to take effect in October 2027.",
          source: "BBC News",
          url: "https://www.bbc.co.uk/news"
        },
        {
          text: "Global Bitcoin ATM installations fall 27.7% in the first half of 2026, led by a steep reduction in US locations.",
          source: "Bloomberg",
          url: "https://www.bloomberg.com"
        }
      ],
      trendAnalysis: "Bitcoin's return above $60,000 highlights strong resilience, catalyzed by short covering and signs of peak interest rate policy. However, the revelation of the Trump family's massive crypto earnings introduces a layer of political complexity that could slow down US legislative progress. Meanwhile, the UK's clear regulatory roadmap demonstrates the global maturation of stablecoin oversight."
    }
  },
  {
    date: "2026-06-15",
    macro: {
      brentCrude: { value: "$83.85", change: "-4.20%", trend: "down" },
      bitcoin: { value: "$65,750", change: "+1.80%", trend: "up" },
      sp500: { value: "5,431.25", change: "+0.60%", trend: "up" },
      nasdaq: { value: "17,680.10", change: "+0.90%", trend: "up" }
    },
    tech: {
      sentiment: "Bearish",
      summary: [
        {
          text: "US government issues export-control directive suspending foreign-national access to Anthropic's 'Fable 5' and 'Mythos 5' models, forcing Anthropic to disable them for all customers.",
          source: "Bloomberg",
          url: "https://www.bloomberg.com"
        },
        {
          text: "Amazon debuts an AI-powered visual shopping search feature to enhance retail user experiences.",
          source: "The New York Times",
          url: "https://www.nytimes.com"
        },
        {
          text: "China cuts 12,000 university degrees in a major educational overhaul to realign graduates' skills with the AI economy.",
          source: "BBC News",
          url: "https://www.bbc.co.uk/news"
        },
        {
          text: "MTN Group Fintech partners with Ant International to launch a new mobile money super-app in Nigeria next quarter.",
          source: "Bloomberg",
          url: "https://www.bloomberg.com"
        }
      ],
      trendAnalysis: "Regulatory interventions in artificial intelligence are escalating beyond compliance oversight to direct national security export directives. The suspension of foreign-national access to Anthropic's flagship models sets a major precedent, highlighting that frontier AI is now treated as dual-use national infrastructure. Meanwhile, commercial AI integrations continue rapidly, with China restructuring its entire higher education system to prevent systemic labor displacement."
    },
    stocks: {
      sentiment: "Bullish",
      summary: [
        {
          text: "A formal US-Iran peace agreement and reopening of the Strait of Hormuz trigger a broad rally in global equity markets.",
          source: "The New York Times",
          url: "https://www.nytimes.com"
        },
        {
          text: "Brent crude futures drop over 4% to below $84 per barrel, easing systemic energy inflation concerns.",
          source: "Bloomberg",
          url: "https://www.bloomberg.com"
        },
        {
          text: "Japan's Nikkei 225 index hits a historic intraday high, closing above 69,000 in early Asian trading.",
          source: "BBC News",
          url: "https://www.bbc.co.uk/news"
        },
        {
          text: "Markets brace for the FOMC meeting under new Fed Chair Kevin Warsh, focusing on economic projections and future rate trajectory updates.",
          source: "Bloomberg",
          url: "https://www.bloomberg.com"
        }
      ],
      trendAnalysis: "The resolution of geopolitical friction in the Middle East has immediately stabilised global risk assets. The decline in crude oil prices will alleviate near-term input cost pressures, giving central banks more breathing room. However, the macro narrative will be dominated by Kevin Warsh's first FOMC meeting, where any hawkish signals regarding the dot plot could quickly truncate the peace-induced relief rally."
    },
    crypto: {
      sentiment: "Bullish",
      summary: [
        {
          text: "Cryptocurrencies experience a broad recovery, with Bitcoin rebounding to the $65,750 range and Ethereum hovering above $1,700.",
          source: "Bloomberg",
          url: "https://www.bloomberg.com"
        },
        {
          text: "CFTC upgrades 'quasi-perpetual structure futures' to official perpetual contracts, creating a compliant pathway for US crypto derivatives.",
          source: "Bloomberg",
          url: "https://www.bloomberg.com"
        },
        {
          text: "SEC approves T. Rowe Price's actively managed multi-asset crypto ETF, which can hold up to 17 different digital assets.",
          source: "The New York Times",
          url: "https://www.nytimes.com"
        },
        {
          text: "Market sentiment remains fragile, with the Fear & Greed Index lingering at extreme fear levels (around 20) despite the price recovery.",
          source: "BBC News",
          url: "https://www.bbc.co.uk/news"
        }
      ],
      trendAnalysis: "The crypto market is demonstrating strong beta to macro risk relief, but underlying sentiment remains deeply scarred from the prolonged winter. The structural story, however, is exceptionally bullish for US institutional markets: the CFTC's perpetual contract ruling and the SEC's approval of a multi-asset ETF signal a rapid regulatory convergence that will make digital assets standard components of diversified wealth portfolios."
    }
  },
  {
    date: "2026-06-14",
    macro: {
      brentCrude: { value: "$87.50", change: "+1.20%", trend: "up" },
      bitcoin: { value: "$64,500", change: "-0.95%", trend: "down" },
      sp500: { value: "5,398.80", change: "+0.15%", trend: "up" },
      nasdaq: { value: "17,522.45", change: "-0.20%", trend: "down" }
    },
    tech: {
      sentiment: "Neutral",
      summary: [
        {
          text: "SpaceX IPO dominates market conversations with its valuation surging past $2.1 trillion, redirecting investor capital into mega-cap space and technology stocks.",
          source: "Bloomberg",
          url: "https://www.bloomberg.com"
        },
        {
          text: "Anthropic releases its new 'Fable 5' models, intensifying competition in the frontier AI model class.",
          source: "The New York Times",
          url: "https://www.nytimes.com"
        },
        {
          text: "KPMG retracts its 'Excellence in Agentic AI' report after Swiss bank UBS and the UK's NHS flagged that success stories were fabricated due to AI hallucinations.",
          source: "BBC News",
          url: "https://www.bbc.co.uk/news"
        },
        {
          text: "Apple's WWDC 2026 continues to receive analysis following updates to Siri with advanced agentic AI capabilities.",
          source: "Bloomberg",
          url: "https://www.bloomberg.com"
        }
      ],
      trendAnalysis: "The technology sector is experiencing a consolidation of power around mega-cap companies, particularly with SpaceX entering public markets. The retraction of KPMG's AI report is a crucial reminder of the reputational risks surrounding unverified agentic workflows, signalling that enterprise buyers will demand higher validation standards. The AI narrative remains dominant, but investment is shifting from speculative applications to hard infrastructure."
    },
    stocks: {
      sentiment: "Bullish",
      summary: [
        {
          text: "US markets show a late-week recovery after reports that President Trump cancelled planned strikes on Iran, fostering optimism for an imminent peace deal.",
          source: "The New York Times",
          url: "https://www.nytimes.com"
        },
        {
          text: "S&P 500 and Dow close higher heading into the weekend, recovering from a sharp correction earlier in June driven by Broadcom's guidance miss.",
          source: "Bloomberg",
          url: "https://www.bloomberg.com"
        },
        {
          text: "US headline inflation rises to 4.2% year-on-year in May, keeping the Federal Reserve's interest rate trajectory highly contested.",
          source: "Bloomberg",
          url: "https://www.bloomberg.com"
        },
        {
          text: "US consumer sentiment improves slightly in June, aided by gasoline prices falling to around $4.10 per gallon.",
          source: "BBC News",
          url: "https://www.bbc.co.uk/news"
        }
      ],
      trendAnalysis: "Stock markets remain highly sensitive to geopolitical shifts and inflation data. The cancelation of strikes in the Middle East has brought immediate relief, particularly to oil prices, which have retreated to Brent crude sub-$88 per barrel. However, with inflation running at 4.2% and core CPI showing persistence, the Fed's higher-for-longer rate regime is expected to constrain valuation multiples outside of high-growth tech sectors."
    },
    crypto: {
      sentiment: "Bearish",
      summary: [
        {
          text: "Bloomberg characterizes the current downturn as the 'coldest crypto winter' in history, noting structural differences from previous bear cycles.",
          source: "Bloomberg",
          url: "https://www.bloomberg.com"
        },
        {
          text: "Bitcoin faces persistent selling pressure, dropping below the $67,000–$60,000 range in early June.",
          source: "Bloomberg",
          url: "https://www.bloomberg.com"
        },
        {
          text: "Fund outflows from US spot ETFs and competition for retail attention from the AI sector are cited as primary factors for price weakness.",
          source: "The New York Times",
          url: "https://www.nytimes.com"
        },
        {
          text: "BlackRock files amendments for its new 'iShares Bitcoin Premium Income ETF', aimed at offering yield-generating exposure to Bitcoin.",
          source: "Bloomberg",
          url: "https://www.bloomberg.com"
        }
      ],
      trendAnalysis: "The cryptocurrency sector is undergoing a stark bifurcation. On one hand, retail interest has waned, drawn away by the AI boom, resulting in a prolonged price winter for major tokens. On the other hand, institutional plumbing continues to mature, as seen by BlackRock's new yield-generating ETF filings. The trend indicates that future growth will be driven by institutional integration and tokenisation rather than speculative retail-driven retail bull runs."
    }
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = newsData;
}
