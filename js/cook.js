// ===== ЭКРАН ПОВАРА =====

(async function init() {
  if (!requireAuth('cook')) return;

  const container = document.getElementById('content');

  try {
    const rows = await sheetsRead('Заготовки!A1:F100');
    if (!rows || rows.length < 2) {
      container.innerHTML = '<p style="color:#888">📋 Нет данных в листе «Заготовки»</p>';
      return;
    }

    const headers = rows[0];
    const data    = rows.slice(1);
    const today   = new Date().toLocaleDateString('ru-RU', { day:'numeric', month:'long' });

    let html = `
      <p style="color:#888;font-size:.85rem;margin-bottom:16px;">📅 Смена: ${today}</p>
      <div style="display:grid;gap:12px;">
    `;

    data.forEach(row => {
      const name    = row[0] || '—';
      const norm    = row[1] || '0';
      const current = row[2] || '0';
      const need    = row[3] || '0';
      const unit    = row[4] || 'г';
      const note    = row[5] || '';

      const needNum = parseFloat(need);
      const urgent  = needNum > 0;

      html += `
        <div style="
          background: #1a1a2e;
          border-radius: 12px;
          padding: 16px;
          border-left: 4px solid ${urgent ? '#e94560' : '#2a6e3a'};
        ">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <strong style="font-size:1rem;">${name}</strong>
            <span style="
              font-size:.75rem;
              background:${urgent ? '#e9456033' : '#2a6e3a33'};
              color:${urgent ? '#e94560' : '#4caf50'};
              border-radius:6px;
              padding:3px 8px;
            ">${urgent ? '⚡ Нужно сделать' : '✅ Готово'}</span>
          </div>
          <div style="display:flex;gap:20px;margin-top:8px;color:#888;font-size:.85rem;">
            <span>📦 Норма: <b style="color:#f0f0f0">${norm} ${unit}</b></span>
            <span>🗄️ Остаток: <b style="color:#f0f0f0">${current} ${unit}</b></span>
            <span>🔥 Сделать: <b style="color:${urgent?'#f5a623':'#4caf50'}">${need} ${unit}</b></span>
          </div>
          ${note ? `<p style="margin-top:6px;font-size:.8rem;color:#666;">💬 ${note}</p>` : ''}
        </div>
      `;
    });

    html += '</div>';
    container.innerHTML = html;

  } catch (err) {
    container.innerHTML = `<p style="color:#e94560;">❌ Ошибка загрузки: ${err.message}</p>`;
  }
}());
