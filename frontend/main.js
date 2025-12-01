// main.js (homepage & shared utilities)
// Uses api.js for data fetching

/* ------------------------- Utilities ------------------------- */
function safeParseDate(input) {
  if (!input) return null;
  if (input instanceof Date && !isNaN(input)) return input;

  let d = new Date(input);
  if (!isNaN(d)) return d;

  d = new Date(String(input).replace(/-/g, '/'));
  if (!isNaN(d)) return d;

  const m = String(input).match(/(\d{4})[^\d]?(\d{1,2})[^\d]?(\d{1,2})/);
  if (m) {
    const y = parseInt(m[1], 10);
    const mo = parseInt(m[2], 10) - 1;
    const da = parseInt(m[3], 10);
    const dd = new Date(y, mo, da);
    if (!isNaN(dd)) return dd;
  }
  return null;
}

function showSnackbar(message, buttons = []) {
  let el = document.getElementById('snackbar');
  if (!el) {
      // Create snackbar if missing
      el = document.createElement('div');
      el.id = 'snackbar';
      document.body.appendChild(el);
  }
  
  el.innerHTML = `<span style="margin-right:.75rem">${message}</span>` +
    buttons.map((b, i) => `<button data-idx="${i}" class="snack-btn">${b.label}</button>`).join('');
  el.style.display = 'flex';
  requestAnimationFrame(() => el.classList.add('show'));

  el.querySelectorAll('.snack-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = Number(btn.getAttribute('data-idx'));
      if (buttons[idx] && typeof buttons[idx].onClick === 'function')
        buttons[idx].onClick();
      hideSnackbar();
    };
  });

  if (buttons.length === 0) setTimeout(hideSnackbar, 4200);
}

function hideSnackbar() {
  const el = document.getElementById('snackbar');
  if (!el) return;
  el.classList.remove('show');
  setTimeout(() => { el.style.display = 'none'; }, 240);
}

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('user') || 'null'); }
  catch { return null; }
}

function isLoggedIn() {
    return !!localStorage.getItem('token');
}

/* ------------------------- Auth / Navbar ------------------------- */
function renderAuthArea() {
  const authArea = document.getElementById('authArea');
  if (!authArea) return;
  const user = getCurrentUser();

  if (isLoggedIn() && user) {
    authArea.innerHTML = `
      <a href="profile.html" class="btn btn-primary">Hi, ${user.name || 'User'}</a>
      <button id="logoutBtn" class="btn btn-outline">Logout</button>
    `;
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.onclick = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      renderAuthArea();
      showSnackbar('Logged out');
      setTimeout(() => window.location.reload(), 500);
    };
  } else {
    authArea.innerHTML = `
      <a href="login.html" id="loginBtn" class="btn btn-primary">👤 Login</a>
      <a href="signup.html" id="signupBtn" class="btn btn-primary">Sign Up</a>
    `;
  }
}

/* ------------------------- Create/Start wiring ------------------------- */
function wireCreateButtons() {
  const createBtn = document.getElementById('createEventBtn');
  const startBtn = document.getElementById('startEventBtn');

  function requireLoginThenCreate() {
    if (!isLoggedIn()) {
      showSnackbar('You must be logged in to create events', [
        { label: 'Login', onClick: () => window.location.href = 'login.html' },
        { label: 'Cancel', onClick: () => {} }
      ]);
      return;
    }
    window.location.href = 'create-event.html';
  }

  if (createBtn) createBtn.onclick = requireLoginThenCreate;
  if (startBtn) startBtn.onclick = requireLoginThenCreate;
}

/* ------------------------- Events loading & rendering ------------------------- */
async function renderFeaturedEvents() {
  const wrap = document.getElementById('featuredEvents');
  if (!wrap) return;

  try {
      const response = await api.events.getAll('?limit=6'); // Fetch 6 events
      const events = response.events || [];

      if (events.length === 0) {
        wrap.innerHTML = `<p class="muted">No upcoming events yet.</p>`;
        return;
      }

      wrap.innerHTML = events.map(ev => {
        const dateObj = safeParseDate(ev.date);
        const dateStr = dateObj ? dateObj.toLocaleDateString() : (ev.date || '');
        const image = ev.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800';
        const price = ev.price > 0 ? `$${ev.price}` : 'Free';
        const onlineBadge = ev.isOnline
          ? `<span class="badge" style="left:.75rem; right:auto; top:.75rem; background:#10b981;color:white">Online</span>`
          : '';

        return `
          <a href="event-detail.html?id=${ev.id}" class="card" style="padding:0; overflow:hidden;">
            <div style="position:relative;">
              <img src="${image}" class="card-image" style="height:160px;">
              <span class="badge">${price}</span>
              ${onlineBadge}
            </div>
            <div class="card-content">
              <div class="card-category">${ev.category || ''}</div>
              <h3 class="card-title">${ev.title}</h3>
              <div class="card-info">
                <div class="info-item">📅 ${dateStr}</div>
                <div class="info-item">⏰ ${ev.time || '—'}</div>
                <div class="info-item">📍 ${ev.isOnline ? 'Online' : (ev.location || '—')}</div>
              </div>
            </div>
          </a>
        `;
      }).join('');
  } catch (error) {
      console.error('Failed to fetch events:', error);
      wrap.innerHTML = `<p class="muted">Failed to load events.</p>`;
  }
}

/* ------------------------- Categories ------------------------- */
function renderCategories() {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;

  // Hardcoded categories for now, or could fetch if API existed
  const categories = [
    { name: 'Technology', icon: '💻', color: '#3b82f6' },
    { name: 'Health', icon: '❤️', color: '#ef4444' },
    { name: 'Music', icon: '🎵', color: '#8b5cf6' },
    { name: 'Business', icon: '💼', color: '#10b981' },
    { name: 'Art', icon: '🎨', color: '#f59e0b' },
    { name: 'Sports', icon: '⚽', color: '#ec4899' },
    { name: 'Food', icon: '🍔', color: '#f97316' },
    { name: 'Travel', icon: '✈️', color: '#06b6d4' }
  ];

  grid.innerHTML = categories.map(cat => `
    <a href="events.html?category=${encodeURIComponent(cat.name)}" class="category-card">
      <div class="category-icon" style="background:${cat.color}20; color:${cat.color}">
        <span style="font-size:2rem;">${cat.icon}</span>
      </div>
      <h3>${cat.name}</h3>
    </a>
  `).join('');
}

/* ------------------------- Popular Groups ------------------------- */
async function renderPopularGroups() {
  const wrap = document.getElementById("popularGroups");
  if (!wrap) return;

  try {
      const response = await api.groups.getAll('?limit=6'); // Fetch 6 groups
      const groups = response.groups || [];

      if (groups.length === 0) {
        wrap.innerHTML = `
          <div class="card p-4">
            <p style="color:#6b7280;">No popular groups yet. Join groups to make them popular!</p>
          </div>
        `;
        return;
      }

      wrap.innerHTML = groups.map(g => {
        return `
          <a href="group-detail.html?id=${g.id}" class="card" style="display:block;">
            <img src="${g.image || 'https://via.placeholder.com/400x250'}" class="card-image">
            <div class="card-content">
              <div class="card-category">${g.category}</div>
              <h3 class="card-title">${g.name}</h3>
              <div class="card-info">
                <div class="info-item">📍 ${g.location || ""}</div>
                <div class="info-item">👥 ${(g.members || []).length} members</div>
              </div>
            </div>
          </a>
        `;
      }).join('');
  } catch (error) {
      console.error('Failed to fetch groups:', error);
      wrap.innerHTML = `<p class="muted">Failed to load groups.</p>`;
  }
}

/* ------------------------- Search wiring ------------------------- */
function wireSearch() {
  const input = document.getElementById('searchInput');
  const locInput = document.getElementById('locationInput');
  const btn = document.getElementById('searchBtn');
  if (!btn) return;

  btn.onclick = () => {
    const q = input ? input.value.trim() : '';
    const loc = locInput ? locInput.value.trim() : '';
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (loc) params.set('loc', loc);
    window.location.href = `events.html?${params.toString()}`;
  };
}

/* ------------------------- Main render ------------------------- */
function renderHome() {
  renderAuthArea();
  wireCreateButtons();
  wireSearch();
  renderCategories();
  renderFeaturedEvents();
  renderPopularGroups();
}

/* ------------------------- Init ------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  renderHome();
});
