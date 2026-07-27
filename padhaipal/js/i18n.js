// Simple bilingual toggle: English (default) <-> Roman Urdu
// Any element with a data-ur="..." attribute is translatable.
// data-en is captured automatically from the element's initial (English) text.
(function () {
  const KEY = 'padhaipal_lang';

  function apply(lang) {
    document.querySelectorAll('[data-ur]').forEach(el => {
      if (!el.dataset.en) el.dataset.en = el.innerHTML;
      el.innerHTML = lang === 'ur' ? el.dataset.ur : el.dataset.en;
    });
    document.querySelectorAll('[data-ur-placeholder]').forEach(el => {
      if (!el.dataset.enPlaceholder) el.dataset.enPlaceholder = el.getAttribute('placeholder') || '';
      el.setAttribute('placeholder', lang === 'ur' ? el.dataset.urPlaceholder : el.dataset.enPlaceholder);
    });
    document.querySelectorAll('[data-q-ur]').forEach(el => {
      el.dataset.q = lang === 'ur' ? el.dataset.qUr : el.dataset.qEn;
    });
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem(KEY, lang);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem(KEY) || 'en';
    apply(saved);
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.addEventListener('click', () => apply(b.dataset.lang));
    });
  });
})();
