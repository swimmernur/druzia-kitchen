// ===== КОНФИГУРАЦИЯ =====
// TODO: поменяй PIN и пароль перед деплоем!
const AUTH = {
  cook: { type: 'pin',      secret: '1234', redirect: 'cook.html' },
  chef: { type: 'password', secret: 'chef2024', redirect: 'chef.html' }
};

// ===== СОСТОЯНИЕ =====
let currentRole = null;
let inputValue  = '';

// ===== ВЫБОР РОЛИ =====
function selectRole(role) {
  currentRole = role;
  inputValue  = '';
  document.getElementById('modal-title').textContent =
    role === 'cook' ? '👨‍🍳 PIN-код повара' : '👨‍💼 Пароль шефа';
  updatePinDisplay();
  document.getElementById('error-msg').textContent = '';
  document.getElementById('modal').style.display = 'flex';
}

// ===== ЗАКРЫТЬ МОДАЛКУ =====
function closeModal() {
  document.getElementById('modal').style.display = 'none';
  currentRole = null;
  inputValue  = '';
}

// ===== ОБНОВИТЬ ОТОБРАЖЕНИЕ =====
function updatePinDisplay() {
  const display = document.getElementById('pin-display');
  const cfg = AUTH[currentRole];
  if (!cfg) return;

  if (cfg.type === 'pin') {
    // Показываем точки для введённых цифр, подчёркивания для пустых
    const maxLen = cfg.secret.length;
    let visual = '';
    for (let i = 0; i < maxLen; i++) {
      visual += inputValue[i] ? '●' : '_';
    }
    display.textContent = visual;
  } else {
    // Для пароля — звёздочки
    display.textContent = '●'.repeat(inputValue.length) || '—';
    display.style.letterSpacing = '8px';
    display.style.fontSize = '1.6rem';
  }
}

// ===== НАЖАТИЕ НА НУМПАД =====
function pinPress(val) {
  const cfg = AUTH[currentRole];
  if (!cfg) return;

  if (val === 'del') {
    inputValue = inputValue.slice(0, -1);
    updatePinDisplay();
    return;
  }

  if (val === 'ok') {
    checkAuth();
    return;
  }

  // Ограничение длины для PIN
  if (cfg.type === 'pin' && inputValue.length >= cfg.secret.length) return;

  inputValue += val;
  updatePinDisplay();

  // Авто-проверка PIN когда набрана нужная длина
  if (cfg.type === 'pin' && inputValue.length === cfg.secret.length) {
    setTimeout(checkAuth, 200);
  }
}

// ===== ПРОВЕРКА =====
function checkAuth() {
  const cfg = AUTH[currentRole];
  if (!cfg) return;

  if (inputValue === cfg.secret) {
    // Сохраняем роль в sessionStorage
    sessionStorage.setItem('role', currentRole);
    sessionStorage.setItem('authTime', Date.now());
    // Переходим на нужный экран
    window.location.href = cfg.redirect;
  } else {
    document.getElementById('error-msg').textContent =
      cfg.type === 'pin' ? '❌ Неверный PIN' : '❌ Неверный пароль';
    inputValue = '';
    updatePinDisplay();
    // Тряска карточки
    const modal = document.querySelector('.modal');
    modal.style.animation = 'shake .3s';
    setTimeout(() => modal.style.animation = '', 400);
  }
}

// ===== ЗАКРЫТЬ ПО КЛИКУ НА OVERLAY =====
document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ===== АНИМАЦИЯ ТРЯСКИ =====
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%      { transform: translateX(-8px); }
  40%      { transform: translateX(8px); }
  60%      { transform: translateX(-6px); }
  80%      { transform: translateX(6px); }
}`;
document.head.appendChild(shakeStyle);
