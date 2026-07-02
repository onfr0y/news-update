// Application Controller for Daily Intelligence Briefing

document.addEventListener('DOMContentLoaded', () => {
  // Navigation & View Mode Elements
  const dateListEl = document.getElementById('date-list-id');
  const searchInputEl = document.getElementById('search-input-id');
  const currentDateEl = document.getElementById('current-date-id');
  const themeToggleEl = document.getElementById('theme-toggle-id');
  const sectorTabsEl = document.getElementById('sector-tabs-id');
  const archiveTitleEl = document.getElementById('archive-title-id');
  
  // View Mode Switchers
  const viewModeDailyBtn = document.getElementById('view-mode-daily-id');
  const viewModeWeeklyBtn = document.getElementById('view-mode-weekly-id');

  // Macro Ticker Elements
  const tickerCrudeVal = document.querySelector('#ticker-crude-id .ticker-val');
  const tickerCrudeChange = document.querySelector('#ticker-crude-id .ticker-change');
  const tickerSpVal = document.querySelector('#ticker-sp-id .ticker-val');
  const tickerSpChange = document.querySelector('#ticker-sp-id .ticker-change');
  const tickerNasdaqVal = document.querySelector('#ticker-nasdaq-id .ticker-val');
  const tickerNasdaqChange = document.querySelector('#ticker-nasdaq-id .ticker-change');
  const tickerBtcVal = document.querySelector('#ticker-btc-id .ticker-val');
  const tickerBtcChange = document.querySelector('#ticker-btc-id .ticker-change');
  
  // Sector Cards
  const cards = {
    tech: document.getElementById('card-tech-id'),
    stocks: document.getElementById('card-stocks-id'),
    crypto: document.getElementById('card-crypto-id')
  };

  // Content Containers
  const content = {
    tech: {
      sentiment: document.getElementById('tech-sentiment-id'),
      summary: document.getElementById('tech-summary-list-id'),
      trend: document.getElementById('tech-trend-prose-id'),
      chart: document.querySelector('#tech-chart-container-id .svg-chart-wrapper'),
      note: document.getElementById('tech-note-input-id')
    },
    stocks: {
      sentiment: document.getElementById('stocks-sentiment-id'),
      summary: document.getElementById('stocks-summary-list-id'),
      trend: document.getElementById('stocks-trend-prose-id'),
      chart: document.querySelector('#stocks-chart-container-id .svg-chart-wrapper'),
      note: document.getElementById('stocks-note-input-id')
    },
    crypto: {
      sentiment: document.getElementById('crypto-sentiment-id'),
      summary: document.getElementById('crypto-summary-list-id'),
      trend: document.getElementById('crypto-trend-prose-id'),
      chart: document.querySelector('#crypto-chart-container-id .svg-chart-wrapper'),
      note: document.getElementById('crypto-note-input-id')
    }
  };

  // State Variables
  let currentViewMode = 'daily'; // 'daily' or 'weekly'
  let activeDailyIndex = 0;
  let activeWeeklyKey = ''; // Key representing the current selected week
  let filterKeyword = '';
  let activeSector = 'all';

  // Group newsData by week
  function getWeeksData() {
    const weeks = {};
    newsData.forEach(entry => {
      const weekKey = getWeekKey(entry.date);
      const weekLabel = getWeekRangeLabel(entry.date);
      if (!weeks[weekKey]) {
        weeks[weekKey] = {
          label: weekLabel,
          entries: []
        };
      }
      weeks[weekKey].entries.push(entry);
    });
    return weeks;
  }

  // Get a unique key for the week (e.g. YYYY-Www)
  function getWeekKey(dateStr) {
    const parts = dateStr.split('-');
    const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    const day = date.getUTCDay();
    // Monday of that week
    const monday = new Date(date);
    monday.setUTCDate(date.getUTCDate() - (day === 0 ? 6 : day - 1));
    return monday.toISOString().slice(0, 10);
  }

  // Get friendly week range label (e.g. "15 Jun – 21 Jun 2026")
  function getWeekRangeLabel(dateStr) {
    const parts = dateStr.split('-');
    const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    const day = date.getUTCDay();
    const monday = new Date(date);
    monday.setUTCDate(date.getUTCDate() - (day === 0 ? 6 : day - 1));
    const sunday = new Date(monday);
    sunday.setUTCDate(monday.getUTCDate() + 6);
    
    const options = { day: 'numeric', month: 'short' };
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    return `${formatter.format(monday)} – ${formatter.format(sunday)} ${sunday.getUTCFullYear()}`;
  }

  // Format date string to localized text
  function formatDate(dateStr) {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  }

  // Render Ticker Strip
  function renderTicker(entry) {
    if (!entry || !entry.macro) {
      document.getElementById('macro-ticker-id').style.display = 'none';
      return;
    }
    document.getElementById('macro-ticker-id').style.display = 'block';

    updateTickerItem(entry.macro.brentCrude, tickerCrudeVal, tickerCrudeChange);
    updateTickerItem(entry.macro.sp500, tickerSpVal, tickerSpChange);
    updateTickerItem(entry.macro.nasdaq, tickerNasdaqVal, tickerNasdaqChange);
    updateTickerItem(entry.macro.bitcoin, tickerBtcVal, tickerBtcChange);
  }

  function updateTickerItem(macroItem, valEl, changeEl) {
    if (!macroItem) {
      valEl.textContent = '—';
      changeEl.textContent = '—';
      return;
    }
    valEl.textContent = macroItem.value;
    changeEl.textContent = macroItem.change;
    changeEl.className = `ticker-change ${macroItem.trend || 'neutral'}`;
  }

  // Render Daily view briefing
  function renderDailyBriefing(index) {
    const entry = newsData[index];
    if (!entry) return;

    currentDateEl.textContent = formatDate(entry.date);
    currentDateEl.setAttribute('datetime', entry.date);
    
    renderTicker(entry);

    // Render Tech, Stocks, Crypto
    renderDailySector('tech', entry.date, entry.tech);
    renderDailySector('stocks', entry.date, entry.stocks);
    renderDailySector('crypto', entry.date, entry.crypto);
    
    // Draw SVG charts
    drawSvgCharts();
  }

  function renderDailySector(sector, dateStr, sectorData) {
    const target = content[sector];
    if (!target) return;

    // Set Sentiment Badge
    const sentiment = sectorData ? sectorData.sentiment || 'Neutral' : 'Neutral';
    target.sentiment.textContent = sentiment;
    target.sentiment.className = `sentiment-badge ${sentiment.toLowerCase()}`;

    // Clear lists
    target.summary.innerHTML = '';
    
    if (sectorData && sectorData.summary && sectorData.summary.length > 0) {
      sectorData.summary.forEach((item, idx) => {
        const li = document.createElement('li');
        li.setAttribute('id', `bullet-${dateStr}-${sector}-${idx}`);
        
        // Setup text with clickable source anchor
        const textSpan = document.createElement('span');
        textSpan.textContent = typeof item === 'object' ? item.text : item;
        li.appendChild(textSpan);

        if (typeof item === 'object' && item.source && item.url) {
          const a = document.createElement('a');
          a.href = item.url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.className = 'source-link';
          a.textContent = `[${item.source}]`;
          // Prevent li highlighting toggle when clicking source link
          a.addEventListener('click', (e) => e.stopPropagation());
          li.appendChild(a);
        }

        // Highlight state restoration
        const isHighlighted = localStorage.getItem(`highlight-${dateStr}-${sector}-${idx}`) === 'true';
        if (isHighlighted) {
          li.classList.add('highlighted');
        }

        // Click event to toggle wabi-sabi highlight
        li.addEventListener('click', () => {
          const nowHighlighted = li.classList.toggle('highlighted');
          localStorage.setItem(`highlight-${dateStr}-${sector}-${idx}`, nowHighlighted);
        });

        target.summary.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = "No summarised intelligence available.";
      li.style.color = "var(--text-muted)";
      target.summary.appendChild(li);
    }

    // Trend Prose
    if (sectorData && sectorData.trendAnalysis) {
      target.trend.textContent = sectorData.trendAnalysis;
    } else {
      target.trend.textContent = "No trend analysis available.";
    }

    // Load local annotations note
    const savedNote = localStorage.getItem(`note-${dateStr}-${sector}`) || '';
    target.note.value = savedNote;
    
    // Set note event handler
    target.note.oninput = (e) => {
      localStorage.setItem(`note-${dateStr}-${sector}`, e.target.value);
    };
  }

  // Render Weekly view briefing
  function renderWeeklyBriefing(weekKey) {
    const weeks = getWeeksData();
    const weekData = weeks[weekKey];
    if (!weekData) return;

    currentDateEl.textContent = `Week: ${weekData.label}`;
    
    // Hide macro ticker in weekly aggregation
    document.getElementById('macro-ticker-id').style.display = 'none';

    // Aggregate sector contents
    renderWeeklySector('tech', weekKey, weekData.entries);
    renderWeeklySector('stocks', weekKey, weekData.entries);
    renderWeeklySector('crypto', weekKey, weekData.entries);

    // Dynamic SVG charts in weekly mode
    drawSvgCharts();
  }

  function renderWeeklySector(sector, weekKey, entries) {
    const target = content[sector];
    if (!target) return;

    // Aggregate sentiments (determine mode or default)
    const sentiments = entries.map(e => e[sector]?.sentiment || 'Neutral');
    const positiveCount = sentiments.filter(s => s === 'Bullish').length;
    const negativeCount = sentiments.filter(s => s === 'Bearish').length;
    const finalSentiment = positiveCount > negativeCount ? 'Bullish' : (negativeCount > positiveCount ? 'Bearish' : 'Neutral');
    
    target.sentiment.textContent = `${finalSentiment} (Weekly)`;
    target.sentiment.className = `sentiment-badge ${finalSentiment.toLowerCase()}`;

    // Clear lists & gather all weekly bullets
    target.summary.innerHTML = '';
    let bulletIdx = 0;

    entries.forEach(entry => {
      const sectorData = entry[sector];
      if (sectorData && sectorData.summary) {
        sectorData.summary.forEach(item => {
          const li = document.createElement('li');
          const dateLabel = document.createElement('span');
          dateLabel.style.fontSize = '0.75rem';
          dateLabel.style.color = 'var(--text-muted)';
          dateLabel.style.marginRight = '0.5rem';
          dateLabel.textContent = entry.date.split('-').slice(1).join('/'); // e.g. "06/15"
          li.appendChild(dateLabel);

          const textSpan = document.createElement('span');
          textSpan.textContent = typeof item === 'object' ? item.text : item;
          li.appendChild(textSpan);

          if (typeof item === 'object' && item.source && item.url) {
            const a = document.createElement('a');
            a.href = item.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.className = 'source-link';
            a.textContent = `[${item.source}]`;
            a.addEventListener('click', (e) => e.stopPropagation());
            li.appendChild(a);
          }

          // In weekly mode, highlights are mapped to the weekly index key
          const uniqueId = `highlight-${weekKey}-${sector}-${bulletIdx}`;
          const isHighlighted = localStorage.getItem(uniqueId) === 'true';
          if (isHighlighted) li.classList.add('highlighted');

          li.addEventListener('click', () => {
            const nowHighlighted = li.classList.toggle('highlighted');
            localStorage.setItem(uniqueId, nowHighlighted);
          });

          target.summary.appendChild(li);
          bulletIdx++;
        });
      }
    });

    if (target.summary.children.length === 0) {
      const li = document.createElement('li');
      li.textContent = "No compiled briefings for this week.";
      li.style.color = "var(--text-muted)";
      target.summary.appendChild(li);
    }

    // Concatenate trend analyses chronologically
    const combinedTrends = entries.map(e => e[sector]?.trendAnalysis).filter(Boolean).join('\n\n');
    target.trend.textContent = combinedTrends || "No trend analysis compiled.";

    // Load weekly annotations note
    const savedNote = localStorage.getItem(`note-${weekKey}-${sector}`) || '';
    target.note.value = savedNote;
    
    // Set note event handler
    target.note.oninput = (e) => {
      localStorage.setItem(`note-${weekKey}-${sector}`, e.target.value);
    };
  }

  // Draw dynamic SVG charts plotting values from newsData
  function drawSvgCharts() {
    // Reverse newsData to chronological order
    const chronoData = [...newsData].reverse().filter(entry => entry.macro);
    if (chronoData.length === 0) return;

    const dates = chronoData.map(e => e.date);

    // 1. Tech Index (Nasdaq proxy values)
    const nasdaqValues = chronoData.map(e => parseFloat(e.macro.nasdaq.value.replace(/,/g, '')));
    drawSvgChart(content.tech.chart, nasdaqValues, dates, 'var(--accent-olive)');

    // 2. Stocks Index (S&P 500 proxy values)
    const sp500Values = chronoData.map(e => parseFloat(e.macro.sp500.value.replace(/,/g, '')));
    drawSvgChart(content.stocks.chart, sp500Values, dates, 'var(--accent-clay)');

    // 3. Crypto Index (Bitcoin proxy values)
    const bitcoinValues = chronoData.map(e => parseFloat(e.macro.bitcoin.value.replace(/[\$,]/g, '')));
    drawSvgChart(content.crypto.chart, bitcoinValues, dates, 'var(--accent-taupe)');
  }

  function drawSvgChart(wrapper, values, dates, strokeColor) {
    if (!wrapper) return;
    if (values.length < 2) {
      wrapper.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted)">Awaiting more data logs to plot charts...</span>`;
      return;
    }

    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    const width = 340;
    const height = 90;
    const paddingX = 15;
    const paddingY = 15;

    // Map points to SVG canvas
    const points = values.map((val, idx) => {
      const x = paddingX + (idx / (values.length - 1)) * (width - paddingX * 2);
      const y = height - paddingY - ((val - minVal) / range) * (height - paddingY * 2);
      return { x, y };
    });

    // Generate path descriptions
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
    }

    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - 5} L ${points[0].x} ${height - 5} Z`;

    const svgHtml = `
      <svg viewBox="0 0 ${width} ${height}" class="trend-chart-svg">
        <defs>
          <linearGradient id="chart-gradient-${strokeColor.replace(/[^a-zA-Z]/g, '')}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <!-- Horizontal grid line -->
        <line x1="${paddingX}" y1="${height / 2}" x2="${width - paddingX}" y2="${height / 2}" stroke="var(--border-color)" stroke-dasharray="2,2" />
        
        <!-- Gradient Area -->
        <path d="${areaD}" fill="url(#chart-gradient-${strokeColor.replace(/[^a-zA-Z]/g, '')})" />
        
        <!-- Smooth line -->
        <path d="${pathD}" class="chart-path" style="stroke: ${strokeColor};" />
        
        <!-- Intersect Points -->
        ${points.map((pt, idx) => {
          const valDisplay = idx === 1 ? 'BTC-USD' : ''; // simplified title
          return `<circle cx="${pt.x}" cy="${pt.y}" r="3.5" class="chart-point" style="stroke: ${strokeColor};" title="${dates[idx]}: ${values[idx]}" />`;
        }).join('')}
      </svg>
    `;
    wrapper.innerHTML = svgHtml;
  }

  // Populate Date lists in sidebar
  function renderArchiveList() {
    dateListEl.innerHTML = '';
    
    if (currentViewMode === 'daily') {
      archiveTitleEl.textContent = 'Archive';
      // Filter dates based on search keyword
      const filteredEntries = newsData.map((entry, index) => ({ entry, originalIndex: index }))
        .filter(({ entry }) => {
          if (!filterKeyword) return true;
          const dateMatch = entry.date.includes(filterKeyword);
          const techMatch = entry.tech.summary.some(s => (s.text || s).toLowerCase().includes(filterKeyword)) || entry.tech.trendAnalysis.toLowerCase().includes(filterKeyword);
          const stocksMatch = entry.stocks.summary.some(s => (s.text || s).toLowerCase().includes(filterKeyword)) || entry.stocks.trendAnalysis.toLowerCase().includes(filterKeyword);
          const cryptoMatch = entry.crypto.summary.some(s => (s.text || s).toLowerCase().includes(filterKeyword)) || entry.crypto.trendAnalysis.toLowerCase().includes(filterKeyword);
          return dateMatch || techMatch || stocksMatch || cryptoMatch;
        });

      if (filteredEntries.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.textContent = "No briefings match search.";
        emptyMsg.style.padding = "1rem";
        emptyMsg.style.color = "var(--text-muted)";
        emptyMsg.style.fontSize = "0.9rem";
        dateListEl.appendChild(emptyMsg);
        return;
      }

      filteredEntries.forEach(({ entry, originalIndex }) => {
        const button = document.createElement('button');
        button.className = `date-item ${originalIndex === activeDailyIndex ? 'active' : ''}`;
        button.type = 'button';
        button.setAttribute('id', `archive-item-${entry.date}`);
        
        const displayDate = formatDate(entry.date);
        button.textContent = displayDate.replace(/^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday),\s/, '');
        
        button.addEventListener('click', () => {
          activeDailyIndex = originalIndex;
          document.querySelectorAll('.date-item').forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          renderDailyBriefing(activeDailyIndex);
        });

        dateListEl.appendChild(button);
      });
    } else {
      // Weekly Mode Archive
      archiveTitleEl.textContent = 'Weekly Log';
      const weeks = getWeeksData();
      const weekKeys = Object.keys(weeks);
      
      const filteredWeeks = weekKeys.filter(key => {
        if (!filterKeyword) return true;
        const week = weeks[key];
        const labelMatch = week.label.toLowerCase().includes(filterKeyword);
        const contentMatch = week.entries.some(entry => {
          const techMatch = entry.tech.summary.some(s => (s.text || s).toLowerCase().includes(filterKeyword)) || entry.tech.trendAnalysis.toLowerCase().includes(filterKeyword);
          const stocksMatch = entry.stocks.summary.some(s => (s.text || s).toLowerCase().includes(filterKeyword)) || entry.stocks.trendAnalysis.toLowerCase().includes(filterKeyword);
          const cryptoMatch = entry.crypto.summary.some(s => (s.text || s).toLowerCase().includes(filterKeyword)) || entry.crypto.trendAnalysis.toLowerCase().includes(filterKeyword);
          return techMatch || stocksMatch || cryptoMatch;
        });
        return labelMatch || contentMatch;
      });

      if (filteredWeeks.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.textContent = "No weeks match search.";
        emptyMsg.style.padding = "1rem";
        emptyMsg.style.color = "var(--text-muted)";
        emptyMsg.style.fontSize = "0.9rem";
        dateListEl.appendChild(emptyMsg);
        return;
      }

      // Default active weekly key if empty
      if (!activeWeeklyKey && filteredWeeks.length > 0) {
        activeWeeklyKey = filteredWeeks[0];
      }

      filteredWeeks.forEach(key => {
        const week = weeks[key];
        const button = document.createElement('button');
        button.className = `date-item ${key === activeWeeklyKey ? 'active' : ''}`;
        button.type = 'button';
        button.setAttribute('id', `archive-item-${key}`);
        button.textContent = week.label.replace(/\s\d{4}$/, ''); // clean year for compact display
        
        button.addEventListener('click', () => {
          activeWeeklyKey = key;
          document.querySelectorAll('.date-item').forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          renderWeeklyBriefing(activeWeeklyKey);
        });

        dateListEl.appendChild(button);
      });
    }
  }

  // Mode View Switcher Toggles
  viewModeDailyBtn.addEventListener('click', () => {
    if (currentViewMode === 'daily') return;
    currentViewMode = 'daily';
    viewModeWeeklyBtn.classList.remove('active');
    viewModeDailyBtn.classList.add('active');
    renderArchiveList();
    renderDailyBriefing(activeDailyIndex);
  });

  viewModeWeeklyBtn.addEventListener('click', () => {
    if (currentViewMode === 'weekly') return;
    currentViewMode = 'weekly';
    viewModeDailyBtn.classList.remove('active');
    viewModeWeeklyBtn.classList.add('active');
    
    const weeks = getWeeksData();
    const keys = Object.keys(weeks);
    if (keys.length > 0) activeWeeklyKey = keys[0];
    
    renderArchiveList();
    renderWeeklyBriefing(activeWeeklyKey);
  });

  // Sector filter tabs
  function applySectorFilter(sector) {
    activeSector = sector;
    document.querySelectorAll('.tab-btn').forEach(btn => {
      if (btn.getAttribute('data-target') === sector) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    Object.keys(cards).forEach(key => {
      const card = cards[key];
      if (!card) return;
      if (sector === 'all' || sector === key) {
        card.style.display = 'block';
        card.style.animation = 'none';
        card.offsetHeight; /* trigger reflow */
        card.style.animation = 'fadeIn 0.3s ease-out';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Dark Mode Theme Init
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.body.classList.add('dark-mode');
    }
  }

  themeToggleEl.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    drawSvgCharts(); // redraw charts to match color themes
  });

  // Search filter inputs
  searchInputEl.addEventListener('input', (e) => {
    filterKeyword = e.target.value.toLowerCase().trim();
    renderArchiveList();
  });

  // Sector tabs click triggers
  sectorTabsEl.addEventListener('click', (e) => {
    const target = e.target.closest('.tab-btn');
    if (!target) return;
    applySectorFilter(target.getAttribute('data-target'));
  });

  // Initialize view
  initTheme();
  if (typeof newsData !== 'undefined' && newsData.length > 0) {
    renderDailyBriefing(activeDailyIndex);
    renderArchiveList();
  }
});
