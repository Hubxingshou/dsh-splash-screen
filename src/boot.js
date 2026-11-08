/**
 * 注入到 index 里的启动脚本（纯字符串，浏览器直接执行）。
 *
 * 职责：
 * 0. 偏好：读 localStorage 的 `dsh-splash:prefs:v1`（设置页写入）——关掉就不显示；
 *    快/慢档按比例缩放所有时长（注入的 CSS 用 --dsh-splash-scale 计算）；
 *    选了哪个动画就写 `data-anim`，CSS 里每个动画只对自己的 data-anim 生效。
 * 1. 把动画目录挂到 window.__DSH_SPLASH_CATALOG__，设置页直接读它，避免两处维护同一份 id。
 * 2. 节流：同一标签页 quietSeconds 内重新加载不再重播（sessionStorage 只记时间戳）。
 * 3. 对齐底色：读宿主 `--dsw-alias-bg-base` 的计算值写到本层自己的变量上（只读宿主 token）。
 * 4. 退场：收到 `dsh-splash:ready`（或到达 maxMs）后淡出并移除节点与监听。
 * 5. 跳过：点击/按键立即退场，且期间拦住 pointerdown/click，避免点到看不见的界面。
 */
export function bootScript(catalog, defaultAnimation) {
  return `(function () {
  var el = document.getElementById('dsh-splash');
  var CATALOG = ${catalog};
  var DEFAULT_ANIM = ${JSON.stringify(defaultAnimation)};
  try { window.__DSH_SPLASH_CATALOG__ = CATALOG; } catch (error) {}
  if (!el) return;
  var KEY = 'dsh-splash:last';
  var PREFS_KEY = 'dsh-splash:prefs:v1';
  var scale = 1;

  function choose(id) {
    for (var i = 0; i < CATALOG.length; i += 1) {
      if (CATALOG[i] && CATALOG[i].id === id) return id;
    }
    return '';
  }

  try {
    var raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      var prefs = JSON.parse(raw);
      if (prefs && prefs.enabled === false) { el.remove(); return; }
      if (prefs && prefs.speed === 'fast') scale = 0.75;
      else if (prefs && prefs.speed === 'slow') scale = 1.35;
      if (prefs && typeof prefs.animation === 'string') {
        var picked = choose(prefs.animation);
        if (picked) el.setAttribute('data-anim', picked);
      }
    }
  } catch (error) {}
  if (!el.getAttribute('data-anim')) el.setAttribute('data-anim', DEFAULT_ANIM);
  if (scale !== 1) el.style.setProperty('--dsh-splash-scale', String(scale));

  function syncBg() {
    try {
      var bg = getComputedStyle(document.documentElement).getPropertyValue('--dsw-alias-bg-base').trim();
      if (bg) el.style.setProperty('--dsh-splash-bg', bg);
    } catch (error) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncBg, { once: true });
  else syncBg();

  var quiet = (Number(el.getAttribute('data-quiet')) || 0) * 1000;
  if (quiet > 0) {
    try {
      var last = Number(sessionStorage.getItem(KEY) || 0);
      var stamp = Date.now();
      if (last && stamp - last < quiet) { el.remove(); return; }
      sessionStorage.setItem(KEY, String(stamp));
    } catch (error) {}
  }

  var holdMs = Math.max(0, Number(el.getAttribute('data-hold')) || 0) * scale;
  var maxMs = Math.max(holdMs + 200, (Number(el.getAttribute('data-max')) || 0) * scale);
  var started = (window.performance && window.performance.now) ? window.performance.now() : Date.now();
  var elapsedNow = function () {
    return ((window.performance && window.performance.now) ? window.performance.now() : Date.now()) - started;
  };
  var finished = false;

  function removeNow() {
    if (el.parentNode) el.parentNode.removeChild(el);
  }

  function finish() {
    if (finished) return;
    finished = true;
    window.removeEventListener('dsh-splash:ready', onReady);
    window.removeEventListener('keydown', onSkip, true);
    window.removeEventListener('pointerdown', onSkip, true);
    window.removeEventListener('click', onSkip, true);
    el.addEventListener('transitionend', function (event) {
      if (event.target === el && event.propertyName === 'opacity') removeNow();
    });
    el.setAttribute('data-done', '');
    el.style.pointerEvents = 'none';
    window.setTimeout(removeNow, 700 * scale);
  }

  function onReady() {
    var elapsed = elapsedNow();
    if (elapsed >= holdMs) finish();
    else window.setTimeout(finish, holdMs - elapsed);
  }

  function onSkip(event) {
    if (event.type === 'pointerdown') {
      event.preventDefault();
      event.stopPropagation();
    } else if (event.type === 'click') {
      event.stopPropagation();
    }
    onReady();
  }

  window.addEventListener('dsh-splash:ready', onReady);
  window.addEventListener('keydown', onSkip, true);
  window.addEventListener('pointerdown', onSkip, true);
  window.addEventListener('click', onSkip, true);
  window.setTimeout(onReady, maxMs);
})();`
}
