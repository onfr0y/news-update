// Application Controller for Daily Intelligence Briefing

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const dateListEl = document.getElementById('date-list-id');
  const searchInputEl = document.getElementById('search-input-id');
  const currentDateEl = document.getElementById('current-date-id');
  const themeToggleEl = document.getElementById('theme-toggle-id');
  const sectorTabsEl = document.getElementById('sector-tabs-id');
  
  // Sector Cards
  const cards = {
    tech: document.getElementById('card-tech-id'),
    stocks: document.getElementById('card-stocks-id'),
    crypto: document.getElementById('card-crypto-id')
  };

  // Content Containers
  const content = {
    tech: {
      summary: document.getElementById('tech-summary-list-id'),
      trend: document.getElementById('tech-trend-prose-id')
    },
    stocks: {
      summary: document.getElementById('stocks-summary-list-id'),
      trend: document.getElementById('stocks-trend-prose-id')
    },
    crypto: {
      summary: document.getElementById('crypto-summary-list-id'),
      trend: document.getElementById('crypto-trend-prose-id')
    }
  };

  // State
  let activeIndex = 0;
  let filterKeyword = '';
  let activeSector = 'all';

  // Format date string to Muji-style localized typography
  // Example: "2026-06-14" -> "Sunday, 14 June 2026"
  function formatDate(dateStr) {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    
    // Create date object in UTC to avoid timezone shifts
    const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    
    const options = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      timeZone: 'UTC'
    };
    
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  }

  // Populate news data for the selected date index
  function renderBriefing(index) {
    const entry = newsData[index];
    if (!entry) return;

    // Update main header date display
    currentDateEl.textContent = formatDate(entry.date);
    currentDateEl.setAttribute('datetime', entry.date);

    // Update Tech Section
    renderSection(content.tech, entry.tech);
    
    // Update Stocks Section
    renderSection(content.stocks, entry.stocks);
    
    // Update Crypto Section
    renderSection(content.crypto, entry.crypto);
  }

  function renderSection(domElements, sectionData) {
    // Clear lists
    domElements.summary.innerHTML = '';
    
    if (sectionData && sectionData.summary && sectionData.summary.length > 0) {
      sectionData.summary.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        domElements.summary.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = "No summarised intelligence available for this date.";
      li.style.color = "var(--text-muted)";
      domElements.summary.appendChild(li);
    }

    if (sectionData && sectionData.trendAnalysis) {
      domElements.trend.textContent = sectionData.trendAnalysis;
    } else {
      domElements.trend.textContent = "No trend analysis available for this date.";
      domElements.trend.style.color = "var(--text-muted)";
    }
  }

  // Generate the list of historical dates in the sidebar archive
  function renderArchiveList() {
    dateListEl.innerHTML = '';
    
    // Filter dates based on search keyword
    const filteredEntries = newsData.map((entry, index) => ({ entry, originalIndex: index }))
      .filter(({ entry }) => {
        if (!filterKeyword) return true;
        
        const dateMatch = entry.date.includes(filterKeyword);
        const techMatch = entry.tech.summary.some(s => s.toLowerCase().includes(filterKeyword)) || entry.tech.trendAnalysis.toLowerCase().includes(filterKeyword);
        const stocksMatch = entry.stocks.summary.some(s => s.toLowerCase().includes(filterKeyword)) || entry.stocks.trendAnalysis.toLowerCase().includes(filterKeyword);
        const cryptoMatch = entry.crypto.summary.some(s => s.toLowerCase().includes(filterKeyword)) || entry.crypto.trendAnalysis.toLowerCase().includes(filterKeyword);
        
        return dateMatch || techMatch || stocksMatch || cryptoMatch;
      });

    if (filteredEntries.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.textContent = "No briefs match your search.";
      emptyMsg.style.padding = "1rem";
      emptyMsg.style.color = "var(--text-muted)";
      emptyMsg.style.fontSize = "0.9rem";
      dateListEl.appendChild(emptyMsg);
      return;
    }

    filteredEntries.forEach(({ entry, originalIndex }) => {
      const button = document.createElement('button');
      button.className = `date-item ${originalIndex === activeIndex ? 'active' : ''}`;
      button.type = 'button';
      button.setAttribute('id', `archive-item-${entry.date}`);
      
      // Clean date format for list items
      const displayDate = formatDate(entry.date);
      button.textContent = displayDate.replace(/^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday),\s/, '');
      
      button.addEventListener('click', () => {
        activeIndex = originalIndex;
        // Update active class on items
        document.querySelectorAll('.date-item').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        renderBriefing(activeIndex);
      });

      dateListEl.appendChild(button);
    });
  }

  // Handle section visibility filters (Tabs)
  function applySectorFilter(sector) {
    activeSector = sector;
    
    // Update tabs styling
    document.querySelectorAll('.tab-btn').forEach(btn => {
      if (btn.getAttribute('data-target') === sector) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Toggle card visibility
    Object.keys(cards).forEach(key => {
      const card = cards[key];
      if (!card) return;
      
      if (sector === 'all' || sector === key) {
        card.style.display = 'block';
        // Force reflow and re-trigger entry animation
        card.style.animation = 'none';
        card.offsetHeight; /* trigger reflow */
        card.style.animation = 'fadeIn 0.3s ease-out';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Theme Toggling (Dark Mode)
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
  });

  // Search Interaction
  searchInputEl.addEventListener('input', (e) => {
    filterKeyword = e.target.value.toLowerCase().trim();
    renderArchiveList();
  });

  // Tab Events
  sectorTabsEl.addEventListener('click', (e) => {
    const target = e.target.closest('.tab-btn');
    if (!target) return;
    applySectorFilter(target.getAttribute('data-target'));
  });

  // Initialize
  initTheme();
  if (typeof newsData !== 'undefined' && newsData.length > 0) {
    renderBriefing(activeIndex);
    renderArchiveList();
  }
});
