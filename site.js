(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Count-up for headline figures */
  function countUp(el) {
    var to = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0), pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    var start = null;
    function step(t) {
      if (!start) start = t;
      var p = Math.min(1, (t - start) / 1600), e = 1 - Math.pow(1 - p, 4);
      el.textContent = pre + (to * e).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Reveal sections as they arrive (only ones below the fold at load) */
  if (!reduce && 'IntersectionObserver' in window) {
    var vh = window.innerHeight;
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target; io.unobserve(el);
        el.classList.add('in');
        el.querySelectorAll('.count').forEach(countUp);
      });
    }, { rootMargin: '0px 0px 12% 0px' });
    document.querySelectorAll('.rv').forEach(function (el) {
      if (el.getBoundingClientRect().top > vh) io.observe(el);
    });
  }

  /* Copy buttons */
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var label = b.textContent;
      function done(m) { b.textContent = m; setTimeout(function () { b.textContent = label; }, 1600); }
      try { navigator.clipboard.writeText(b.dataset.copy).then(function () { done('Copied'); }, function () { done('Select to copy'); }); }
      catch (e) { done('Select to copy'); }
    });
  });

  /* Experience trace */
  var trace = document.getElementById('trace');
  if (trace) {
    var fill = document.getElementById('trace-fill'), reads = trace.querySelectorAll('.reading');
    var onScroll = function () {
      var r = trace.getBoundingClientRect(), mid = window.innerHeight * 0.6;
      var p = Math.max(0, Math.min(1, (mid - r.top) / r.height));
      fill.style.transform = 'scaleY(' + p.toFixed(4) + ')';
      reads.forEach(function (el) { el.classList.toggle('lit', el.getBoundingClientRect().top + 14 < mid); });
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* Case study dialog */
  var dlg = document.getElementById('case');
  if (dlg) {
    var body = document.getElementById('case-body');
    document.querySelectorAll('[data-case]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        body.innerHTML = btn.parentElement.querySelector('.case-detail').innerHTML;
        dlg.setAttribute('aria-label', body.querySelector('h3').textContent);
        document.body.classList.add('locked');
        dlg.showModal(); dlg.scrollTop = 0;
      });
    });
    document.getElementById('case-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () { document.body.classList.remove('locked'); });
  }
})();
