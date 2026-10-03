// Author: Igor Davinci
// Version: 0.4.0
// GitHub profile banner. Reads the owner's repositories (name, language,
// last push: metadata only, never contents) and draws a terminal.
// Usage: GH_TOKEN=... node scripts/make-banner.js banner.svg
const fs = require('fs');

const OWNER = 'IDavinciCode';
const SKIP = new Set([OWNER]); // the profile repo itself
const MAX = 10;
// GitHub picks the language with the most bytes; where that is tooling and
// not the project, the owner's word wins
const LANG = { 'death-arena': 'C++' };

const C = { bg: '#07090a', bar: '#0c1012', line: '#1c2a2e', dim: '#56686d', text: '#d6e2e5', cyan: '#78BECD' };
const MONO = "'IBM Plex Mono', 'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', monospace";
const CW = 9.05;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function repos() {
  const out = [];
  for (let page = 1; ; page++) {
    const r = await fetch(`https://api.github.com/user/repos?affiliation=owner&visibility=all&sort=pushed&per_page=100&page=${page}`, {
      headers: { Authorization: `Bearer ${process.env.GH_TOKEN}`, Accept: 'application/vnd.github+json' },
    });
    if (!r.ok) throw new Error(`GitHub ${r.status}`);
    const batch = await r.json();
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out
    .filter((r) => !SKIP.has(r.name) && !r.fork && !r.archived && r.size > 0)
    .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))
    .map((r) => ({ name: r.name, private: r.private, lang: LANG[r.name] || r.language || 'n/a', pushed: r.pushed_at.slice(0, 10) }));
}

let css = '', n = 0;
function typed(x, y, prompt, cmd, t0, dur) {
  const id = 'k' + n++, w = (cmd.length * CW + 12).toFixed(0), px = x + prompt.length * CW;
  css += `.${id}{animation:${id}a ${dur}s steps(${cmd.length},end) ${t0}s forwards}@keyframes ${id}a{to{transform:translateX(${w}px)}}`;
  return `<g opacity="0" style="animation:show 0s ${t0 - 0.01}s forwards">
<text x="${x}" y="${y}"><tspan fill="${C.cyan}">${esc(prompt)}</tspan><tspan fill="${C.text}">${esc(cmd)}</tspan></text>
<rect class="${id}" x="${px}" y="${y - 16}" width="${w}" height="22" fill="${C.bg}"/></g>`;
}
const line = (x, y, t0, inner) => `<text x="${x}" y="${y}" opacity="0" style="animation:show 0s ${t0}s forwards">${inner}</text>`;
const kv = (k, v) => `<tspan fill="${C.dim}">${k.padEnd(8)}</tspan><tspan fill="${C.text}">${esc(v)}</tspan>`;

function draw(list, today) {
  const P = 'igor@d-unit:~$ ', L = 36;
  // left: who, and the stack, all from the README
  let left = typed(L, 76, P, 'whoami', 0.4, 0.45);
  left += `<g opacity="0" style="animation:show 0s 1s forwards" font-size="60" font-weight="700" letter-spacing="2">
  <text class="g1" x="${L - 2}" y="142" fill="${C.cyan}" opacity="0">IGOR DAVINCI</text>
  <text class="g2" x="${L + 2}" y="142" fill="#ffffff" opacity="0">IGOR DAVINCI</text>
  <text x="${L}" y="142" fill="${C.text}">IGOR DAVINCI</text></g>`;
  left += typed(L, 174, '// ', 'automation & commissioning engineer · packaging machinery · italy', 1.4, 1.1);
  left += typed(L, 216, P, 'cat stack.txt', 2.7, 0.6);
  [
    ['plc', 'S7-1500 · TIA Portal · STEP 7 · Logix 5000 · Sysmac · TwinCAT 3'],
    ['motion', 'PLCopen · gearing · superimposed moves · axis managers'],
    ['safety', 'PNOZmulti 2 · F-CPU · PROFIsafe · speed monitoring · SLS'],
    ['hmi', 'WinCC Unified · WinCC Comfort · OPC UA'],
    ['field', 'CAT/SAT in 9 countries · Europe & North America'],
  ].forEach(([k, v], i) => (left += line(L, 242 + i * 24, 3.45 + i * 0.12, kv(k, v))));
  left += line(L, 380, 4.2, `<tspan fill="${C.cyan}">${P}</tspan><tspan class="cur" fill="${C.cyan}">█</tspan>`);

  // right: the repositories, newest push first
  const RX = 812, RW = 436, T = 1.2;
  const days = (d) => (Date.parse(today) - Date.parse(d)) / 864e5;
  let right = `<g opacity="0" style="animation:show 0s ${T}s forwards">
<rect x="${RX}.5" y="56.5" width="${RW}" height="340" fill="none" stroke="${C.line}"/>
<rect x="${RX + 14}" y="49" width="148" height="14" fill="${C.bg}"/>
<text x="${RX + 20}" y="61" fill="${C.dim}" font-size="12" letter-spacing="1">ls -lt ~/repos</text>
<text x="${RX + 16}" y="88" fill="${C.dim}" font-size="11" letter-spacing="1">MODE</text>
<text x="${RX + 76}" y="88" fill="${C.dim}" font-size="11" letter-spacing="1">NAME</text>
<text x="${RX + 246}" y="88" fill="${C.dim}" font-size="11" letter-spacing="1">STACK</text>
<text x="${RX + 342}" y="88" fill="${C.dim}" font-size="11" letter-spacing="1">LAST PUSH</text></g>`;
  list.slice(0, MAX).forEach((r, i) => {
    const y = 116 + i * 26, age = days(r.pushed);
    const led = age <= 7 ? `fill="${C.cyan}" class="hot"` : age <= 30 ? `fill="${C.cyan}" opacity=".45"` : `fill="none" stroke="${C.dim}"`;
    const name = r.name.length > 19 ? r.name.slice(0, 18) + '…' : r.name;
    const lang = r.lang.length > 10 ? r.lang.slice(0, 9) + '…' : r.lang;
    right += `<g opacity="0" style="animation:show 0s ${(T + 0.3 + i * 0.12).toFixed(2)}s forwards" font-size="13">
<rect x="${RX + 16}" y="${y - 9}" width="8" height="8" ${led}/>
<text x="${RX + 32}" y="${y}" fill="${C.dim}">${r.private ? 'priv' : 'pub '}</text>
<text x="${RX + 76}" y="${y}" fill="${C.text}">${esc(name)}</text>
<text x="${RX + 246}" y="${y}" fill="${C.cyan}">${esc(lang)}</text>
<text x="${RX + 342}" y="${y}" fill="${C.dim}">${r.pushed}</text></g>`;
  });
  const langs = new Set(list.map((r) => r.lang).filter((l) => l !== 'n/a')).size;
  right += line(RX + 16, 384, T + 0.4 + MAX * 0.12, `<tspan font-size="12" fill="${C.dim}">${list.length} repos · ${langs} languages · last push ${list[0] ? list[0].pushed : today}</tspan>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 420" width="1280" height="420" font-size="15" role="img" aria-labelledby="t">
<title id="t">Igor Davinci, Automation and Commissioning Engineer</title>
<style>
  svg{font-family:${MONO}} text{white-space:pre}
  @keyframes show{to{opacity:1}}
  ${css}
  .cur{animation:blink 1s steps(1,end) infinite}
  @keyframes blink{50%{opacity:0}}
  .hot{animation:hot 1.6s steps(2,jump-none) infinite}
  @keyframes hot{50%{opacity:.35}}
  .g1{animation:gl1 4.5s steps(1,end) 1s infinite}
  .g2{animation:gl2 4.5s steps(1,end) 1s infinite}
  @keyframes gl1{0%{opacity:.9;transform:translate(-5px,0)}4%{opacity:.9;transform:translate(4px,-2px)}8%,100%{opacity:0;transform:none}}
  @keyframes gl2{0%{opacity:.5;transform:translate(5px,1px)}4%{opacity:.5;transform:translate(-3px,2px)}8%,100%{opacity:0;transform:none}}
  .scan{animation:scan 7s linear infinite}
  @keyframes scan{from{transform:translateY(-40px)}to{transform:translateY(440px)}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important}[opacity="0"]{opacity:1}.g1,.g2{opacity:0}rect[class^="k"]{display:none}}
</style>
<defs><pattern id="lines" width="4" height="3" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="#000" opacity=".35"/></pattern></defs>
<rect width="1280" height="420" fill="${C.bg}"/>
<rect width="1280" height="34" fill="${C.bar}"/>
<path d="M0 34.5H1280" stroke="${C.line}"/>
<g fill="none" stroke="${C.dim}"><rect x="16.5" y="12.5" width="9" height="9"/><rect x="32.5" y="12.5" width="9" height="9"/><rect x="48.5" y="12.5" width="9" height="9"/></g>
<text x="640" y="22" fill="${C.dim}" font-size="12" text-anchor="middle" letter-spacing="1">igor@d-unit: ~ · tty1</text>
${left}
${right}
<rect width="1280" height="420" fill="url(#lines)"/>
<rect class="scan" width="1280" height="30" fill="${C.cyan}" opacity=".035"/>
</svg>
`;
}

(async () => {
  const list = await repos();
  // a token that cannot see the private repositories returns an empty list:
  // fail the run and keep the last good picture rather than publish nothing
  if (list.length === 0) throw new Error('no repositories visible to the token; banner left unchanged');
  const svg = draw(list, new Date().toISOString().slice(0, 10));
  fs.writeFileSync(process.argv[2] || 'banner.svg', svg);
  console.log(list.map((r) => `${r.private ? 'priv' : 'pub '} ${r.name} ${r.lang} ${r.pushed}`).join('\n'));
})().catch((e) => { console.error(e.message); process.exit(1); });
