
      (function() {
        // 获取 Live2D 舞台容器（根据实际情况调整选择器）
        function getLive2dContainer() {
          // 方法1：通过 om2d 实例获取（最稳健）
          if (window.oml2d?.stage?.canvas) {
            return window.oml2d.stage.canvas.parentElement.parentElement;
          }
          // 方法2：通过已知类名（适用于默认配置）
          return document.querySelector('.live2d-stage, [class*="live2d"] canvas')?.parentElement?.parentElement;
        }

        // 切换显示/隐藏
        function toggleLive2d() {
          const container = getLive2dContainer();
          if (!container) return;
          const isHidden = container.style.display === 'none';
          container.style.display = isHidden ? 'block' : 'none';
          // 同时更新按钮图标和标题
          const btn = document.getElementById('live2d-toggle');
          if (btn) {
            btn.innerHTML = isHidden ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
            btn.title = isHidden ? '隐藏模型' : '显示模型';
          }
        }

        // 向 rightside 添加按钮
        function addLive2dButtons() {
          const rightside = document.getElementById('rightside');
          if (!rightside || document.getElementById('live2d-toggle')) return;

          // 显示/隐藏切换按钮
          const toggleBtn = document.createElement('div');
          toggleBtn.id = 'live2d-toggle';
          toggleBtn.className = 'rightside-item';
          toggleBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
          toggleBtn.title = '隐藏模型';
          toggleBtn.addEventListener('click', toggleLive2d);

          // 其他可选按钮（切换模型、说话、拖拽等）可在此继续添加
          // ...

          // 插入到 rightside 顶部（或任意位置）
          rightside.prepend(toggleBtn);
        }

        // 初始化
        addLive2dButtons();
        window.addEventListener('pjax:complete', addLive2dButtons);
      })();
