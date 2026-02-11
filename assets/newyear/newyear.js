(function () {
  function pad2(n) { return String(n).padStart(2, '0'); }

  function getNextNewYear() {
    const now = new Date();
    const y = now.getFullYear();
    const targetThisYear = new Date(y, 0, 1, 0, 0, 0); // Jan 1
    // 如果已经过了今年元旦，就倒计时到明年元旦
    return now >= targetThisYear ? new Date(y + 1, 0, 1, 0, 0, 0) : targetThisYear;
  }

  let timer = null;

  function render() {
    const dEl = document.getElementById('nycd-d');
    const hEl = document.getElementById('nycd-h');
    const mEl = document.getElementById('nycd-m');
    const sEl = document.getElementById('nycd-s');
    const yEl = document.getElementById('nycd-year');
    const tipEl = document.getElementById('nycd-tip');

    // 不在当前页面（例如某些页面没侧边栏）就不跑
    if (!dEl || !hEl || !mEl || !sEl || !yEl) return;

    const target = getNextNewYear();
    yEl.textContent = target.getFullYear() + ' 年';

    const now = new Date();
    let diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      dEl.textContent = '00';
      hEl.textContent = '00';
      mEl.textContent = '00';
      sEl.textContent = '00';
      if (tipEl) tipEl.textContent = '新年快乐！🎉';
      return;
    }

    const sec = Math.floor(diff / 1000);
    const days = Math.floor(sec / 86400);
    const hours = Math.floor((sec % 86400) / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;

    dEl.textContent = String(days);
    hEl.textContent = pad2(hours);
    mEl.textContent = pad2(mins);
    sEl.textContent = pad2(secs);

    if (tipEl) tipEl.textContent = '愿你新的一年顺顺利利～';
  }

  function start() {
    // 防止 PJAX 多次绑定导致多个定时器
    if (timer) clearInterval(timer);
    render();
    timer = setInterval(render, 1000);
  }

  // 首次加载
  document.addEventListener('DOMContentLoaded', start);

  // 兼容 Butterfly 的 PJAX 场景：切页后重新启动
  document.addEventListener('pjax:complete', start);
  document.addEventListener('pjax:success', start);
})();
