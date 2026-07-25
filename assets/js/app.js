(function () {
  const data = window.siteData || {};
  const root = document.getElementById('content');
  const page = document.body.dataset.page;
  const escapeHTML = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const external = (url) => url && !url.startsWith('mailto:') && !url.startsWith('assets/');
  const linkAttrs = (url) => external(url) ? ' target="_blank" rel="noopener noreferrer"' : '';
  const renderLinks = (links = [], className = 'inline-links') => {
    if (!links.length) return '';
    return `<div class="${className}">${links.map(link => `<a href="${escapeHTML(link.url)}"${linkAttrs(link.url)}>${escapeHTML(link.label)}</a>`).join('')}</div>`;
  };
  const renderObjectLinks = (links = {}) => {
    const entries = Object.entries(links).filter(([, url]) => url);
    if (!entries.length) return '';
    return `<div class="publication-links">${entries.map(([label, url]) => `<a href="${escapeHTML(url)}"${linkAttrs(url)}>${escapeHTML(label)}</a>`).join('')}</div>`;
  };
  const highlightName = (authors = '') => {
    let safe = escapeHTML(authors);
    const starred = '__MMAAZ_STARRED_AUTHOR__';
    safe = safe.replaceAll('Muhammad Maaz*', starred);
    safe = safe.replaceAll('Muhammad Maaz', '<strong>Muhammad Maaz</strong>');
    safe = safe.replaceAll(starred, '<strong>Muhammad Maaz*</strong>');
    return safe;
  };

  function renderHero() {
    const p = data.profile;
    const cvLink = p.cv ? `<a class="button-link primary" href="${escapeHTML(p.cv)}">Download CV</a>` : '';
    const links = (p.links || []).map(link => `<a class="button-link" href="${escapeHTML(link.url)}"${linkAttrs(link.url)}>${escapeHTML(link.label)}</a>`).join('');
    const stats = (p.stats || []).map(stat => `
      <div class="stat-card">
        <div class="stat-value">${escapeHTML(stat.value)}</div>
        <div class="stat-label">${escapeHTML(stat.label)}</div>
      </div>`).join('');
    const statsBlock = stats ? `<div class="stats-grid">${stats}</div>` : '';
    const interests = (p.interests || []).map(item => `<li class="pill">${escapeHTML(item)}</li>`).join('');
    return `
      <section class="container hero" id="about">
        <div>
          <p class="eyebrow">${escapeHTML(p.title)}</p>
          <h1>${escapeHTML(p.name)}</h1>
          <p class="lead">${escapeHTML(p.tagline)}</p>
          <p class="bio-text">${p.bio}</p>
          <div class="hero-links">${cvLink}${links}</div>
          ${statsBlock}
        </div>
        <aside class="profile-card" aria-label="Profile summary">
          <img class="profile-image" src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" onerror="this.onerror=null;this.src='${escapeHTML(p.imageFallback)}';">
          <h2>${escapeHTML(p.name)}</h2>
          <p>${escapeHTML(p.affiliation)}</p>
          <ul class="interest-list">${interests}</ul>
        </aside>
      </section>`;
  }

  function renderNews(limit = 3) {
    const items = (data.news || []).map((item, index) => `
      <article class="news-item" ${index >= limit ? 'hidden data-extra-news' : ''}>
        <div class="news-date">${escapeHTML(item.date)}</div>
        <div>
          <h3 class="news-title">${escapeHTML(item.title)}</h3>
          <p class="news-text">${escapeHTML(item.text)}</p>
          ${renderLinks(item.links)}
        </div>
      </article>`).join('');
    const showButton = (data.news || []).length > limit ? '<button class="show-more" data-show-news type="button">Show all news</button>' : '';
    return `
      <section class="container section" id="news">
        <div class="section-header">
          <div>
            <p class="section-kicker">Updates</p>
            <h2>News</h2>
            <p class="section-description">Recent papers, releases, awards, and professional updates.</p>
          </div>
        </div>
        <div class="news-list">${items}</div>
        ${showButton}
      </section>`;
  }

  function renderPublications() {
    const filterButtons = ['All', ...(data.publicationTopics || [])].map((topic, index) =>
      `<button class="filter-button ${index === 0 ? 'active' : ''}" type="button" data-topic-filter="${escapeHTML(topic)}">${escapeHTML(topic)}</button>`
    ).join('');
    const publications = (data.publications || []).map(pub => `
      <article class="publication-card" data-topics="${escapeHTML((pub.topics || []).join('|'))}">
        <div class="pub-topline">
          <span class="pub-venue">${escapeHTML(pub.venue)}</span>
          <span class="pub-year">${escapeHTML(pub.year)}</span>
        </div>
        <h3>${escapeHTML(pub.title)}</h3>
        <p class="authors">${highlightName(pub.authors)}</p>
        <p class="pub-summary">${escapeHTML(pub.summary)}</p>
        <div class="badge-row">${(pub.badges || []).map(badge => `<span class="badge">${escapeHTML(badge)}</span>`).join('')}</div>
        ${renderObjectLinks(pub.links)}
      </article>`).join('');
    return `
      <section class="container section" id="publications">
        <div class="section-header">
          <div>
            <p class="section-kicker">Research output</p>
            <h2>Selected Publications</h2>
            <p class="section-description">Brief summaries of representative work.
          </div>
        </div>
        <div class="filter-row" aria-label="Publication filters">${filterButtons}</div>
        <div class="publication-list">${publications}</div>
      </section>`;
  }

  function renderExperienceEducation() {
    const renderItems = (items, type) => (items || []).map(item => `
      <li>
        <div class="period">${escapeHTML(item.period)}</div>
        <div class="title">${escapeHTML(type === 'education' ? item.degree : item.role)}</div>
        <div class="org">${escapeHTML(item.org)}</div>
        <div class="details">${escapeHTML(item.details)}</div>
      </li>`).join('');
    return `
      <section class="container section" id="experience">
        <div class="section-header">
          <div>
            <p class="section-kicker">Background</p>
            <h2>Experience and Education</h2>
          </div>
          <a class="button-link" href="timeline.html">Full timeline</a>
        </div>
        <div class="two-column">
          <div class="compact-card">
            <h3>Experience</h3>
            <ul class="item-list">${renderItems(data.experience, 'experience')}</ul>
          </div>
          <div class="compact-card">
            <h3>Education</h3>
            <ul class="item-list">${renderItems(data.education, 'education')}</ul>
          </div>
        </div>
      </section>`;
  }

  function renderAwardsTalks() {
    const cards = (data.awards || []).map(item => `
      <article class="award-card">
        <div class="year">${escapeHTML(item.year)}</div>
        <h3>${escapeHTML(item.title)}</h3>
        <p>${escapeHTML(item.detail)}</p>
      </article>`).join('');
    const talks = (data.talks || []).map(talk => `
      <li>
        <div class="period">${escapeHTML(talk.year)}</div>
        <div class="title">${escapeHTML(talk.title)}</div>
        <div class="details">${escapeHTML(talk.detail)}</div>
      </li>`).join('');
    return `
      <section class="container section" id="awards">
        <div class="section-header">
          <div>
            <p class="section-kicker">Recognition</p>
            <h2>Awards and Invited Talks</h2>
          </div>
        </div>
        <div class="awards-grid">${cards}</div>
        <div class="compact-card" style="margin-top:14px">
          <h3>Invited talks</h3>
          <ul class="item-list">${talks}</ul>
        </div>
      </section>`;
  }

  function renderTimelinePage() {
    const items = (data.timeline || []).map((item, index) => `
      <article class="timeline-item ${index % 2 === 0 ? 'timeline-left' : 'timeline-right'}">
        <div class="timeline-marker" aria-hidden="true"></div>
        <div class="timeline-content">
          <div class="timeline-date">${escapeHTML(item.date)}</div>
          <h2>${escapeHTML(item.title)}</h2>
          <p>${escapeHTML(item.text)}</p>
          ${renderLinks(item.links, 'timeline-links')}
        </div>
      </article>`).join('');
    root.innerHTML = `
      <section class="container timeline-hero">
        <p class="eyebrow">Career and research milestones</p>
        <h1>Timeline</h1>
        <p class="lead">A concise chronology of research, education, awards, and professional milestones.</p>
        <div class="hero-links"><a class="button-link" href="index.html">Back to home</a><a class="button-link primary" href="assets/pdf/MuhammadMaaz_CV.pdf">Download CV</a></div>
      </section>
      <section class="container timeline-wrap">${items}</section>`;
  }

  function bindInteractions() {
    const showNews = document.querySelector('[data-show-news]');
    if (showNews) {
      showNews.addEventListener('click', () => {
        document.querySelectorAll('[data-extra-news]').forEach(item => item.hidden = false);
        showNews.remove();
      });
    }
    const filters = document.querySelectorAll('[data-topic-filter]');
    const cards = document.querySelectorAll('.publication-card');
    filters.forEach(button => {
      button.addEventListener('click', () => {
        const topic = button.dataset.topicFilter;
        filters.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        cards.forEach(card => {
          const topics = (card.dataset.topics || '').split('|');
          card.hidden = topic !== 'All' && !topics.includes(topic);
        });
      });
    });
  }

  function renderHomePage() {
    root.innerHTML = [
      renderHero(),
      renderNews(),
      renderPublications(),
      renderExperienceEducation(),
      renderAwardsTalks()
    ].join('');
    bindInteractions();
  }

  const yearNode = document.getElementById('year');
  if (yearNode) yearNode.textContent = new Date().getFullYear();
  document.querySelectorAll('[data-updated]').forEach(node => node.textContent = data.updated || '');

  if (page === 'timeline') renderTimelinePage();
  else renderHomePage();
})();
