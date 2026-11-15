// NEWS の記事を1件ずつ、ふつうの HTML ページ（/news/<id>.html）に書き出す。
// 2026-11-15 Webページ部：news-detail.html?id=… は中身を JavaScript で出すため、
// Google に「中身のないページ（ソフト404）」と見なされていた。記事ごとのページにして、中身を最初から入れておく。
// 使い方：NEWS を news-data.js に足したら `node tools/build-news.js` を実行して、できたファイルも一緒に公開する。
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const vm = require('vm');
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'news-data.js'), 'utf8'), ctx);
const news = ctx.window.ATREYU_NEWS || [];
const tpl = fs.readFileSync(path.join(root, 'news-detail.html'), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const desc = (s) => esc(String(s).replace(/\s+/g, ' ').slice(0, 110));

let n = 0;
for (const item of news) {
  const url = 'https://atreyu.jp/news/' + item.id + '.html';
  let h = tpl;
  // 置き場所が /news/ になるので、相対リンクがずれないようにする
  h = h.replace('<head>', '<head>\n<base href="/">');
  h = h.replace(/<title>[^<]*<\/title>/, '<title>' + esc(item.title) + '｜Atreyu（アトレイユ）</title>');
  h = h.replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + desc(item.body) + '">');
  h = h.replace(/<meta name="robots" content="[^"]*">\n?/, '');
  h = h.replace(/<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + url + '">');
  if (!/rel="canonical"/.test(h)) h = h.replace('</title>', '</title>\n<link rel="canonical" href="' + url + '">');
  h = h.replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + esc(item.title) + '｜Atreyu（アトレイユ）">');
  h = h.replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + desc(item.body) + '">');
  h = h.replace(/<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="' + url + '">');
  h = h.replace('<h1 class="page-hero__title" id="nd-title">NEWS詳細</h1>', '<h1 class="page-hero__title" id="nd-title">' + esc(item.title) + '</h1>');
  h = h.replace('<p class="page-hero__sub" id="nd-date"></p>', '<p class="page-hero__sub" id="nd-date">' + esc(item.date) + '</p>');
  let body = '<p>' + esc(item.body).replace(/\n/g, '<br>') + '</p>';
  if (item.externalUrl) body += '\n      <p style="margin-top:32px"><a href="' + esc(item.externalUrl) + '" class="btn btn--ghost">' + esc(item.externalLabel || '詳細を見る') + ' ↗</a></p>';
  h = h.replace('<p>記事を読み込んでいます…</p>', body);
  // 中身はもう入っているので、読み込みの JavaScript（と news-data.js）は外す
  h = h.replace(/<script src="news-data.js"><\/script>\n<script>[\s\S]*?<\/script>\n/, '');
  // JSON-LD の記事情報（あれば）を、この記事のものに
  h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '<script type="application/ld+json">' + JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    datePublished: String(item.date).replace(/\./g, '-'),
    url,
    publisher: { '@type': 'Organization', name: 'Atreyu（アトレイユ）', url: 'https://atreyu.jp/' },
  }) + '</script>');
  fs.writeFileSync(path.join(root, 'news', item.id + '.html'), h);
  n++;
}
console.log('書き出した記事:', n);
