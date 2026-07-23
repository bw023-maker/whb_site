// Theme toggle — respects saved preference, then system preference.
(function () {
  var KEY = 'whb-theme';
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}

  var initial = saved
    || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', initial);

  function label(t) { return t === 'dark' ? 'Light' : 'Dark'; }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    btn.textContent = label(document.documentElement.getAttribute('data-theme'));
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      btn.textContent = label(next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
    });
  });
})();
