// Figure lightbox — click any figure to expand, pinch/scroll to zoom, drag to pan.
(function () {
  var CONTAINERS = '.fig, .teaser, .tablewrap';

  function build() {
    var ov = document.createElement('div');
    ov.className = 'lb';
    ov.innerHTML =
      '<div class="lb-bar">' +
        '<span class="lb-cap"></span>' +
        '<span class="lb-tools">' +
          '<button class="lb-btn" data-z="out" aria-label="Zoom out">&minus;</button>' +
          '<button class="lb-btn" data-z="in" aria-label="Zoom in">+</button>' +
          '<button class="lb-btn" data-z="reset" aria-label="Reset zoom">Reset</button>' +
          '<button class="lb-btn lb-close" aria-label="Close">Close</button>' +
        '</span>' +
      '</div>' +
      '<div class="lb-stage"><div class="lb-inner"></div></div>';
    document.body.appendChild(ov);
    return ov;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var figs = [].slice.call(document.querySelectorAll(CONTAINERS)).filter(function (f) {
      return f.querySelector('svg') || f.querySelector('table');
    });
    if (!figs.length) return;

    var ov = build();
    var stage = ov.querySelector('.lb-stage');
    var inner = ov.querySelector('.lb-inner');
    var cap = ov.querySelector('.lb-cap');
    var scale = 1, tx = 0, ty = 0;

    function apply() { inner.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')'; }
    function reset() { scale = 1; tx = 0; ty = 0; apply(); }
    function zoom(f, cx, cy) {
      var next = Math.min(6, Math.max(0.5, scale * f));
      if (cx !== undefined) {
        var r = stage.getBoundingClientRect();
        var ox = cx - r.left - r.width / 2 - tx;
        var oy = cy - r.top - r.height / 2 - ty;
        tx -= ox * (next / scale - 1);
        ty -= oy * (next / scale - 1);
      }
      scale = next; apply();
    }

    function open(fig) {
      var src = fig.querySelector('svg') || fig.querySelector('table');
      inner.innerHTML = '';
      var clone = src.cloneNode(true);
      if (clone.tagName.toLowerCase() === 'svg') {
        clone.removeAttribute('width'); clone.removeAttribute('height');
        clone.style.width = '100%'; clone.style.height = 'auto';
      }
      inner.appendChild(clone);
      var c = fig.querySelector('figcaption') || fig.querySelector('.tablehead');
      cap.textContent = c ? c.textContent.trim() : '';
      reset();
      ov.classList.add('on');
      document.body.style.overflow = 'hidden';
    }
    function close() { ov.classList.remove('on'); document.body.style.overflow = ''; }

    figs.forEach(function (f) {
      f.classList.add('zoomable');
      var hint = document.createElement('span');
      hint.className = 'zoom-hint';
      hint.textContent = 'Expand';
      f.appendChild(hint);
      f.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        open(f);
      });
    });

    ov.addEventListener('click', function (e) {
      var z = e.target.getAttribute && e.target.getAttribute('data-z');
      if (z === 'in') return zoom(1.35);
      if (z === 'out') return zoom(1 / 1.35);
      if (z === 'reset') return reset();
      if (e.target.closest('.lb-close') || e.target === stage || e.target === ov) close();
    });
    document.addEventListener('keydown', function (e) {
      if (!ov.classList.contains('on')) return;
      if (e.key === 'Escape') close();
      if (e.key === '+' || e.key === '=') zoom(1.35);
      if (e.key === '-') zoom(1 / 1.35);
      if (e.key === '0') reset();
    });

    stage.addEventListener('wheel', function (e) {
      if (!ov.classList.contains('on')) return;
      e.preventDefault();
      zoom(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY);
    }, { passive: false });

    // drag to pan
    var dragging = false, sx = 0, sy = 0;
    stage.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.lb-btn')) return;
      dragging = true; sx = e.clientX - tx; sy = e.clientY - ty;
      stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      tx = e.clientX - sx; ty = e.clientY - sy; apply();
    });
    stage.addEventListener('pointerup', function () { dragging = false; });
    stage.addEventListener('pointercancel', function () { dragging = false; });

    // pinch
    var pts = {}, startDist = 0, startScale = 1;
    stage.addEventListener('touchstart', function (e) {
      if (e.touches.length === 2) {
        dragging = false;
        startDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX,
                               e.touches[0].clientY - e.touches[1].clientY);
        startScale = scale;
      }
    }, { passive: true });
    stage.addEventListener('touchmove', function (e) {
      if (e.touches.length === 2 && startDist) {
        e.preventDefault();
        var d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX,
                           e.touches[0].clientY - e.touches[1].clientY);
        scale = Math.min(6, Math.max(0.5, startScale * (d / startDist)));
        apply();
      }
    }, { passive: false });
    stage.addEventListener('touchend', function (e) { if (e.touches.length < 2) startDist = 0; });
  });
})();
