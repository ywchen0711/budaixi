// bakes one head for each character: id=base[:mix:w] hair bald
import puppeteer from 'puppeteer-core'; import fs from 'fs';
const CAST = JSON.parse(fs.readFileSync('cast.json', 'utf8')), only = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const p = await b.newPage(); p.on('pageerror', (e) => console.log('ERR', e.message));
fs.mkdirSync('heads', { recursive: true });
for (const [id, c] of Object.entries(CAST)) {
  if (only.length && !only.includes(id)) continue;
  const qs = new URLSearchParams({ n: c.base, flip: 1, mix: c.mix || '', w: c.w ?? 0.5, hair: (c.hair || '#1c1614').slice(1), bald: c.bald ? 1 : '', ts: 1024 });
  await p.goto('http://127.0.0.1:8177/conv/cut.html?' + qs); await p.waitForFunction('window.DONE', { timeout: 300000 });
  const r = await p.evaluate(() => ({ e: window.ERR, s: window.STATS, o: window.OUT }));
  if (r.e) { console.log(id, r.e); continue; }
  fs.writeFileSync(`heads/${id}.glb`, Buffer.from(r.o, 'base64')); console.log(id, c.base, c.mix || '', (fs.statSync(`heads/${id}.glb`).size / 1e6).toFixed(2) + 'MB');
}
await b.close();
