// ===== LANGUAGE SYSTEM =====
let currentLang = 'ru';

function setLang(lang) {
  currentLang = lang;

  document.querySelectorAll('[data-ru], [data-uz]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (!val) return;

    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = el.getAttribute('data-ph-' + lang) || val;
    } else {
      el.innerHTML = val;
    }
  });

  document.querySelectorAll('[data-ph-' + lang + ']').forEach(el => {
    el.placeholder = el.getAttribute('data-ph-' + lang);
  });

  const btnRu = document.getElementById('btn-ru');
  const btnUz = document.getElementById('btn-uz');
  if (btnRu) btnRu.classList.toggle('active', lang === 'ru');
  if (btnUz) btnUz.classList.toggle('active', lang === 'uz');

  document.documentElement.lang = lang;
  localStorage.setItem('site-lang', lang);
}

// ===== PHONE INPUT =====
// Always starts with +998, max 9 digits after prefix (12 chars total)
function initPhoneInput() {
  const PREFIX = '+998';

  const phoneInputs = document.querySelectorAll(
    'input[type="tel"], input[id*="phone"], input[id*="Phone"], #field-phone, #f-phone'
  );

  phoneInputs.forEach(input => {
    if (!input.value.startsWith(PREFIX)) {
      input.value = PREFIX;
    }

    input.addEventListener('input', function () {
      let digits = this.value.replace(/\D/g, '');

      // Strip 998 prefix if present to avoid doubling
      if (digits.startsWith('998')) {
        digits = digits.slice(3);
      }

      // Limit to 9 digits after +998
      digits = digits.substring(0, 9);

      this.value = PREFIX + digits;
    });

    input.addEventListener('keydown', function (e) {
      // Block deleting into the prefix
      if (
        (e.key === 'Backspace' || e.key === 'Delete') &&
        this.selectionStart <= PREFIX.length &&
        this.selectionEnd <= PREFIX.length
      ) {
        e.preventDefault();
      }
    });

    input.addEventListener('click', function () {
      if (this.selectionStart < PREFIX.length) {
        this.setSelectionRange(this.value.length, this.value.length);
      }
    });

    input.addEventListener('focus', function () {
      if (!this.value.startsWith(PREFIX)) {
        this.value = PREFIX;
      }
      setTimeout(() => {
        this.setSelectionRange(this.value.length, this.value.length);
      }, 0);
    });
  });
}

// ===== FAQ TOGGLE =====
function toggleFaq(element) {
  const item = element.closest
    ? element.closest('.faq-item')
    : element.parentElement;

  if (!item) return;

  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ===== FORM SUBMISSION via Telegram Bot =====
async function submitForm() {
  const nameInput  = document.getElementById('field-name')    || document.getElementById('f-name');
  const phoneInput = document.getElementById('field-phone')   || document.getElementById('f-phone');
  const msgInput   = document.getElementById('field-message') || document.getElementById('f-message');

  if (!nameInput || !phoneInput) return;

  const name  = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const msg   = msgInput ? msgInput.value.trim() : '';

  const PREFIX = '+998';

  if (!name) {
    alert(currentLang === 'uz' ? 'Ismingizni kiriting' : 'Введите ваше имя');
    return;
  }

  if (!phone || phone === PREFIX || phone.length < PREFIX.length + 9) {
    alert(currentLang === 'uz' ? "Telefon raqamini to'liq kiriting" : 'Введите полный номер телефона');
    return;
  }

  const text = `🔔 Новая заявка с сайта Business Law Consulting\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n💬 Сообщение: ${msg || '—'}`;

  const TOKEN   = '8830532011:AAGJ6A7LZmmWT1c2Qi2YxZRJHpOd62FNN1w';
  const CHAT_ID = '-5102240344';

  try {
    const res  = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' })
    });
    const data = await res.json();

    if (data.ok) {
      nameInput.value  = '';
      phoneInput.value = PREFIX;
      if (msgInput) msgInput.value = '';

      // Show success — try modal, then inline block, then toast
      const modal   = document.getElementById('modal');
      const success = document.getElementById('form-success');
      const fields  = document.getElementById('form-fields');

      if (modal) {
        modal.classList.add('open');
      } else if (success && fields) {
        fields.style.display  = 'none';
        success.style.display = 'block';
        setTimeout(() => {
          success.style.display = 'none';
          fields.style.display  = 'block';
        }, 4000);
      } else {
        showToast(currentLang === 'uz'
          ? '✓ Ariza yuborildi! Siz bilan boglanamiz.'
          : '✓ Заявка отправлена! Мы свяжемся с вами.');
      }
    } else {
      alert('Ошибка отправки. Позвоните нам: +998 90 888-44-66');
    }
  } catch (e) {
    alert('Ошибка соединения. Позвоните нам: +998 90 888-44-66');
  }
}

// ===== TOAST NOTIFICATION =====
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = [
      'position:fixed', 'bottom:24px', 'left:50%', 'transform:translateX(-50%)',
      'background:#1a2b47', 'color:#fff', 'padding:14px 28px', 'border-radius:10px',
      "font-size:15px", "font-family:'Open Sans',sans-serif", 'z-index:9999',
      'box-shadow:0 4px 20px rgba(0,0,0,0.25)', 'transition:opacity 0.4s'
    ].join(';');
    document.body.appendChild(toast);
  }
  toast.textContent  = message;
  toast.style.opacity = '1';
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => { toast.style.display = 'none'; }, 400);
  }, 3500);
}

// ===== MODAL =====
function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.classList.remove('open');
}

// ===== SMOOTH SCROLLING =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ===== GOOGLE TRANSLATE INIT =====
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage:      'ru',
    includedLanguages: 'ru,uz,en',
    layout:            google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay:       false
  }, 'google_translate_element');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function () {
  // Restore saved language
  const savedLang = localStorage.getItem('site-lang') || 'ru';
  setLang(savedLang);

  // Phone inputs
  initPhoneInput();

  // Smooth scroll
  initSmoothScroll();

  // Modal click-outside to close
  const modal = document.getElementById('modal');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });
  }

  // FAQ: project 2 uses button.faq-question (no onclick attr)
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function () {
      toggleFaq(this);
    });
  });
});
