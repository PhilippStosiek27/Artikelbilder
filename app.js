(async function () {
  const manifestUrl = 'images.json';

  // Helper: Build base path that also works on GitHub Project Pages (/username/repo/)
  function getProjectBasePath() {
    // Strip trailing index.html if present
    const path = window.location.pathname.replace(/\/index\.html?$/i, '');
    // Ensure trailing slash
    return path.endsWith('/') ? path : path + '/';
  }

  const projectBase = getProjectBasePath();

  let data;
  try {
    const resp = await fetch(manifestUrl, { cache: 'no-store' });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    data = await resp.json();
  } catch (e) {
    console.error('Konnte images.json nicht laden:', e);
    alert('images.json konnte nicht geladen werden. Stelle sicher, dass die Datei im selben Ordner liegt.');
    return;
  }

  const basePath = projectBase + (data.basePath || '');
  const rows = (Array.isArray(data.files) ? data.files : []).map((relPath) => {
    const url = basePath + relPath;
    const name = relPath.split('/').pop();
    return { name, url, relPath };
  });

  const tbody = document.querySelector('#tbl tbody');
  const count = document.getElementById('count');
  const search = document.getElementById('search');

  function render(filter = '') {
    const q = filter.trim().toLowerCase();
    const filtered = q ? rows.filter(r => r.relPath.toLowerCase().includes(q)) : rows;

    tbody.innerHTML = '';
    for (const r of filtered) {
      const tr = document.createElement('tr');

      // Name
      const tdName = document.createElement('td');
      tdName.textContent = r.name;
      tr.appendChild(tdName);

      // Link
      const tdLink = document.createElement('td');
      const a = document.createElement('a');
      a.href = r.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = r.url;
      tdLink.appendChild(a);
      tr.appendChild(tdLink);

      // Preview
      const tdPreview = document.createElement('td');
      const img = document.createElement('img');
      img.src = r.url;
      img.alt = r.name;
      img.loading = 'lazy';
      tdPreview.appendChild(img);
      tr.appendChild(tdPreview);

      tbody.appendChild(tr);
    }

    count.textContent = `${filtered.length} / ${rows.length} Einträge`;
  }

  render();

  search.addEventListener('input', (e) => render(e.target.value));
})();