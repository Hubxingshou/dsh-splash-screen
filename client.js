/**
 * dsh-splash-screen — 浏览器半（client plugin bundle）。
 *
 * 三个职责，都不碰宿主主题：
 *   1. shell.overlay 传感器：外壳画到屏幕上后派发 `dsh-splash:ready`，并把
 *      `--dsw-alias-bg-base` 的计算值写到 splash 自己的变量上（只读宿主 token）。
 *   2. settings.general.item 一行：开关 + 快/标准/慢。
 *   3. settings.section 一页「开屏动画」：动画画廊 + 即时预览 + 全屏试播 + 手动刷新。
 *
 * 偏好全部存在 localStorage（`dsh-splash:prefs:v1`），注入脚本在首帧读取，
 * 所以换动画 / 换速度只需要刷新页面，不需要重启应用。
 *
 * 动画目录来自注入脚本挂到 window.__DSH_SPLASH_CATALOG__ 的数组（源头是 src/animations.js），
 * 这里不重复维护 id 列表；拿不到时退回内置的 prism。
 */
window.__ModuleLoader__.load({
  id: 'dsh-splash-screen',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    /** 偏好存储键；注入脚本 src/boot.js 读的是同一个键，改名必须两边同步。 */
    const PREFS_KEY = 'dsh-splash:prefs:v1'
    const SPEEDS = ['fast', 'standard', 'slow']
    const SCALE = { fast: 0.75, standard: 1, slow: 1.35 }

    const DICT = {
      zh: {
        title: '开屏动画',
        desc: '启动时先显示一小段动画再进入界面。换动画或速度后刷新页面生效。',
        section: '开屏动画',
        speed: '速度',
        fast: '快',
        standard: '标准',
        slow: '慢',
        gallery: '动画',
        current: '当前',
        play: '全屏试播',
        reload: '刷新页面',
        preview: '预览',
        hint: '点卡片即时预览；「全屏试播」按当前设置播一遍；「刷新页面」看真实开机效果。',
      },
      en: {
        title: 'Splash animation',
        desc: 'Shows a short animation before the app appears. Pick an animation or speed, then reload the page.',
        section: 'Splash animation',
        speed: 'Speed',
        fast: 'Fast',
        standard: 'Standard',
        slow: 'Slow',
        gallery: 'Animations',
        current: 'Current',
        play: 'Play full screen',
        reload: 'Reload page',
        preview: 'Preview',
        hint: 'Click a card to preview instantly. Play runs it full screen with your current settings. Reload shows the real boot.',
      },
    }

    function readPrefs() {
      const fallback = { enabled: true, speed: 'standard', animation: 'prism' }
      try {
        const raw = window.localStorage.getItem(PREFS_KEY)
        if (!raw) return fallback
        const value = JSON.parse(raw)
        return {
          enabled: value.enabled !== false,
          speed: SPEEDS.indexOf(value.speed) >= 0 ? value.speed : 'standard',
          animation: typeof value.animation === 'string' && value.animation ? value.animation : 'prism',
        }
      } catch (error) {
        return fallback
      }
    }

    function writePrefs(prefs) {
      try {
        window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
      } catch (error) {
        /* 存储不可用时只影响本次展示，不阻断设置页 */
      }
    }

    function catalog() {
      const injected = typeof window !== 'undefined' ? window.__DSH_SPLASH_CATALOG__ : undefined
      if (Array.isArray(injected) && injected.length > 0) {
        return injected.filter((item) => item && typeof item.id === 'string')
      }
      return [{ id: 'prism', name: { zh: '棱镜', en: 'Prism' } }]
    }

    // 语言兜底：拿不到 locale 服务时按浏览器语言选字典。
    // 顺序很重要：index.html 的 <html lang> 永远是 "en"，不能拿它当依据。
    const fallbackLang = String(
      (typeof navigator !== 'undefined' && navigator.language) ||
        (typeof document !== 'undefined' && document.documentElement.lang) ||
        'en',
    ).toLowerCase()
    let t = (key) => (fallbackLang.indexOf('zh') === 0 ? DICT.zh : DICT.en)[key] || key

    function animationName(item) {
      const name = item && item.name
      if (!name) return item && item.id ? item.id : ''
      const zh = fallbackLang.indexOf('zh') === 0
      return (zh ? name.zh : name.en) || name.en || name.zh || item.id
    }

    /** splash 的 DOM 骨架；preview=true 时交给设置页的预览框定位。 */
    function SplashStage({ animation, scale, preview, onDismiss }) {
      return h(
        'div',
        {
          id: 'dsh-splash',
          'data-anim': animation,
          'data-preview': preview ? '' : undefined,
          'aria-hidden': 'true',
          onClick: onDismiss,
          style: scale && scale !== 1 ? { '--dsh-splash-scale': String(scale) } : undefined,
        },
        h('div', { className: 'dsh-splash-stage' }, [
          h('div', { key: 'glow', className: 'dsh-splash-glow' }),
          h('div', { key: 'ring', className: 'dsh-splash-ring' }),
          h(
            'div',
            { key: 'hud', className: 'dsh-splash-hud' },
            Array.from({ length: 4 }, (_, index) => h('i', { key: index })),
          ),
          h('div', { key: 'shape', className: 'dsh-splash-shape' }),
          h(
            'svg',
            {
              key: 'mark',
              className: 'dsh-splash-mark',
              viewBox: '0 0 96 96',
              width: 96,
              height: 96,
              'aria-hidden': 'true',
              focusable: 'false',
            },
            [
              h(
                'defs',
                { key: 'defs' },
                h(
                  'linearGradient',
                  { id: 'dsh-splash-gradient', x1: 14, y1: 14, x2: 82, y2: 82, gradientUnits: 'userSpaceOnUse' },
                  [
                    h('stop', { key: 'a', offset: '0', stopColor: '#9ad6ff' }),
                    h('stop', { key: 'b', offset: '1', stopColor: '#3f7dff' }),
                  ],
                ),
              ),
              h('path', {
                key: 'outer',
                d: 'M48 9 87 48 48 87 9 48Z',
                fill: 'none',
                stroke: 'url(#dsh-splash-gradient)',
                strokeWidth: 3,
                strokeLinejoin: 'round',
              }),
              h('path', {
                key: 'inner',
                d: 'M48 29.5 66.5 48 48 66.5 29.5 48Z',
                fill: 'none',
                stroke: 'url(#dsh-splash-gradient)',
                strokeWidth: 2,
                strokeLinejoin: 'round',
                opacity: 0.5,
              }),
              h('circle', { key: 'dot', cx: 48, cy: 48, r: 4.5, fill: '#e6f1ff' }),
            ],
          ),
          h(
            'div',
            { key: 'dots', className: 'dsh-splash-dots' },
            Array.from({ length: 9 }, (_, index) => h('i', { key: index })),
          ),
          h(
            'div',
            { key: 'bars', className: 'dsh-splash-bars' },
            Array.from({ length: 5 }, (_, index) => h('i', { key: index })),
          ),
          h(
            'div',
            { key: 'spark', className: 'dsh-splash-spark' },
            Array.from({ length: 12 }, (_, index) => h('i', { key: index })),
          ),
          h('div', { key: 'caption', className: 'dsh-splash-caption' }, [
            h('span', { key: 'a', className: 'dsh-splash-caption-a' }, '正在验证身份'),
            h('span', { key: 'b', className: 'dsh-splash-caption-b' }, '身份验证成功'),
            h('span', { key: 'sub', className: 'dsh-splash-caption-sub' }, 'RETINA MATCH · 0x7F3A'),
          ]),
          h('div', { key: 'beam', className: 'dsh-splash-beam' }),
        ]),
      )
    }

    /** 行样式：抄自宿主设置行的排版与开关尺寸，只引用 --dsw-alias-* token，选择器全部带前缀。 */
    const ROW_CSS = `
.dsh-splash-row{display:flex;align-items:center;gap:8px;padding:16px 0;border-bottom:.5px solid var(--dsw-alias-border-l2)}
.dsh-splash-row-text{display:flex;flex-direction:column;flex:1;gap:4px;min-width:0;padding-right:48px}
.dsh-splash-row-title{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:400;line-height:22px}
.dsh-splash-row-desc{color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:400;line-height:18px}
.dsh-splash-row-control{display:inline-flex;align-items:center;gap:12px}
.dsh-splash-seg{position:relative;display:inline-grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:2px;padding:4px;border-radius:var(--dsw-radius-md,8px);background:var(--dsw-alias-bg-layer-2)}
.dsh-splash-seg-ind{position:absolute;top:4px;left:4px;width:calc((100% - 8px - 2px * (var(--n) - 1)) / var(--n));height:calc(100% - 8px);border-radius:var(--dsw-radius-sm,6px);background:var(--dsw-alias-bg-layer-1);box-shadow:0 1px 2px rgba(0,0,0,.18);transform:translateX(calc(var(--i) * (100% + 2px)));transition:transform .16s ease;pointer-events:none}
.dsh-splash-seg-tab{box-sizing:border-box;position:relative;z-index:1;height:28px;padding:0 12px;border:0;border-radius:var(--dsw-radius-sm,6px);background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:13px;line-height:20px;font-weight:500;white-space:nowrap;cursor:pointer;transition:color .12s ease}
.dsh-splash-seg-tab:hover:not(:disabled),.dsh-splash-seg-tab[aria-selected="true"]{color:var(--dsw-alias-label-primary)}
.dsh-splash-seg-tab:disabled{cursor:default;opacity:.4}
.dsh-splash-seg-tab:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.dsh-splash-switch{box-sizing:border-box;position:relative;flex:0 0 auto;width:36px;height:20px;padding:2px;border:0;border-radius:999px;background:var(--dsw-alias-border-l2);cursor:pointer}
.dsh-splash-switch[aria-checked="true"]{background:var(--dsw-alias-brand-primary)}
.dsh-splash-switch:disabled{cursor:default;opacity:.5}
.dsh-splash-switch:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.dsh-splash-thumb{display:block;width:16px;height:16px;border-radius:50%;background:var(--dsw-alias-label-primary-foreground,#fff);transition:transform .12s ease}
.dsh-splash-switch[aria-checked="true"] .dsh-splash-thumb{transform:translateX(16px)}
`

    /** 画廊页样式。 */
    const PAGE_CSS = `
.dsh-splash-page{display:flex;flex-direction:column;gap:16px;padding:4px 0 24px;color:var(--dsw-alias-label-primary)}
.dsh-splash-preview{position:relative;height:190px;border-radius:12px;overflow:hidden;border:.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);display:grid;place-items:center}
.dsh-splash-preview-label{position:absolute;right:10px;bottom:8px;font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary);pointer-events:none}
.dsh-splash-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:8px}
.dsh-splash-card{box-sizing:border-box;display:flex;flex-direction:column;gap:2px;padding:12px;border:.5px solid var(--dsw-alias-border-l2);border-radius:10px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;text-align:left;cursor:pointer;transition:border-color .12s ease,background .12s ease}
.dsh-splash-card:hover{border-color:var(--dsw-alias-brand-primary)}
.dsh-splash-card[aria-pressed="true"]{border-color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-layer-2)}
.dsh-splash-card:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.dsh-splash-card-name{font-size:13px;line-height:20px;font-weight:500}
.dsh-splash-card-tag{font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary)}
.dsh-splash-card[aria-pressed="true"] .dsh-splash-card-tag{color:var(--dsw-alias-brand-primary)}
.dsh-splash-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.dsh-splash-btn{box-sizing:border-box;height:30px;padding:0 12px;border:.5px solid var(--dsw-alias-border-l2);border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;cursor:pointer;transition:border-color .12s ease,background .12s ease}
.dsh-splash-btn:hover{border-color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-layer-2)}
.dsh-splash-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.dsh-splash-btn-primary{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}
.dsh-splash-hint{font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}
`

    /** 通用设置里的一行：开屏开关 + 速度档。 */
    function SplashSettings() {
      const [prefs, setPrefs] = React.useState(readPrefs)
      const update = (patch) => {
        const next = { ...prefs, ...patch }
        setPrefs(next)
        writePrefs(next)
      }
      const index = Math.max(0, SPEEDS.indexOf(prefs.speed))

      return h('div', { className: 'dsh-splash-row' }, [
        h('style', { key: 'css' }, ROW_CSS),
        h('div', { key: 'text', className: 'dsh-splash-row-text' }, [
          h('div', { key: 'title', className: 'dsh-splash-row-title' }, t('title')),
          h('div', { key: 'desc', className: 'dsh-splash-row-desc' }, t('desc')),
        ]),
        h('div', { key: 'control', className: 'dsh-splash-row-control' }, [
          h(
            'div',
            {
              key: 'seg',
              className: 'dsh-splash-seg',
              role: 'tablist',
              'aria-label': t('speed'),
              'aria-disabled': prefs.enabled ? undefined : 'true',
              style: { '--n': String(SPEEDS.length), '--i': String(index) },
            },
            [
              h('span', { key: 'ind', className: 'dsh-splash-seg-ind', 'aria-hidden': 'true' }),
              ...SPEEDS.map((speed) =>
                h(
                  'button',
                  {
                    key: speed,
                    type: 'button',
                    role: 'tab',
                    'aria-selected': prefs.speed === speed,
                    disabled: !prefs.enabled,
                    className: 'dsh-splash-seg-tab',
                    onClick: () => update({ speed }),
                  },
                  t(speed),
                ),
              ),
            ],
          ),
          h(
            'button',
            {
              key: 'switch',
              type: 'button',
              role: 'switch',
              'aria-checked': prefs.enabled,
              'aria-label': t('title'),
              className: 'dsh-splash-switch',
              onClick: () => update({ enabled: !prefs.enabled }),
            },
            h('span', { className: 'dsh-splash-thumb' }),
          ),
        ]),
      ])
    }

    /** 设置页：画廊 + 即时预览 + 全屏试播 + 手动刷新。 */
    function SplashPage() {
      const [prefs, setPrefs] = React.useState(readPrefs)
      const [nonce, setNonce] = React.useState(0)
      const [playing, setPlaying] = React.useState(false)
      const list = catalog()
      const scale = SCALE[prefs.speed] || 1

      const choose = (animation) => {
        const next = { ...prefs, animation }
        setPrefs(next)
        writePrefs(next)
        setNonce((value) => value + 1)
      }

      React.useEffect(() => {
        if (!playing) return undefined
        const timer = window.setTimeout(() => setPlaying(false), 1750 * scale + 500)
        return () => window.clearTimeout(timer)
      }, [playing, scale])

      const reload = () => {
        window.location.reload()
      }

      return h('div', { className: 'dsh-splash-page' }, [
        h('style', { key: 'css' }, PAGE_CSS),
        playing
          ? h(SplashStage, {
              key: `play-${nonce}`,
              animation: prefs.animation,
              scale,
              onDismiss: () => setPlaying(false),
            })
          : h(
              'div',
              { key: 'preview', className: 'dsh-splash-preview', onClick: () => setNonce((value) => value + 1) },
              [
                h(SplashStage, {
                  key: `preview-${prefs.animation}-${nonce}`,
                  animation: prefs.animation,
                  scale,
                  preview: true,
                }),
                h('span', { key: 'label', className: 'dsh-splash-preview-label' }, t('preview')),
              ],
            ),
        h(
          'div',
          { key: 'grid', className: 'dsh-splash-grid', role: 'group', 'aria-label': t('gallery') },
          list.map((item) =>
            h(
              'button',
              {
                key: item.id,
                type: 'button',
                className: 'dsh-splash-card',
                'aria-pressed': prefs.animation === item.id,
                onClick: () => choose(item.id),
              },
              [
                h('span', { key: 'name', className: 'dsh-splash-card-name' }, animationName(item)),
                h(
                  'span',
                  { key: 'tag', className: 'dsh-splash-card-tag' },
                  prefs.animation === item.id ? t('current') : '',
                ),
              ],
            ),
          ),
        ),
        h('div', { key: 'actions', className: 'dsh-splash-actions' }, [
          h(
            'button',
            {
              key: 'play',
              type: 'button',
              className: 'dsh-splash-btn dsh-splash-btn-primary',
              onClick: () => setPlaying(true),
            },
            t('play'),
          ),
          h('button', { key: 'reload', type: 'button', className: 'dsh-splash-btn', onClick: reload }, t('reload')),
          h('span', { key: 'hint', className: 'dsh-splash-hint' }, t('hint')),
        ]),
      ])
    }

    /** 退场传感器：不渲染任何 UI。 */
    function SplashReady() {
      React.useEffect(() => {
        const el = document.getElementById('dsh-splash')
        if (el) {
          try {
            const bg = getComputedStyle(document.documentElement)
              .getPropertyValue('--dsw-alias-bg-base')
              .trim()
            if (bg) el.style.setProperty('--dsh-splash-bg', bg)
          } catch (error) {
            /* 拿不到 token 就用 CSS 里的兜底色 */
          }
        }
        let second = 0
        const first = window.requestAnimationFrame(() => {
          second = window.requestAnimationFrame(() => {
            window.dispatchEvent(new Event('dsh-splash:ready'))
          })
        })
        return () => {
          window.cancelAnimationFrame(first)
          if (second) window.cancelAnimationFrame(second)
        }
      }, [])
      return null
    }

    return {
      // locale 必须写进 inject：和 dsh-notify-me、startup-animation 一样，
      // 只有声明过才能在 apply 里拿到 ctx.locale（未声明的服务读出来是 undefined，
      // 之前就是这里拿不到，才一直落回英文兜底）。
      inject: ['slots', 'locale'],
      apply(ctx) {
        // 整个 apply 都包在 try 里：任何一个槽位注册失败都只损失一项功能，
        // 绝不能让 web boot 判定「这个插件激活失败」而把整个应用拦在门外。
        try {
          // 字典一次性注册两种语言；注册失败（例如热重载时已存在）不影响下面的 bind。
          try {
            ctx.effect(() => ctx.locale.register('dsh-splash', { zh: DICT.zh, en: DICT.en }))
          } catch (error) {
            console.warn('[dsh-splash] locale register failed:', error)
          }
          try {
            const bound = ctx.locale.bind('dsh-splash')
            t = (key) => bound(key)
          } catch (error) {
            console.warn('[dsh-splash] locale bind failed:', error)
          }

          const slot = (name, id, order, component, extra) => {
            try {
              ctx.slots.inject(name, () => {
                try {
                  return ctx.slots.register({ name, id, order, ...(extra || {}) }, component)
                } catch (error) {
                  console.warn('[dsh-splash] register failed:', name, error)
                  return () => {}
                }
              })
            } catch (error) {
              console.warn('[dsh-splash] inject failed:', name, error)
            }
          }

          slot('shell.overlay', 'dsh-splash-ready', 1000, SplashReady)
          slot('settings.general.item', 'dsh-splash-setting', 13, SplashSettings)
          slot('settings.section', 'dsh-splash-gallery', 52, SplashPage, { label: () => t('section') })
        } catch (error) {
          console.warn('[dsh-splash] apply failed:', error)
        }
      },
    }
  },
})
