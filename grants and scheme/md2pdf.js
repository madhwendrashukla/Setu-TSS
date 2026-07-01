const fs = require('fs');
const { marked } = require('marked');
const puppeteer = require('puppeteer');

const mdPath = process.argv[2] || '/root/.openclaw-autoclaw/workspace/startup_india_schemes_full.md';
const outPath = process.argv[3] || '/root/.openclaw-autoclaw/workspace/startup_india_schemes_full.pdf';

const md = fs.readFileSync(mdPath, 'utf8');
const html = marked.parse(md);

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Startup India Government Schemes</title>
  <style>
    @page { margin: 20mm 18mm; size: A4; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 11px;
      line-height: 1.5;
      color: #1a1a1a;
    }
    h1 { font-size: 20px; color: #c75b27; border-bottom: 3px solid #c75b27; padding-bottom: 8px; margin-top: 0; }
    h2 { font-size: 15px; color: #2a6496; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 24px; }
    h3 { font-size: 13px; color: #333; margin-top: 18px; margin-bottom: 6px; }
    h4 { font-size: 11px; color: #555; margin-top: 8px; margin-bottom: 2px; }
    table { border-collapse: collapse; width: 100%; margin: 10px 0; font-size: 10px; }
    th { background: #2a6496; color: white; padding: 6px 8px; text-align: left; }
    td { padding: 5px 8px; border: 1px solid #ddd; }
    tr:nth-child(even) { background: #f9f9f9; }
    ul { margin: 2px 0; padding-left: 20px; }
    li { margin: 1px 0; }
    hr { border: none; border-top: 1px solid #eee; margin: 14px 0; }
    strong { color: #2a6496; }
    a { color: #c75b27; }
    .page-break { page-break-before: always; }
  </style>
</head>
<body>${html}</body>
</html>`;

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.pdf({
    path: outPath,
    format: 'A4',
    margin: { top: '20mm', bottom: '20mm', left: '18mm', right: '18mm' },
    printBackground: true,
    displayHeaderFooter: false
  });
  await browser.close();
  const size = fs.statSync(outPath).size;
  console.log(`PDF created: ${outPath} (${(size/1024).toFixed(1)} KB, ${size.toLocaleString()} bytes)`);
})();
