/**
 * splash 的基础样式 + 动画库的拼装。
 *
 * 约束（改这里之前先读）：
 * - 选择器只从 `#dsh-splash` 起，不碰 html / body / :root，不动任何 `--dsw-*` 变量；
 * - 动画只改 opacity / transform，不用 backdrop-filter、blur、box-shadow 补间；
 * - 整层 contain: strict，是独立合成层，移除后不留任何全局样式；
 * - 自带一条 CSS 兜底退场：即使 JS 完全没跑，也不会永久遮挡界面；
 * - 动画本体在 src/animations.js，每个动画只通过 `[data-anim="<id>"]` 选择自己的层。
 */
import { ANIMATIONS } from './animations.js'

const BASE = `
#dsh-splash {
  --dsh-splash-bg: #06080d;
  --dsh-splash-a1: #6fe3ff;
  --dsh-splash-a2: #4f7cff;
  --dsh-splash-a3: #a78bfa;
  --dsh-splash-halo: rgba(96, 165, 255, 0.3);
  --dsh-splash-beam: rgba(147, 197, 253, 0.9);
  --dsh-splash-scale: 1;
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  display: grid;
  place-items: center;
  background: var(--dsh-splash-bg);
  contain: strict;
  opacity: 1;
  transform: scale(1);
  transition: opacity calc(320ms * var(--dsh-splash-scale)) ease, transform calc(320ms * var(--dsh-splash-scale)) ease;
  animation: dsh-splash-auto-out calc(320ms * var(--dsh-splash-scale)) linear calc(4600ms * var(--dsh-splash-scale)) forwards;
  user-select: none;
  -webkit-user-select: none;
  cursor: default;
}
@media (prefers-color-scheme: light) {
  #dsh-splash {
    --dsh-splash-bg: #f4f6fa;
    --dsh-splash-halo: rgba(47, 107, 255, 0.18);
    --dsh-splash-beam: rgba(47, 107, 255, 0.6);
    --dsh-splash-a1: #2f8dff;
    --dsh-splash-a2: #3f5cff;
    --dsh-splash-a3: #7c5cff;
  }
}
#dsh-splash[data-done] {
  animation: none;
  opacity: 0;
  transform: scale(1.008);
  pointer-events: none;
}
#dsh-splash[data-preview] {
  position: absolute;
  inset: 0;
  z-index: 0;
  animation: none;
  contain: layout paint;
  transform: none;
}
#dsh-splash[data-preview][data-done] { opacity: 1; transform: none; }
/* 预览框比全屏小，四角框与粒子按比例收一点，避免被预览框裁掉。 */
#dsh-splash[data-preview] .dsh-splash-hud { width: 172px; height: 172px; }
#dsh-splash[data-preview] .dsh-splash-spark { transform: scale(0.78); }
#dsh-splash .dsh-splash-stage {
  position: relative;
  display: grid;
  place-items: center;
  width: 120px;
  height: 120px;
}
#dsh-splash .dsh-splash-ring {
  position: absolute;
  width: 128px;
  height: 128px;
  border: 1px solid var(--dsh-splash-beam);
  border-radius: 50%;
  opacity: 0;
}
#dsh-splash .dsh-splash-glow {
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--dsh-splash-halo) 0%, transparent 66%);
  opacity: 0;
}
#dsh-splash .dsh-splash-mark {
  position: relative;
  width: 96px;
  height: 96px;
  opacity: 0;
  transform: scale(0.92);
}
#dsh-splash:not([data-anim]) .dsh-splash-mark {
  opacity: 1;
  transform: none;
}
#dsh-splash .dsh-splash-shape {
  position: absolute;
  display: none;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(150deg, var(--dsh-splash-a1), var(--dsh-splash-a2) 60%, var(--dsh-splash-a3));
  opacity: 0;
}
#dsh-splash .dsh-splash-dots {
  position: absolute;
  display: none;
  grid-template-columns: repeat(3, 12px);
  grid-auto-rows: 12px;
  gap: 12px;
}
#dsh-splash .dsh-splash-dots i {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(180deg, var(--dsh-splash-a1), var(--dsh-splash-a2));
  opacity: 0;
  transform: scale(0.4);
}
#dsh-splash .dsh-splash-bars {
  position: absolute;
  display: none;
  align-items: flex-end;
  gap: 8px;
  height: 72px;
}
#dsh-splash .dsh-splash-bars i {
  width: 6px;
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(180deg, var(--dsh-splash-a1), var(--dsh-splash-a2));
  opacity: 0.9;
  transform: scaleY(0.16);
  transform-origin: bottom center;
}
#dsh-splash .dsh-splash-hud {
  position: absolute;
  display: none;
  width: 196px;
  height: 196px;
  opacity: 0;
}
#dsh-splash .dsh-splash-hud i {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 1px solid var(--dsh-splash-beam);
}
#dsh-splash .dsh-splash-hud i:nth-child(1) { top: 0; left: 0; border-right: 0; border-bottom: 0; }
#dsh-splash .dsh-splash-hud i:nth-child(2) { top: 0; right: 0; border-left: 0; border-bottom: 0; }
#dsh-splash .dsh-splash-hud i:nth-child(3) { bottom: 0; left: 0; border-right: 0; border-top: 0; }
#dsh-splash .dsh-splash-hud i:nth-child(4) { bottom: 0; right: 0; border-left: 0; border-top: 0; }
#dsh-splash .dsh-splash-spark {
  position: absolute;
  display: none;
  width: 0;
  height: 0;
}
#dsh-splash .dsh-splash-spark i {
  position: absolute;
  width: 3px;
  height: 3px;
  margin: -1.5px 0 0 -1.5px;
  border-radius: 50%;
  background: var(--dsh-splash-a1);
  opacity: 0;
}
#dsh-splash .dsh-splash-spark i:nth-child(1) { --a: 0deg; }
#dsh-splash .dsh-splash-spark i:nth-child(2) { --a: 30deg; }
#dsh-splash .dsh-splash-spark i:nth-child(3) { --a: 60deg; }
#dsh-splash .dsh-splash-spark i:nth-child(4) { --a: 90deg; }
#dsh-splash .dsh-splash-spark i:nth-child(5) { --a: 120deg; }
#dsh-splash .dsh-splash-spark i:nth-child(6) { --a: 150deg; }
#dsh-splash .dsh-splash-spark i:nth-child(7) { --a: 180deg; }
#dsh-splash .dsh-splash-spark i:nth-child(8) { --a: 210deg; }
#dsh-splash .dsh-splash-spark i:nth-child(9) { --a: 240deg; }
#dsh-splash .dsh-splash-spark i:nth-child(10) { --a: 270deg; }
#dsh-splash .dsh-splash-spark i:nth-child(11) { --a: 300deg; }
#dsh-splash .dsh-splash-spark i:nth-child(12) { --a: 330deg; }
#dsh-splash .dsh-splash-caption {
  position: absolute;
  top: calc(50% + 104px);
  left: 50%;
  width: 260px;
  height: 56px;
  margin-left: -130px;
  display: none;
  text-align: center;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  color: rgba(190, 225, 255, 0.92);
  white-space: nowrap;
}
#dsh-splash .dsh-splash-caption-a,
#dsh-splash .dsh-splash-caption-b {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  opacity: 0;
}
#dsh-splash .dsh-splash-caption-a { font-size: 12px; line-height: 20px; letter-spacing: 0.18em; }
#dsh-splash .dsh-splash-caption-b { font-size: 16px; line-height: 24px; letter-spacing: 0.14em; color: #e4f3ff; }
#dsh-splash .dsh-splash-caption-sub {
  position: absolute;
  left: 0;
  right: 0;
  top: 34px;
  opacity: 0;
  font-size: 9px;
  line-height: 14px;
  letter-spacing: 0.22em;
  color: rgba(140, 190, 255, 0.7);
}
#dsh-splash[data-preview] .dsh-splash-caption { top: calc(50% + 58px); transform: scale(0.68); transform-origin: top center; }
#dsh-splash .dsh-splash-beam {
  position: absolute;
  width: 168px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--dsh-splash-beam), transparent);
  opacity: 0;
  transform: translateX(-28px);
}
/* 只有棱镜与扫描保留那枚菱形标记，其余动画用自己的图形。 */
#dsh-splash[data-anim]:not([data-anim="prism"]):not([data-anim="scan"]) .dsh-splash-mark {
  display: none;
}
@keyframes dsh-splash-spin { to { transform: rotate(360deg); } }
@keyframes dsh-splash-burst {
  0% { opacity: 0; transform: rotate(var(--a)) translateY(-10px) scale(0.6); }
  25% { opacity: 1; }
  100% { opacity: 0; transform: rotate(var(--a)) translateY(-104px) scale(0.2); }
}
@keyframes dsh-splash-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes dsh-splash-auto-out {
  to { opacity: 0; visibility: hidden; }
}
@media (prefers-reduced-motion: reduce) {
  #dsh-splash { transition: opacity calc(120ms * var(--dsh-splash-scale)) linear; }
  #dsh-splash .dsh-splash-glow { animation: none; opacity: 0.6; }
  #dsh-splash .dsh-splash-mark { animation: none; opacity: 1; transform: none; }
  #dsh-splash .dsh-splash-shape { animation: none; opacity: 1; transform: none; }
  #dsh-splash .dsh-splash-dots i,
  #dsh-splash .dsh-splash-bars i { animation: none; opacity: 1; transform: none; }
  #dsh-splash .dsh-splash-hud { animation: none; opacity: 0.35; }
  #dsh-splash .dsh-splash-spark i { animation: none; }
  #dsh-splash .dsh-splash-beam,
  #dsh-splash .dsh-splash-ring { animation: none; opacity: 0; }
}
`

/** 基础样式 + 所有动画；新加动画只改 src/animations.js。 */
export const CSS = [BASE, ...ANIMATIONS.map((animation) => animation.css)].join('\n')
