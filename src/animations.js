/**
 * 开屏动画库：每个动画一个 id + 双语名字 + 一段 CSS。
 *
 * 约束（新增动画时照抄这份规矩）：
 * - CSS 选择器一律从 `#dsh-splash[data-anim="<id>"]` 起，不碰宿主；
 * - 只动 opacity / transform，不用 blur / backdrop-filter / box-shadow 补间；
 * - 时长都乘 `var(--dsh-splash-scale)`，这样设置页的快/慢档能整体缩放；
 * - 总时长要 ≤ 默认 holdMs（1750ms），否则没播完就淡出；
 * - 可用零件：mark（菱形 SVG）/ glow / beam / ring / shape / dots（3×3）/ bars（5 根）/ hud（四角框）/ spark（12 粒迸射）。
 */
export const ANIMATIONS = [
  {
    id: 'prism',
    name: { zh: '棱镜', en: 'Prism' },
    css: `
#dsh-splash[data-anim="prism"] .dsh-splash-mark { animation: dsh-splash-mark-in calc(620ms * var(--dsh-splash-scale)) cubic-bezier(0.16, 0.84, 0.32, 1) calc(80ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="prism"] .dsh-splash-glow { animation: dsh-splash-glow-breathe calc(1500ms * var(--dsh-splash-scale)) ease-out calc(200ms * var(--dsh-splash-scale)) 1; }
#dsh-splash[data-anim="prism"] .dsh-splash-beam { animation: dsh-splash-beam-sweep calc(1200ms * var(--dsh-splash-scale)) cubic-bezier(0.33, 0, 0.25, 1) calc(480ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="prism"] .dsh-splash-ring { display: block; border-style: dashed; border-color: rgba(150, 200, 255, 0.32); animation: dsh-splash-spin calc(2600ms * var(--dsh-splash-scale)) linear infinite, dsh-splash-fade-in calc(600ms * var(--dsh-splash-scale)) ease-out forwards; }
#dsh-splash[data-anim="prism"] .dsh-splash-hud { display: block; animation: dsh-splash-fade-in calc(520ms * var(--dsh-splash-scale)) ease-out calc(180ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="prism"] .dsh-splash-spark { display: block; }
#dsh-splash[data-anim="prism"] .dsh-splash-spark i { animation: dsh-splash-burst calc(760ms * var(--dsh-splash-scale)) cubic-bezier(0.2, 0.6, 0.3, 1) calc(420ms * var(--dsh-splash-scale)) forwards; }
@keyframes dsh-splash-mark-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
@keyframes dsh-splash-glow-breathe { 0% { opacity: 0; } 35% { opacity: 1; } 100% { opacity: 0.35; } }
@keyframes dsh-splash-beam-sweep { 0% { opacity: 0; transform: translateX(-28px) scaleX(0.7); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateX(28px) scaleX(1); } }
`,
  },
  {
    id: 'aurora',
    name: { zh: '极光', en: 'Aurora' },
    css: `
#dsh-splash[data-anim="aurora"] .dsh-splash-glow { width: 150vw; height: 240px; border-radius: 0; background: none; opacity: 1; }
#dsh-splash[data-anim="aurora"] .dsh-splash-glow::before,
#dsh-splash[data-anim="aurora"] .dsh-splash-glow::after { content: ""; position: absolute; left: -10%; right: -10%; height: 110px; opacity: 0; }
#dsh-splash[data-anim="aurora"] .dsh-splash-glow::before {
  top: 26px;
  background: linear-gradient(90deg, transparent, rgba(111, 227, 255, 0.42), rgba(79, 124, 255, 0.26), transparent);
  transform: translateX(-30%) rotate(-7deg);
  animation: dsh-splash-aurora-a calc(1600ms * var(--dsh-splash-scale)) cubic-bezier(0.4, 0, 0.2, 1) calc(60ms * var(--dsh-splash-scale)) forwards;
}
#dsh-splash[data-anim="aurora"] .dsh-splash-glow::after {
  top: 84px;
  background: linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.34), rgba(111, 227, 255, 0.26), transparent);
  transform: translateX(24%) rotate(6deg);
  animation: dsh-splash-aurora-b calc(1600ms * var(--dsh-splash-scale)) cubic-bezier(0.4, 0, 0.2, 1) calc(120ms * var(--dsh-splash-scale)) forwards;
}
#dsh-splash[data-anim="aurora"] .dsh-splash-beam { width: 130vw; height: 120px; background: linear-gradient(90deg, transparent, rgba(120, 180, 255, 0.22), transparent); animation: dsh-splash-aurora-c calc(1500ms * var(--dsh-splash-scale)) cubic-bezier(0.4, 0, 0.2, 1) calc(40ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="aurora"] .dsh-splash-hud { display: block; animation: dsh-splash-fade-in calc(700ms * var(--dsh-splash-scale)) ease-out calc(200ms * var(--dsh-splash-scale)) forwards; }
@keyframes dsh-splash-aurora-a { 0% { opacity: 0; transform: translateX(-30%) rotate(-7deg); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateX(30%) rotate(-7deg); } }
@keyframes dsh-splash-aurora-b { 0% { opacity: 0; transform: translateX(24%) rotate(6deg); } 35% { opacity: 1; } 100% { opacity: 0; transform: translateX(-24%) rotate(6deg); } }
@keyframes dsh-splash-aurora-c { 0% { opacity: 0; transform: translateX(-40%) scaleX(0.8); } 40% { opacity: 1; } 100% { opacity: 0; transform: translateX(40%) scaleX(1.05); } }
`,
  },
  {
    id: 'ripple',
    name: { zh: '涟漪', en: 'Ripple' },
    css: `
#dsh-splash[data-anim="ripple"] .dsh-splash-ring { opacity: 1; border: 0; }
#dsh-splash[data-anim="ripple"] .dsh-splash-ring::before,
#dsh-splash[data-anim="ripple"] .dsh-splash-ring::after { content: ""; position: absolute; inset: 0; border-radius: 50%; border: 1px solid var(--dsh-splash-beam); opacity: 0; animation: dsh-splash-ripple calc(1500ms * var(--dsh-splash-scale)) cubic-bezier(0.2, 0.6, 0.3, 1) forwards; }
#dsh-splash[data-anim="ripple"] .dsh-splash-ring::after { animation-delay: calc(420ms * var(--dsh-splash-scale)); }
#dsh-splash[data-anim="ripple"] .dsh-splash-shape { display: block; width: 14px; height: 14px; border-radius: 50%; animation: dsh-splash-core calc(1200ms * var(--dsh-splash-scale)) ease-out forwards; }
#dsh-splash[data-anim="ripple"] .dsh-splash-spark { display: block; }
#dsh-splash[data-anim="ripple"] .dsh-splash-spark i { animation: dsh-splash-burst calc(720ms * var(--dsh-splash-scale)) cubic-bezier(0.2, 0.6, 0.3, 1) calc(380ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="ripple"] .dsh-splash-hud { display: block; animation: dsh-splash-fade-in calc(600ms * var(--dsh-splash-scale)) ease-out calc(240ms * var(--dsh-splash-scale)) forwards; }
@keyframes dsh-splash-ripple { 0% { opacity: 0; transform: scale(0.35); } 18% { opacity: 0.9; } 100% { opacity: 0; transform: scale(2.1); } }
@keyframes dsh-splash-core { 0% { opacity: 0; transform: scale(0.4); } 30% { opacity: 1; transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
`,
  },
  {
    id: 'orbit',
    name: { zh: '轨道', en: 'Orbit' },
    css: `
#dsh-splash[data-anim="orbit"] .dsh-splash-ring { opacity: 1; border-color: rgba(150, 195, 255, 0.34); animation: dsh-splash-orbit calc(1700ms * var(--dsh-splash-scale)) cubic-bezier(0.35, 0, 0.3, 1) calc(60ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="orbit"] .dsh-splash-ring::after { content: ""; position: absolute; top: -3.5px; left: 50%; width: 7px; height: 7px; margin-left: -3.5px; border-radius: 50%; background: #cfe6ff; }
#dsh-splash[data-anim="orbit"] .dsh-splash-ring::before { content: ""; position: absolute; inset: 14px; border-radius: 50%; border: 1px dashed rgba(150, 200, 255, 0.3); animation: dsh-splash-spin calc(1500ms * var(--dsh-splash-scale)) linear infinite; }
#dsh-splash[data-anim="orbit"] .dsh-splash-shape { display: block; width: 10px; height: 10px; border-radius: 50%; animation: dsh-splash-core calc(900ms * var(--dsh-splash-scale)) ease-out calc(120ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="orbit"] .dsh-splash-hud { display: block; animation: dsh-splash-fade-in calc(600ms * var(--dsh-splash-scale)) ease-out calc(220ms * var(--dsh-splash-scale)) forwards; }
@keyframes dsh-splash-orbit { 0% { opacity: 0; transform: rotate(0deg) scale(0.9); } 22% { opacity: 1; } 100% { opacity: 1; transform: rotate(300deg) scale(1); } }
`,
  },
  {
    id: 'scan',
    name: { zh: '身份验证', en: 'Verify' },
    css: `
#dsh-splash[data-anim="scan"] { background-image: linear-gradient(rgba(120, 180, 255, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(120, 180, 255, 0.07) 1px, transparent 1px); background-size: 32px 32px, 32px 32px; }
#dsh-splash[data-anim="scan"] .dsh-splash-mark { display: none; }
#dsh-splash[data-anim="scan"] .dsh-splash-ring { display: block; width: 152px; height: 152px; border-color: rgba(120, 200, 255, 0.4); animation: dsh-splash-fade-in calc(320ms * var(--dsh-splash-scale)) ease-out forwards; }
#dsh-splash[data-anim="scan"] .dsh-splash-ring::before { content: ""; position: absolute; inset: 18px; border-radius: 50%; border: 1px dashed rgba(120, 200, 255, 0.36); animation: dsh-splash-spin calc(2200ms * var(--dsh-splash-scale)) linear infinite; }
#dsh-splash[data-anim="scan"] .dsh-splash-ring::after { content: ""; position: absolute; left: 50%; top: 50%; width: 16px; height: 16px; margin: -8px 0 0 -8px; background: #d8ecff; clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); box-shadow: 0 0 14px rgba(150, 205, 255, 0.85); opacity: 0; animation: dsh-splash-scan-core calc(900ms * var(--dsh-splash-scale)) ease-out calc(180ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="scan"] .dsh-splash-beam { width: 152px; height: 2px; bottom: auto; top: 50%; margin-top: -1px; background: linear-gradient(90deg, transparent, var(--dsh-splash-beam), transparent); animation: dsh-splash-scan calc(1100ms * var(--dsh-splash-scale)) cubic-bezier(0.4, 0, 0.2, 1) calc(120ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="scan"] .dsh-splash-hud { display: block; animation: dsh-splash-fade-in calc(500ms * var(--dsh-splash-scale)) ease-out forwards; }
#dsh-splash[data-anim="scan"] .dsh-splash-hud i { animation: dsh-splash-scan-corner calc(1400ms * var(--dsh-splash-scale)) ease-out calc(100ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="scan"] .dsh-splash-caption { display: block; }
#dsh-splash[data-anim="scan"] .dsh-splash-caption-a { animation: dsh-splash-caption-a calc(720ms * var(--dsh-splash-scale)) ease-out calc(120ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="scan"] .dsh-splash-caption-b { animation: dsh-splash-caption-b calc(520ms * var(--dsh-splash-scale)) cubic-bezier(0.2, 0.7, 0.3, 1) calc(980ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="scan"] .dsh-splash-caption-sub { animation: dsh-splash-fade-in calc(500ms * var(--dsh-splash-scale)) ease-out calc(1200ms * var(--dsh-splash-scale)) forwards; }
@keyframes dsh-splash-scan { 0% { opacity: 0; transform: translateY(-64px); } 10% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; transform: translateY(64px); } }
@keyframes dsh-splash-scan-core { 0% { opacity: 0; transform: scale(0.4); } 30% { opacity: 1; transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
@keyframes dsh-splash-scan-corner { 0% { opacity: 0; transform: scale(1.4); } 40% { opacity: 1; transform: scale(1); } 100% { opacity: 0.55; transform: scale(1); } }
@keyframes dsh-splash-caption-a { 0% { opacity: 0; } 12% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; } }
@keyframes dsh-splash-caption-b { 0% { opacity: 0; transform: translateY(4px); } 100% { opacity: 1; transform: translateY(0); } }
`,
  },
  {
    id: 'starlight',
    name: { zh: '星芒', en: 'Starlight' },
    css: `
#dsh-splash[data-anim="starlight"] .dsh-splash-ring { opacity: 1; border: 0; }
#dsh-splash[data-anim="starlight"] .dsh-splash-ring::before,
#dsh-splash[data-anim="starlight"] .dsh-splash-ring::after { content: ""; position: absolute; left: 50%; top: 50%; background: linear-gradient(90deg, transparent, var(--dsh-splash-beam), transparent); opacity: 0; animation: dsh-splash-star calc(1300ms * var(--dsh-splash-scale)) ease-out calc(120ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="starlight"] .dsh-splash-ring::before { width: 240px; height: 1px; margin: -0.5px 0 0 -120px; }
#dsh-splash[data-anim="starlight"] .dsh-splash-ring::after { width: 240px; height: 1px; margin: -0.5px 0 0 -120px; transform: rotate(90deg); animation-name: dsh-splash-star-v; }
#dsh-splash[data-anim="starlight"] .dsh-splash-shape { display: block; width: 12px; height: 12px; border-radius: 50%; animation: dsh-splash-core calc(1100ms * var(--dsh-splash-scale)) ease-out calc(140ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="starlight"] .dsh-splash-spark { display: block; }
#dsh-splash[data-anim="starlight"] .dsh-splash-spark i { animation: dsh-splash-burst calc(820ms * var(--dsh-splash-scale)) cubic-bezier(0.2, 0.6, 0.3, 1) calc(360ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="starlight"] .dsh-splash-hud { display: block; animation: dsh-splash-fade-in calc(700ms * var(--dsh-splash-scale)) ease-out calc(220ms * var(--dsh-splash-scale)) forwards; }
@keyframes dsh-splash-star { 0% { opacity: 0; transform: scaleX(0.15); } 35% { opacity: 1; transform: scaleX(1); } 100% { opacity: 0; transform: scaleX(1.4); } }
@keyframes dsh-splash-star-v { 0% { opacity: 0; transform: rotate(90deg) scaleX(0.15); } 35% { opacity: 1; transform: rotate(90deg) scaleX(1); } 100% { opacity: 0; transform: rotate(90deg) scaleX(1.4); } }
`,
  },
  {
    id: 'hex',
    name: { zh: '六棱', en: 'Hex' },
    css: `
#dsh-splash[data-anim="hex"] .dsh-splash-shape { display: block; width: 96px; height: 96px; border-radius: 0; clip-path: polygon(50% 0, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%); animation: dsh-splash-hex-in calc(900ms * var(--dsh-splash-scale)) cubic-bezier(0.16, 0.84, 0.32, 1) calc(80ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="hex"] .dsh-splash-ring { opacity: 1; border-color: rgba(150, 195, 255, 0.3); animation: dsh-splash-ring-open calc(1500ms * var(--dsh-splash-scale)) ease-out calc(120ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="hex"] .dsh-splash-spark { display: block; }
#dsh-splash[data-anim="hex"] .dsh-splash-spark i { animation: dsh-splash-burst calc(780ms * var(--dsh-splash-scale)) cubic-bezier(0.2, 0.6, 0.3, 1) calc(400ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="hex"] .dsh-splash-hud { display: block; animation: dsh-splash-fade-in calc(600ms * var(--dsh-splash-scale)) ease-out calc(160ms * var(--dsh-splash-scale)) forwards; }
@keyframes dsh-splash-hex-in { 0% { opacity: 0; transform: scale(0.84) rotate(-12deg); } 60% { opacity: 1; } 100% { opacity: 1; transform: scale(1) rotate(0deg); } }
@keyframes dsh-splash-ring-open { 0% { opacity: 0; transform: scale(0.9); } 40% { opacity: 0.75; } 100% { opacity: 0.22; transform: scale(1.16); } }
`,
  },
  {
    id: 'dots',
    name: { zh: '点阵', en: 'Dots' },
    css: `
#dsh-splash[data-anim="dots"] .dsh-splash-dots { display: grid; }
#dsh-splash[data-anim="dots"] .dsh-splash-dots i { animation: dsh-splash-dot-in calc(520ms * var(--dsh-splash-scale)) cubic-bezier(0.2, 0.7, 0.3, 1) forwards; }
#dsh-splash[data-anim="dots"] .dsh-splash-dots i:nth-child(1) { animation-delay: calc(40ms * var(--dsh-splash-scale)); }
#dsh-splash[data-anim="dots"] .dsh-splash-dots i:nth-child(2) { animation-delay: calc(90ms * var(--dsh-splash-scale)); }
#dsh-splash[data-anim="dots"] .dsh-splash-dots i:nth-child(3) { animation-delay: calc(140ms * var(--dsh-splash-scale)); }
#dsh-splash[data-anim="dots"] .dsh-splash-dots i:nth-child(4) { animation-delay: calc(190ms * var(--dsh-splash-scale)); }
#dsh-splash[data-anim="dots"] .dsh-splash-dots i:nth-child(5) { animation-delay: calc(240ms * var(--dsh-splash-scale)); }
#dsh-splash[data-anim="dots"] .dsh-splash-dots i:nth-child(6) { animation-delay: calc(290ms * var(--dsh-splash-scale)); }
#dsh-splash[data-anim="dots"] .dsh-splash-dots i:nth-child(7) { animation-delay: calc(340ms * var(--dsh-splash-scale)); }
#dsh-splash[data-anim="dots"] .dsh-splash-dots i:nth-child(8) { animation-delay: calc(390ms * var(--dsh-splash-scale)); }
#dsh-splash[data-anim="dots"] .dsh-splash-dots i:nth-child(9) { animation-delay: calc(440ms * var(--dsh-splash-scale)); }
#dsh-splash[data-anim="dots"] .dsh-splash-ring { opacity: 1; border-color: rgba(150, 195, 255, 0.22); animation: dsh-splash-ring-open calc(1500ms * var(--dsh-splash-scale)) ease-out calc(200ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="dots"] .dsh-splash-spark { display: block; }
#dsh-splash[data-anim="dots"] .dsh-splash-spark i { animation: dsh-splash-burst calc(760ms * var(--dsh-splash-scale)) cubic-bezier(0.2, 0.6, 0.3, 1) calc(560ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="dots"] .dsh-splash-hud { display: block; animation: dsh-splash-fade-in calc(700ms * var(--dsh-splash-scale)) ease-out calc(300ms * var(--dsh-splash-scale)) forwards; }
@keyframes dsh-splash-dot-in { 0% { opacity: 0; transform: scale(0.4); } 100% { opacity: 1; transform: scale(1); } }
`,
  },
  {
    id: 'bars',
    name: { zh: '脉冲', en: 'Pulse' },
    css: `
#dsh-splash[data-anim="bars"] .dsh-splash-bars { display: flex; }
#dsh-splash[data-anim="bars"] .dsh-splash-bars i { animation: dsh-splash-bar-rise calc(760ms * var(--dsh-splash-scale)) cubic-bezier(0.2, 0.8, 0.3, 1) forwards; }
#dsh-splash[data-anim="bars"] .dsh-splash-bars i:nth-child(1) { animation-delay: calc(20ms * var(--dsh-splash-scale)); }
#dsh-splash[data-anim="bars"] .dsh-splash-bars i:nth-child(2) { animation-delay: calc(90ms * var(--dsh-splash-scale)); }
#dsh-splash[data-anim="bars"] .dsh-splash-bars i:nth-child(3) { animation-delay: calc(160ms * var(--dsh-splash-scale)); }
#dsh-splash[data-anim="bars"] .dsh-splash-bars i:nth-child(4) { animation-delay: calc(230ms * var(--dsh-splash-scale)); }
#dsh-splash[data-anim="bars"] .dsh-splash-bars i:nth-child(5) { animation-delay: calc(300ms * var(--dsh-splash-scale)); }
#dsh-splash[data-anim="bars"] .dsh-splash-beam { animation: dsh-splash-beam-sweep calc(900ms * var(--dsh-splash-scale)) cubic-bezier(0.33, 0, 0.25, 1) calc(620ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="bars"] .dsh-splash-hud { display: block; animation: dsh-splash-fade-in calc(600ms * var(--dsh-splash-scale)) ease-out calc(200ms * var(--dsh-splash-scale)) forwards; }
@keyframes dsh-splash-bar-rise { 0% { opacity: 0.2; transform: scaleY(0.16); } 55% { opacity: 1; transform: scaleY(1); } 100% { opacity: 1; transform: scaleY(0.72); } }
`,
  },
  {
    id: 'arcs',
    name: { zh: '弧光', en: 'Arcs' },
    css: `
#dsh-splash[data-anim="arcs"] .dsh-splash-ring { opacity: 1; width: 136px; height: 136px; border: 0; background: conic-gradient(from 0deg, transparent 0 52%, rgba(111, 227, 255, 0.9) 74%, rgba(167, 139, 250, 0.6) 88%, transparent 96%); mask: radial-gradient(circle, transparent 61%, #000 63%); -webkit-mask: radial-gradient(circle, transparent 61%, #000 63%); animation: dsh-splash-spin calc(1200ms * var(--dsh-splash-scale)) linear infinite, dsh-splash-fade-in calc(400ms * var(--dsh-splash-scale)) ease-out forwards; }
#dsh-splash[data-anim="arcs"] .dsh-splash-ring::before { content: ""; position: absolute; inset: 10px; border-radius: 50%; border: 2px solid transparent; border-bottom-color: var(--dsh-splash-beam); border-left-color: var(--dsh-splash-beam); animation: dsh-splash-arcs-spin-rev calc(1200ms * var(--dsh-splash-scale)) cubic-bezier(0.3, 0, 0.2, 1) calc(60ms * var(--dsh-splash-scale)) forwards; }
#dsh-splash[data-anim="arcs"] .dsh-splash-hud { display: block; animation: dsh-splash-fade-in calc(600ms * var(--dsh-splash-scale)) ease-out calc(200ms * var(--dsh-splash-scale)) forwards; }
@keyframes dsh-splash-arcs-spin-rev { 0% { opacity: 0; transform: rotate(90deg); } 40% { opacity: 0.9; } 100% { opacity: 0.7; transform: rotate(-160deg); } }
`,
  },
]

/** 没有偏好的时候用哪个。 */
export const DEFAULT_ANIMATION = 'prism'

/** 校验一个 id 是否在库里。 */
export function hasAnimation(id) {
  return ANIMATIONS.some((animation) => animation.id === id)
}

/** 画廊需要的精简目录（注入脚本会把它挂到 window 上给设置页用）。 */
export function animationCatalog() {
  return ANIMATIONS.map(({ id, name }) => ({ id, name }))
}
