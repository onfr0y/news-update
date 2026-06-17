const newsData = [
  {
    date: "2026-06-17",
    tech: {
      summary: [
        "The global VivaTech 2026 conference kicks off in Paris, showcasing AI innovation with keynote speakers Jeff Bezos, Yann LeCun, and Shantanu Narayen.",
        "Univers debuts a new 'Platform for Physical AI' focusing on automating and optimizing physical industrial operations such as logistics, energy, and factory automation.",
        "SpaceX stock surges on its third day of trading, driving the private aerospace company's valuation to exceed that of Amazon.",
        "Broadcom, Nvidia, and other semiconductor heavyweights experience valuation pullbacks as investors raise caution over near-term pricing momentum."
      ],
      trendAnalysis: "AI is moving rapidly from pure-software digital assistants to physical, industrial infrastructure applications, as evidenced by Univers' Physical AI launch and the growing integration of immersive Pro AV systems in smart buildings. In the public equity market, SpaceX's historic IPO has reshuffled mega-cap dominance by overtaking Amazon's valuation, signaling a massive investor appetite for frontier space tech. Concurrently, traditional semiconductor heavyweights are seeing a healthy consolidation as high-multiple valuations undergo short-term repricing ahead of central bank updates."
    },
    stocks: {
      summary: [
        "The Dow Jones Industrial Average sets new intraday records, continuing its historic multi-day winning streak despite tech-sector pressure.",
        "Nasdaq and S&P 500 face downward pressure from a broader sell-off in mega-cap technology and AI-linked stocks.",
        "Crude oil futures (Brent and WTI) fall below $80 per barrel for the first time since early March on optimism regarding a U.S.-Iran diplomatic agreement.",
        "Investors focus on the FOMC meeting today, the first led by new Chair Kevin Warsh, where interest rates are expected to hold steady at 3.50%–3.75%."
      ],
      trendAnalysis: "The stock market is exhibiting a notable sector rotation, where capital is drifting out of high-flying technology giants and flowing into more defensive and cyclical Dow components. Geopolitical progress between the U.S. and Iran has effectively deflated the energy risk premium, pushing oil below $80 and helping to curb mid-term inflation concerns. However, the overarching market trajectory hinges on Kevin Warsh's debut Federal Reserve guidance, with investors dissecting updated 'dot plot' forecasts for indications of when the Fed will begin its rate-cutting cycle."
    },
    crypto: {
      summary: [
        "Bitcoin consolidates in a mid-morning trading range of $65,600–$65,800, showing resilience after earlier liquidations below the $61,000 level.",
        "Prediction markets Kalshi and Polymarket report explosive transaction volumes and growth, largely driven by betting activity surrounding the ongoing World Cup.",
        "The Bitcoin++ conference starts in Nairobi, Kenya, emphasizing developer tools and Layer-2 scaling integrations.",
        "DigiAssets 2026 wraps up in London, with institutional leaders outlining digital asset allocation and tokenization strategies."
      ],
      trendAnalysis: "The cryptocurrency market is transitioning into a mature consolidation phase, finding support in the $65,000 range following the geopolitical relief rally. A key structural driver of digital asset utility this quarter is the rapid adoption of prediction markets like Polymarket and Kalshi, which have found massive mainstream product-market fit during the World Cup. While institutional plumbing and developer infrastructure (like Bitcoin++ L2 solutions) continue to strengthen, the market remains hypersensitive to regulatory clarity and the Fed's macro interest rate decision."
    }
  },
  {
    date: "2026-06-16",
    tech: {
      summary: [
        "UK Prime Minister Sir Keir Starmer announces policy to ban children under 16 from major social media platforms starting Spring 2027.",
        "Amazon CEO Andy Jassy shifts strategies in India, focusing on sustainable e-commerce growth over high-risk 'Bezos era' media acquisitions.",
        "Ricoh announces strategic investment in AI-native vector database startup Weaviate via the RICOH Innovation Fund.",
        "Lockheed Martin's Skunk Works unveils 'Project Dragonfly,' an additively manufactured, robotically assembled attack drone."
      ],
      trendAnalysis: "The technology sector is seeing a shift from unrestricted consumer tech and speculative capital to highly structured regulatory boundaries and targeted enterprise AI infrastructure. The UK's planned social media ban on children under 16 points to a growing global trend of state-imposed guardrails on digital platforms. Simultaneously, enterprise investments like Ricoh's backing of Weaviate emphasize a focus on scaling robust retrieval systems for unstructured data, while defense tech companies are adopting advanced manufacturing pipelines to speed up physical hardware deployments."
    },
    stocks: {
      summary: [
        "Global equity markets remain strong as a memorandum of understanding (MoU) between the US and Iran is signed, promising stability in the Strait of Hormuz.",
        "Brent and WTI crude futures drop significantly, easing energy inflation fears and giving central banks room to maneuver.",
        "Yorkville International Capital Corp. begins trading on Nasdaq following its initial public offering (YICCU).",
        "Markets adopt a cautious 'wait-and-see' stance ahead of the Federal Reserve policy announcement under new Chair Kevin Warsh."
      ],
      trendAnalysis: "The geopolitical breakthrough between the US and Iran has successfully relieved the energy market premium, leading to a significant drop in crude prices and triggering a global risk-on rally. However, equity indices are displaying near-term consolidation as investors turn their focus to central bank policy. Kevin Warsh's debut Federal Reserve meeting is the primary macro catalyst; markets are pricing in paused rates but remain hypersensitive to how the new leadership will balance cooling energy costs against persistent core service inflation."
    },
    crypto: {
      summary: [
        "BlackRock launches the iShares Bitcoin Premium Income ETF (BITA) on Nasdaq, utilizing a covered-call strategy to target a 15%–25% annual yield.",
        "Bitmine Immersion Technologies (NYSE: BMNR) announces its Ethereum treasury holdings have reached 5.62 million tokens.",
        "Bitmine's Series A Preferred Stock (BMNP) begins trading on the NYSE, expanding public options for crypto equity.",
        "Bitcoin and major digital assets hover around the $65,000–$65,750 range as the market digests the new yield-focused institutional products."
      ],
      trendAnalysis: "The launch of BlackRock's covered-call Bitcoin ETF represents a major milestone in the maturation of crypto-financial instruments, shifting the focus from simple spot exposure to structured yield-generating products. This transition appeals directly to income-focused institutional accounts, establishing digital assets as standard portfolio diversifiers. Concurrently, major miners like Bitmine aggressively scaling corporate treasuries into Ethereum demonstrates a structural pivot toward protocol-level staking yields, indicating that the industry is preparing for a yield-centric growth cycle."
    }
  },
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
