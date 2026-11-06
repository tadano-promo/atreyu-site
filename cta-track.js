/* 問い合わせにつながるボタン・リンクが押された回数を GA4 に送る（cta_click） */
(function () {
  function area(el) {
    var s = el.closest('[id]');
    var sec = el.closest('section, header, footer, nav, .sticky, .mid');
    var cls = sec ? (sec.id || sec.className || sec.tagName).toString().split(' ')[0] : '';
    return (s && s.id) ? s.id : (cls || 'page');
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || typeof window.gtag !== 'function') return;
    var href = a.getAttribute('href') || '';
    var type = '';
    if (/contact\.html/.test(href)) type = 'contact';
    else if (/^mailto:/.test(href)) type = 'mail';
    else if (/^tel:/.test(href)) type = 'tel';
    else if (/line\.me|lin\.ee/.test(href)) type = 'line';
    else if (/lp-[a-z-]+\.html/.test(href)) type = 'lp';
    if (!type) return;
    window.gtag('event', 'cta_click', {
      cta_type: type,
      cta_text: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60),
      cta_area: area(a),
      link_url: href,
      transport_type: 'beacon'
    });
  }, true);
})();
