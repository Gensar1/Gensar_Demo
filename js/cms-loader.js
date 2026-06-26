(function () {
  var CACHE_BUST = Date.now();

  function loadScript(url) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = url + '?_=' + CACHE_BUST;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function loadCSS(url) {
    return new Promise(function (resolve, reject) {
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = url + '?_=' + CACHE_BUST;
      l.onload = resolve;
      l.onerror = reject;
      document.head.appendChild(l);
    });
  }

  function fetchText(url) {
    return fetch(url + '?_=' + CACHE_BUST).then(function (r) {
      if (!r.ok) throw new Error('Failed to fetch ' + url);
      return r.text();
    });
  }

  function parseFrontMatter(md) {
    var m = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!m) return { data: {}, content: md };
    var data = {};
    try {
      if (typeof jsyaml !== 'undefined') {
        data = jsyaml.load(m[1]) || {};
      }
    } catch (_) {}
    return { data: data, content: m[2] };
  }

  function escapeHtml(text) {
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }

  function getIconHtml(icon) {
    return icon ? '<i class="bi ' + escapeHtml(icon) + '"></i>' : '';
  }

  function loadCollection(collectionName) {
    var manifestUrl = 'content/' + collectionName + '/manifest.json';
    return fetchText(manifestUrl).then(function (jsonText) {
      var entries = [];
      try { entries = JSON.parse(jsonText); } catch (_) {}
      if (!Array.isArray(entries)) entries = [];
      var promises = entries.map(function (slug) {
        var fileUrl = 'content/' + collectionName + '/' + slug + '.md';
        return fetchText(fileUrl).then(function (raw) {
          var parsed = parseFrontMatter(raw);
          parsed.data.slug = slug;
          return parsed;
        }).catch(function () { return null; });
      });
      return Promise.all(promises).then(function (results) {
        return results.filter(Boolean);
      });
    });
  }

  function renderServices(items) {
    var container = document.getElementById('services-dynamic-grid');
    if (!container) return;
    items.sort(function (a, b) { return (a.data.order || 0) - (b.data.order || 0); });
    var html = '';
    items.forEach(function (item) {
      var d = item.data;
      if (d.enabled === false) return;
      var featuresHtml = '';
      if (Array.isArray(d.features)) {
        featuresHtml = '<ul class="service-feature-list mt-3">' +
          d.features.map(function (f) {
            return '<li><i class="bi bi-check-circle-fill"></i> ' + escapeHtml(f) + '</li>';
          }).join('') +
          '</ul>';
      }
      var tintClass = d.category === 'Non-IT' ? 'border-blue-tint' : 'border-purple-tint';
      var iconClass = d.category === 'Non-IT' ? 'icon-blue' : 'icon-purple';
      var gridClass = (items.filter(function (x) { return x.data.enabled !== false; }).length === 1) ? 'col-lg-12' : 'col-lg-4 col-md-6';
      html += '<div class="' + gridClass + '">' +
        '<div class="service-interactive-card ' + tintClass + '">' +
        '<div class="service-card-icon ' + iconClass + '">' +
        getIconHtml(d.icon) +
        '</div>' +
        '<h3 class="service-card-title mt-4">' + escapeHtml(d.title) + '</h3>' +
        '<p class="service-card-desc">' + escapeHtml(d.description) + '</p>' +
        featuresHtml +
        '</div>' +
        '</div>';
    });
    container.innerHTML = html;
  }

  function renderTeam(items) {
    var container = document.getElementById('team-dynamic-grid');
    if (!container) return;
    items.sort(function (a, b) { return (a.data.order || 0) - (b.data.order || 0); });
    var html = '';
    items.forEach(function (item) {
      var d = item.data;
      var photoUrl = d.photo || '';
      if (photoUrl && !photoUrl.match(/^https?:\/\//) && !photoUrl.startsWith('/')) {
        photoUrl = photoUrl;
      }
      var linkedinLink = d.linkedin ? '<a href="' + escapeHtml(d.linkedin) + '" target="_blank" class="stream-link"><i class="bi bi-linkedin"></i> LinkedIn</a>' : '';
      var emailLink = d.email ? '<a href="mailto:' + escapeHtml(d.email) + '" class="stream-link ms-3"><i class="bi bi-envelope"></i> Contact</a>' : '';
      html += '<div class="col-lg-4 col-md-6 mb-4">' +
        '<div class="bio-stream-row active-purple">' +
        '<div class="stream-content text-center">' +
        (photoUrl ? '<img src="' + escapeHtml(photoUrl) + '" alt="' + escapeHtml(d.name) + '" class="img-fluid rounded-circle mb-3" style="width:120px;height:120px;object-fit:cover;">' : '') +
        '<h3 class="leader-name-text">' + escapeHtml(d.name) + '</h3>' +
        '<span class="leader-pill pill-purple">' + escapeHtml(d.designation) + '</span>' +
        (d.bio ? '<p class="leader-desc-text mt-2">' + marked.parse(d.bio) + '</p>' : '') +
        '<div class="leader-links mt-2">' + linkedinLink + emailLink + '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    });
    container.innerHTML = html;
  }

  function renderJobs(items) {
    var container = document.getElementById('jobs-dynamic-list');
    if (!container) return;
    items.sort(function (a, b) { return (a.data.order || 0) - (b.data.order || 0); });
    var html = '';
    items.forEach(function (item) {
      var d = item.data;
      if (d.published === false) return;
      var badgeColor = 'badge-purple';
      if (d.type === 'Internship') badgeColor = 'badge-blue';
      var skillsHtml = '';
      if (Array.isArray(d.skills)) {
        skillsHtml = '<div class="tools-list my-3">' +
          d.skills.map(function (s) { return '<span class="tool-badge">' + escapeHtml(s) + '</span>'; }).join('') +
          '</div>';
      }
      html += '<div class="col-lg-6 job-item-card">' +
        '<div class="course-detail-pane h-100 d-flex flex-column justify-content-between" style="padding: 30px;">' +
        '<div>' +
        '<div class="d-flex justify-content-between align-items-start mb-3">' +
        '<h4 class="mb-0 text-gradient-purple">' + escapeHtml(d.title) + '</h4>' +
        '<span class="badge ' + badgeColor + '" style="font-size:0.75rem;">' + escapeHtml(d.type) + '</span>' +
        '</div>' +
        '<p class="text-secondary" style="font-size:0.9rem;">' + escapeHtml(d.description) + '</p>' +
        skillsHtml +
        '</div>' +
        '<div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top" style="border-color:var(--border-color) !important;">' +
        '<span class="text-secondary font-monospace" style="font-size:0.85rem;"><i class="bi bi-geo-alt-fill me-1"></i>' + escapeHtml(d.location) + '</span>' +
        '<a href="mailto:' + escapeHtml(d.apply_email) + '" class="btn-premium btn-premium-secondary" style="padding:8px 18px;font-size:0.85rem;">Apply Now</a>' +
        '</div>' +
        '</div>' +
        '</div>';
    });
    container.innerHTML = html;
  }

  function renderPrograms(items) {
    var container = document.getElementById('programs-dynamic-grid');
    if (!container) return;
    items.sort(function (a, b) { return (a.data.order || 0) - (b.data.order || 0); });
    var catOrder = { 'AI-ML': 1, 'Data Science': 2, 'Data Analytics': 3, 'Cyber Security': 4, 'Full Stack': 5 };
    items.sort(function (a, b) {
      var ca = catOrder[a.data.category] || 99;
      var cb = catOrder[b.data.category] || 99;
      return ca - cb || (a.data.order || 0) - (b.data.order || 0);
    });
    var html = '';
    items.forEach(function (item) {
      var d = item.data;
      if (d.published === false) return;
      var toolsHtml = '';
      if (Array.isArray(d.tools_technologies)) {
        toolsHtml = '<div class="tools-list my-3">' +
          d.tools_technologies.map(function (t) { return '<span class="tool-badge">' + escapeHtml(t) + '</span>'; }).join('') +
          '</div>';
      }
      var outcomesHtml = '';
      if (Array.isArray(d.learning_outcomes) && d.learning_outcomes.length) {
        outcomesHtml = '<ul class="syllabus-topic-list mt-3">' +
          d.learning_outcomes.map(function (o) { return '<li>' + escapeHtml(o) + '</li>'; }).join('') +
          '</ul>';
      }
      html += '<div class="col-lg-4 col-md-6 mb-4">' +
        '<div class="course-detail-pane h-100" style="padding:25px;">' +
        '<span class="badge badge-purple" style="font-size:0.75rem;margin-bottom:10px;">' + escapeHtml(d.category) + '</span>' +
        '<h4 class="text-gradient-purple mb-2">' + escapeHtml(d.title) + '</h4>' +
        '<div class="course-meta-grid mb-3">' +
        '<div class="meta-item"><span class="meta-label">Duration</span><span class="meta-value">' + escapeHtml(d.duration) + '</span></div>' +
        '<div class="meta-item"><span class="meta-label">Mode</span><span class="meta-value">' + escapeHtml(d.mode) + '</span></div>' +
        '</div>' +
        '<p class="text-secondary" style="font-size:0.9rem;">' + escapeHtml(d.description) + '</p>' +
        toolsHtml +
        outcomesHtml +
        '</div>' +
        '</div>';
    });
    container.innerHTML = html;
  }

  function init() {
    var deps = [];
    if (typeof marked === 'undefined') deps.push(loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js'));
    if (typeof jsyaml === 'undefined') deps.push(loadScript('https://cdn.jsdelivr.net/npm/js-yaml@4/dist/js-yaml.min.js'));

    Promise.all(deps).then(function () {
      var containers = {
        services: document.getElementById('services-dynamic-grid'),
        team: document.getElementById('team-dynamic-grid'),
        jobs: document.getElementById('jobs-dynamic-list'),
        programs: document.getElementById('programs-dynamic-grid')
      };

      var promises = [];
      if (containers.services) promises.push(loadCollection('services').then(renderServices));
      if (containers.team) promises.push(loadCollection('team').then(renderTeam));
      if (containers.jobs) promises.push(loadCollection('jobs').then(renderJobs));
      if (containers.programs) promises.push(loadCollection('programs').then(renderPrograms));

      Promise.all(promises).catch(function (err) {
        console.error('CMS Loader error:', err);
      });
    }).catch(function (err) {
      console.error('CMS Loader dependency error:', err);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
