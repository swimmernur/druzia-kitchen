// ===== ЭКРАН ШЕФА =====

let currentTab = 'ttk';

(async function init() {
  if (!requireAuth('chef')) return;

  // Стили для вкладок
  const s = document.createElement('style');
  s.textContent = `
    .tab-btn {
      background: #1a1a2e; border: 1px solid #333;
      color: #888; border-radius: 8px; padding: 8px 18px;
      cursor: pointer; font-size: .9rem; transition: all .15s;
    }
    .tab-btn.active, .tab-btn:hover {
      background: #e94560; color: #fff; border-color: #e94560;
    }
    table { width:100%; border-collapse:collapse; }
    th,td { padding:10px 12px; text-align:left; border-bottom:1px solid #252540; font-size:.9rem; }
    th    { color:#888; font-weight:600; font-size:.8rem; text-transform:uppercase; }
    tr:hover td { background:#1a1a2e; }
  `;
  document.head.appendChild(s);

  showTab('ttk');
}());

async function showTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.tab-btn[onclick="showTab('${tab}')"]`);
  if (btn) btn.classList.add('active');

  const container = document.getElementById('content');
  container.innerHTML = '<p style="color:#888">⏳ Загрузка...</p>';

  try {
    switch (tab) {
      case 'ttk':      await renderTTK(container);      break;
      case 'sales':    await renderSales(container);    break;
      case 'stock':    await renderStock(container);    break;
      case 'settings': renderSettings(container);       break;
    }
  } catch (err) {
    container.innerHTML = `<p style="color:#e94560;">❌ ${err.message}</p>`;
  }
}

async function renderTTK(c) {
  const rows = await sheetsRead('ТТК!A1:E100');
  if (!rows || rows.length < 2) { c.innerHTML = '<p style="color:#888">Нет данных в листе «ТТК»</p>'; return; }
  c.innerHTML = buildTable(rows);
}

async function renderSales(c) {
  c.innerHTML = `
    <div style="padding:32px;text-align:center;color:#888;">
      <div style="font-size:48px;margin-bottom:12px;">📊</div>
      <p>Следующий шаг: подключить лист «Продажи» в Google Sheets</p>
    </div>`;
}

async function renderStock(c) {
  c.innerHTML = `
    <div style="padding:32px;text-align:center;color:#888;">
      <div style="font-size:48px;margin-bottom:12px;">🗄️</div>
      <p>Следующий шаг: подключить лист «Склад» в Google Sheets</p>
    </div>`;
}

function renderSettings(c) {
  c.innerHTML = `
    <div style="background:#1a1a2e;border-radius:12px;padding:24px;max-width:400px;">
      <h3 style="margin-bottom:20px;">⚙️ Настройки подключения</h3>
      <label style="display:block;color:#888;font-size:.85rem;margin-bottom:4px;">ID Google Таблицы</label>
      <input id="inp-sheet" type="text" placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
        style="width:100%;background:#0f0f1a;border:1px solid #333;color:#f0f0f0;
               border-radius:8px;padding:10px;font-size:.9rem;margin-bottom:16px;"
        value="${SHEETS_CONFIG.spreadsheetId !== 'YOUR_SPREADSHEET_ID' ? SHEETS_CONFIG.spreadsheetId : ''}" />

      <label style="display:block;color:#888;font-size:.85rem;margin-bottom:4px;">Google API Key</label>
      <input id="inp-key" type="password" placeholder="AIza..."
        style="width:100%;background:#0f0f1a;border:1px solid #333;color:#f0f0f0;
               border-radius:8px;padding:10px;font-size:.9rem;margin-bottom:20px;"
        value="${SHEETS_CONFIG.apiKey !== 'YOUR_API_KEY' ? SHEETS_CONFIG.apiKey : ''}" />

      <button onclick="saveSettings()" style="background:#e94560;border:none;color:#fff;
              border-radius:8px;padding:10px 24px;cursor:pointer;font-size:.95rem;width:100%;">
        💾 Сохранить
      </button>
      <p id="save-msg" style="margin-top:10px;color:#4caf50;font-size:.85rem;min-height:20px;"></p>
    </div>`;
}

function saveSettings() {
  const id  = document.getElementById('inp-sheet').value.trim();
  const key = document.getElementById('inp-key').value.trim();
  if (id)  { SHEETS_CONFIG.spreadsheetId = id;  localStorage.setItem('sheetId', id); }
  if (key) { SHEETS_CONFIG.apiKey = key;         localStorage.setItem('sheetKey', key); }
  document.getElementById('save-msg').textContent = '✅ Сохранено! Перезагрузи страницу для применения.';
}

// Применяем сохранённые настройки при загрузке
(function loadSavedSettings() {
  const id  = localStorage.getItem('sheetId');
  const key = localStorage.getItem('sheetKey');
  if (id)  SHEETS_CONFIG.spreadsheetId = id;
  if (key) SHEETS_CONFIG.apiKey = key;
}());

// ===== УТИЛИТЫ =====
function buildTable(rows) {
  const headers = rows[0];
  const data    = rows.slice(1);
  let html = '<div style="overflow-x:auto;"><table><thead><tr>';
  headers.forEach(h => html += `<th>${h}</th>`);
  html += '</tr></thead><tbody>';
  data.forEach(row => {
    html += '<tr>';
    headers.forEach((_, i) => html += `<td>${row[i] || '—'}</td>`);
    html += '</tr>';
  });
  return html + '</tbody></table></div>';
}
