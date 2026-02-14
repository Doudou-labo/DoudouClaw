const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const user = tg?.initDataUnsafe?.user;
const welcome = document.getElementById('welcome');
welcome.textContent = user
  ? `Salut ${user.first_name} 👋 Ton cockpit rapide est prêt.`
  : 'Salut 👋 Ton cockpit rapide est prêt.';

const store = {
  get(key, fallback = '') {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }
};

const checkIds = ['chapter', 'manager', 'finance'];
checkIds.forEach((id) => {
  const el = document.querySelector(`[data-item="${id}"]`);
  el.checked = store.get(`check:${id}`, '0') === '1';
  el.addEventListener('change', () => store.set(`check:${id}`, el.checked ? '1' : '0'));
});

const note = document.getElementById('note');
note.value = store.get('note', '');
note.addEventListener('input', () => store.set('note', note.value));

document.querySelectorAll('button[data-action]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    const payloads = {
      rappel: 'RAPPEL: Pense au point finance de 21:15',
      finance: 'CHECK: finance add + finance recent 5 + finance summary',
      rcs: 'OBJECTIF RCS: quelle action managériale aujourd\'hui ?'
    };

    if (tg) {
      tg.HapticFeedback?.impactOccurred?.('light');
      tg.sendData(payloads[action] || action);
      tg.showAlert('Action envoyée au bot ✅');
    } else {
      alert('Mode hors Telegram: action simulée ✅');
    }
  });
});
