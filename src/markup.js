/**
 * splash 的 HTML 片段：stage 里放着所有动画可能用到的“零件”。
 *
 * 零件：光晕 glow、圆环 ring、通用形状 shape、菱形 mark（SVG）、
 * 点阵 dots（3×3）、竖条 bars（5 根）、HUD 四角框 hud、迸射粒子 spark（12 粒）、光带 beam。
 *
 * 每个动画只通过 `[data-anim="<id>"]` 启用其中几件（见 src/animations.js），
 * 其余默认 display:none / opacity:0。这样新增一个动画只需要加 CSS，
 * 不用改注入结构，也不用动客户端。
 *
 * 不写死 data-anim：真值来自 localStorage，由注入脚本在首帧设置；
 * 脚本没跑时基础样式会显示一枚静态标记，不会留空屏。
 */
export function markup(state) {
  return `<div id="dsh-splash" role="presentation" aria-hidden="true" data-hold="${state.holdMs}" data-max="${state.maxMs}" data-quiet="${state.quietSeconds}">
<div class="dsh-splash-stage">
<div class="dsh-splash-glow"></div>
<div class="dsh-splash-ring"></div>
<div class="dsh-splash-hud"><i></i><i></i><i></i><i></i></div>
<div class="dsh-splash-shape"></div>
<svg class="dsh-splash-mark" viewBox="0 0 96 96" width="96" height="96" aria-hidden="true" focusable="false">
<defs>
<linearGradient id="dsh-splash-gradient" x1="14" y1="14" x2="82" y2="82" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="#9ad6ff"/>
<stop offset="1" stop-color="#3f7dff"/>
</linearGradient>
</defs>
<path d="M48 9 87 48 48 87 9 48Z" fill="none" stroke="url(#dsh-splash-gradient)" stroke-width="3" stroke-linejoin="round"/>
<path d="M48 29.5 66.5 48 48 66.5 29.5 48Z" fill="none" stroke="url(#dsh-splash-gradient)" stroke-width="2" stroke-linejoin="round" opacity="0.5"/>
<circle cx="48" cy="48" r="4.5" fill="#e6f1ff"/>
</svg>
<div class="dsh-splash-dots"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
<div class="dsh-splash-bars"><i></i><i></i><i></i><i></i><i></i></div>
<div class="dsh-splash-spark"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
<div class="dsh-splash-caption"><span class="dsh-splash-caption-a">正在验证身份</span><span class="dsh-splash-caption-b">身份验证成功</span><span class="dsh-splash-caption-sub">RETINA MATCH · 0x7F3A</span></div>
<div class="dsh-splash-beam"></div>
</div>
</div>`
}
