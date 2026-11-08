/**
 * dsh-splash-screen — 宿主半。
 *
 * 只做一件事：把首帧 splash 的 style / html / script 三行推进 index 注入表。
 * 注入行在每次 index 渲染（以及桌面端 boot payload 请求）时重新生成，
 * 所以配置改动刷新页面即生效，不需要重启 Host。
 *
 * 为什么用注入而不是 slot：slot 要等 React 挂载完才出现，用户会先看到一帧
 * 已经渲染好的界面再盖上动画；注入行由 index.html / 桌面 boot 在 React
 * mount 之前应用，首帧就是 splash。
 *
 * 浏览器半（client.js）只负责在界面真正画到屏幕上之后派发
 * `dsh-splash:ready`，本文件不渲染任何 UI。
 */
import { CSS } from './src/style.js'
import { markup } from './src/markup.js'
import { bootScript } from './src/boot.js'
import { animationCatalog, DEFAULT_ANIMATION } from './src/animations.js'

/** 未配置时的默认值。 */
const DEFAULTS = {
  enabled: true,
  holdMs: 1750,
  maxMs: 4000,
  quietSeconds: 3,
}

/** 把配置收敛成有界整数，坏值退回默认值。 */
function bound(value, fallback, min, max) {
  const number = Number(value)
  if (!Number.isFinite(number)) return fallback
  return Math.min(max, Math.max(min, Math.round(number)))
}

/** 读取入口 config；缺省、null、非对象都按默认值处理。 */
function normalize(config) {
  const source = config && typeof config === 'object' ? config : {}
  return {
    enabled: source.enabled !== false,
    holdMs: bound(source.holdMs, DEFAULTS.holdMs, 0, 6000),
    maxMs: bound(source.maxMs, DEFAULTS.maxMs, 800, 12000),
    quietSeconds: bound(source.quietSeconds, DEFAULTS.quietSeconds, 0, 3600),
  }
}

/**
 * 插件入口。
 * @param ctx - 宿主 Cordis 上下文（这里不需要注入任何 Service）。
 * @param config - cordis.patch.yml 中该行的 config。
 */
export function apply(ctx, config) {
  const state = normalize(config)
  if (!state.enabled) return

  ctx.on('webserver/index-inject', (rows) => {
    if (!Array.isArray(rows)) return
    rows.push(
      { kind: 'style', text: CSS },
      { kind: 'html', placement: 'body', html: markup(state) },
      { kind: 'script', placement: 'body', text: bootScript(JSON.stringify(animationCatalog()), DEFAULT_ANIMATION) },
    )
  })
}

export default { apply }
