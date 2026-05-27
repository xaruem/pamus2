// ===== PHONE INPUT LIMIT (max 12 digits) =====
function limitPhoneInput(input) {
  // Remove non-digit characters except +
  let value = input.value.replace(/[^\d+]/g, '');
  
  // Limit to 12 digits after +998
  if (value.startsWith('+998')) {
    value = '+998' + value.slice(4).substring(0, 9);
  } else if (value.startsWith('+')) {
    value = '+' + value.slice(1).substring(0, 11);
  } else {
    value = value.substring(0, 12);
  }
  
  input.value = value;
}

// Apply listener to all phone inputs
document.addEventListener('DOMContentLoaded', function() {
  const phoneInputs = document.querySelectorAll('input[type="tel"], input[id*="phone"], input[id*="f-phone"], input[id*="fphone"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', function() {
      limitPhoneInput(this);
    });
  });
});

// ===== LANGUAGE SWITCHER =====
function setLang(lang) {
  document.querySelectorAll('[data-ru], [data-uz], [data-i18n]').forEach(el => {
    if (el.hasAttribute('data-ru') && el.hasAttribute('data-uz')) {
      el.textContent = lang === 'ru' ? el.getAttribute('data-ru') : el.getAttribute('data-uz');
    } else if (el.hasAttribute('data-i18n')) {
      const key = el.getAttribute('data-i18n');
      if (window.translations && window.translations[lang] && window.translations[lang][key]) {
        el.textContent = window.translations[lang][key];
      }
    }
  });
  
  // Update button states
  document.querySelectorAll('.lang-btn, [data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === (lang === 'ru' ? 'RU' : 'UZ') || btn.getAttribute('data-lang') === lang);
  });
  
  document.documentElement.lang = lang;
  localStorage.setItem('site-lang', lang);
}

// ===== FAQ TOGGLE =====
function toggleFaq(element) {
  const item = element.closest('.faq-item');
  if (item) {
    item.classList.toggle('open');
  }
}

// ===== FORM SUBMISSION =====
async function sendToTelegram() {
  const nameInput = document.getElementById('f-name') || document.getElementById('fname');
  const phoneInput = document.getElementById('f-phone') || document.getElementById('fphone') || document.getElementById('formPhone');
  const messageInput = document.getElementById('f-message') || document.getElementById('fmsg') || document.getElementById('formMsg');
  
  if (!nameInput || !phoneInput) return;
  
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const message = messageInput ? messageInput.value.trim() : '';
  
  if (!name || !phone || phone === '+998') {
    alert('Пожалуйста, заполните имя и номер телефона');
    return;
  }
  
  const text = `📩 Новая заявка с сайта!\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}${message ? '\n💬 Сообщение: ' + message : ''}`;
  
  try {
    const response = await fetch('https://api.telegram.org/bot8830532011:AAGJ6A7LZmmWT1c2Qi2YxZRJHpOd62FNN1w/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: '-5102240344',
        text: text
      })
    });
    
    const data = await response.json();
    if (data.ok) {
      alert('✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
      if (nameInput) nameInput.value = '';
      if (phoneInput) phoneInput.value = '+998';
      if (messageInput) messageInput.value = '';
    } else {
      alert('Ошибка отправки. Позвоните нам: +998 90 888-44-66');
    }
  } catch (error) {
    alert('Ошибка отправки. Позвоните нам: +998 90 888-44-66');
  }
}

// ===== FORM SUBMIT for pamus4 =====
function submitForm() {
  const nameInput = document.getElementById('formName');
  const phoneInput = document.getElementById('formPhone');
  const msgInput = document.getElementById('formMsg');
  
  if (!nameInput || !phoneInput) {
    sendToTelegram();
    return;
  }
  
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const msg = msgInput ? msgInput.value.trim() : '';
  
  if (!name || !phone || phone === '+998') {
    alert('Пожалуйста, заполните имя и номер телефона');
    return;
  }
  
  const text = `📩 Новая заявка с сайта!\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}${msg ? '\n💬 Сообщение: ' + msg : ''}`;
  
  fetch('https://api.telegram.org/bot8830532011:AAGJ6A7LZmmWT1c2Qi2YxZRJHpOd62FNN1w/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: '-5102240344',
      text: text
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      document.getElementById('formSuccess').style.display = 'block';
      document.getElementById('contactForm').style.display = 'none';
      setTimeout(() => {
        document.getElementById('formSuccess').style.display = 'none';
        document.getElementById('contactForm').style.display = 'block';
        nameInput.value = '';
        phoneInput.value = '+998';
        if (msgInput) msgInput.value = '';
      }, 3000);
    }
  })
  .catch(() => alert('Ошибка отправки. Позвоните нам: +998 90 888-44-66'));
}

// ===== SCROLL TO FORM =====
function scrollToForm() {
  const formSection = document.getElementById('contact') || document.getElementById('cta');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// ===== MOBILE MENU TOGGLE =====
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) {
    menu.classList.toggle('active');
  }
  const burger = document.getElementById('burger');
  if (burger) {
    burger.classList.toggle('active');
  }
}

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
  // Set default language
  const savedLang = localStorage.getItem('site-lang') || 'ru';
  setLang(savedLang);
  
  // Add listeners to all phone inputs
  const phoneInputs = document.querySelectorAll('input[type="tel"], input[id*="phone"], input[id*="f-phone"], input[id*="fphone"], input[placeholder*="998"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', function() {
      limitPhoneInput(this);
    });
  });
  
  // Add FAQ toggle listeners
  document.querySelectorAll('.faq-question, .faq-q, [onclick*="toggleFaq"]').forEach(btn => {
    if (!btn.hasAttribute('onclick')) {
      btn.addEventListener('click', function() {
        toggleFaq(this);
      });
    }
  });
});
