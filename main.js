// ===== NAV TOGGLE =====
const toggle = document.getElementById('nav-toggle');
const menu   = document.getElementById('nav-menu');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('open');
  });
}

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = (i % 4) * 0.08 + 's';
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// ===== HEADER SCROLL STYLE =====
const header = document.getElementById('site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 2px 20px rgba(45,26,8,0.08)'
      : 'none';
  });
}

// シェアボタン：今見ているページのURLと題名を入れた投稿画面を開く
document.querySelectorAll('[data-share]').forEach(function (a) {
  var url = encodeURIComponent(location.href.split('#')[0].split('?')[0]);
  var title = encodeURIComponent(document.title);
  var map = {
    x: 'https://x.com/intent/post?text=' + title + '&url=' + url,
    threads: 'https://www.threads.net/intent/post?text=' + title + '%20' + url,
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
    line: 'https://social-plugins.line.me/lineit/share?url=' + url
  };
  if (map[a.dataset.share]) a.href = map[a.dataset.share];
});
