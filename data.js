const newsData = [
  {
    date: "2026-06-15",
    tech: {
      summary: [
        "US government issues export-control directive suspending foreign-national access to Anthropic's 'Fable 5' and 'Mythos 5' models, forcing Anthropic to disable them for all customers.",
        "Amazon debuts an AI-powered visual shopping search feature to enhance retail user experiences.",
        "China cuts 12,000 university degrees in a major educational overhaul to realign graduates' skills with the AI economy.",
        "MTN Group Fintech partners with Ant International to launch a new mobile money super-app in Nigeria next quarter."
      ],
      trendAnalysis: "Regulatory interventions in artificial intelligence are escalating beyond compliance oversight to direct national security export directives. The suspension of foreign-national access to Anthropic's flagship models sets a major precedent, highlighting that frontier AI is now treated as dual-use national infrastructure. Meanwhile, commercial AI integrations continue rapidly, with China restructuring its entire higher education system to prevent systemic labor displacement."
    },
    stocks: {
      summary: [
        "A formal US-Iran peace agreement and reopening of the Strait of Hormuz trigger a broad rally in global equity markets.",
        "Brent crude futures drop over 4% to below $84 per barrel, easing systemic energy inflation concerns.",
        "Japan's Nikkei 225 index hits a historic intraday high, closing above 69,000 in early Asian trading.",
        "Markets brace for the FOMC meeting under new Fed Chair Kevin Warsh, focusing on economic projections and future rate trajectory updates."
      ],
      trendAnalysis: "The resolution of geopolitical friction in the Middle East has immediately stabilised global risk assets. The decline in crude oil prices will alleviate near-term input cost pressures, giving central banks more breathing room. However, the macro narrative will be dominated by Kevin Warsh's first FOMC meeting, where any hawkish signals regarding the dot plot could quickly truncate the peace-induced relief rally."
    },
    crypto: {
      summary: [
        "Cryptocurrencies experience a broad recovery, with Bitcoin rebounding to the $65,000–$65,750 range and Ethereum hovering above $1,700.",
        "CFTC upgrades 'quasi-perpetual structure futures' to official perpetual contracts, creating a compliant pathway for US crypto derivatives.",
        "SEC approves T. Rowe Price's actively managed multi-asset crypto ETF, which can hold up to 17 different digital assets.",
        "Market sentiment remains fragile, with the Fear & Greed Index lingering at extreme fear levels (around 20) despite the price recovery."
      ],
      trendAnalysis: "The crypto market is demonstrating strong beta to macro risk relief, but underlying sentiment remains deeply scarred from the prolonged winter. The structural story, however, is exceptionally bullish for US institutional markets: the CFTC's perpetual contract ruling and the SEC's approval of a multi-asset ETF signal a rapid regulatory convergence that will make digital assets standard components of diversified wealth portfolios."
    }
  },
  {
    date: "2026-06-14",
    tech: {
      summary: [
        "SpaceX IPO dominates market conversations with its valuation surging past $2.1 trillion, redirecting investor capital into mega-cap space and technology stocks.",
        "Anthropic releases its new 'Fable 5' models, intensifying competition in the frontier AI model class.",
        "KPMG retracts its 'Excellence in Agentic AI' report after Swiss bank UBS and the UK's NHS flagged that success stories were fabricated due to AI hallucinations.",
        "Apple's WWDC 2026 continues to receive analysis following updates to Siri with advanced agentic AI capabilities."
      ],
      trendAnalysis: "The technology sector is experiencing a consolidation of power around mega-cap companies, particularly with SpaceX entering public markets. The retraction of KPMG's AI report is a crucial reminder of the reputational risks surrounding unverified agentic workflows, signalling that enterprise buyers will demand higher validation standards. The AI narrative remains dominant, but investment is shifting from speculative applications to hard infrastructure."
    },
    stocks: {
      summary: [
        "US markets show a late-week recovery after reports that President Trump cancelled planned strikes on Iran, fostering optimism for an imminent peace deal.",
        "S&P 500 and Dow close higher heading into the weekend, recovering from a sharp correction earlier in June driven by Broadcom's guidance miss.",
        "US headline inflation rises to 4.2% year-on-year in May, keeping the Federal Reserve's interest rate trajectory highly contested.",
        "US consumer sentiment improves slightly in June, aided by gasoline prices falling to around $4.10 per gallon."
      ],
      trendAnalysis: "Stock markets remain highly sensitive to geopolitical shifts and inflation data. The cancelation of strikes in the Middle East has brought immediate relief, particularly to oil prices, which have retreated to Brent crude sub-$88 per barrel. However, with inflation running at 4.2% and core CPI showing persistence, the Fed's higher-for-longer rate regime is expected to constrain valuation multiples outside of high-growth tech sectors."
    },
    crypto: {
      summary: [
        "Bloomberg characterizes the current downturn as the 'coldest crypto winter' in history, noting structural differences from previous bear cycles.",
        "Bitcoin faces persistent selling pressure, dropping below the $67,000–$60,000 range in early June.",
        "Fund outflows from US spot ETFs and competition for retail attention from the AI sector are cited as primary factors for price weakness.",
        "BlackRock files amendments for its new 'iShares Bitcoin Premium Income ETF', aimed offering yield-generating exposure to Bitcoin."
      ],
      trendAnalysis: "The cryptocurrency sector is undergoing a stark bifurcation. On one hand, retail interest has waned, drawn away by the AI boom, resulting in a prolonged price winter for major tokens. On the other hand, institutional plumbing continues to mature, as seen by BlackRock's new yield-generating ETF filings. The trend indicates that future growth will be driven by institutional integration and tokenisation rather than speculative retail-driven retail bull runs."
    }
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = newsData;
}
