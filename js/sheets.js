// ===== Google Sheets коннектор =====
// Документация: https://developers.google.com/sheets/api/reference/rest

const SHEETS_CONFIG = {
  // TODO: вставь ID своей Google Таблицы
  spreadsheetId: 'YOUR_SPREADSHEET_ID',
  // TODO: вставь свой API ключ (Google Cloud Console → Credentials)
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://sheets.googleapis.com/v4/spreadsheets'
};

/**
 * Читает диапазон из Google Sheets
 * @param {string} range  — например 'Заготовки!A1:F100'
 * @returns {Promise<Array[]>} — массив строк
 */
async function sheetsRead(range) {
  const { spreadsheetId, apiKey, baseUrl } = SHEETS_CONFIG;
  if (spreadsheetId === 'YOUR_SPREADSHEET_ID') {
    // Возвращаем демо-данные пока не настроен реальный ключ
    return getDemoData(range);
  }

  const url = `${baseUrl}/${spreadsheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheets API error: ${res.status}`);
  const json = await res.json();
  return json.values || [];
}

// ===== ДЕМО-ДАННЫЕ (работает без API ключа) =====
function getDemoData(range) {
  const demos = {
    'Заготовки': [
      ['Название', 'Норма (г)', 'Текущий остаток', 'Нужно сделать', 'Единица', 'Примечание'],
      ['Соус Бешамель', '500', '200', '300', 'г', 'Для пасты'],
      ['Куриный бульон', '2000', '500', '1500', 'мл', 'Основа для супов'],
      ['Маринад для курицы', '800', '0', '800', 'г', 'Новый рецепт'],
      ['Карамелизованный лук', '300', '150', '150', 'г', ''],
      ['Тесто пицца', '1200', '400', '800', 'г', 'Дрожжевое'],
    ],
    'ТТК': [
      ['Блюдо', 'Себестоимость', 'Цена продажи', 'Наценка %', 'Выход (г)'],
      ['Паста Карбонара', '145', '450', '210%', '280'],
      ['Борщ', '65', '220', '238%', '350'],
      ['Пицца Маргарита', '120', '380', '217%', '400'],
    ]
  };

  for (const key in demos) {
    if (range.startsWith(key)) return demos[key];
  }
  return [];
}

// ===== ПРОВЕРКА АВТОРИЗАЦИИ =====
function requireAuth(expectedRole) {
  const role = sessionStorage.getItem('role');
  const authTime = sessionStorage.getItem('authTime');
  // Сессия действует 8 часов
  if (!role || role !== expectedRole || Date.now() - authTime > 8 * 60 * 60 * 1000) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function logout() {
  sessionStorage.clear();
  window.location.href = 'index.html';
}
