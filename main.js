(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var hasIO = 'IntersectionObserver' in window;

  /* ── Muted video loops ─────────────────────────────────────────
     Section loops load only when they get close to the viewport,
     play while visible and pause when off-screen. */

  function safePlay(video) {
    video.muted = true;
    var p = video.play();
    if (p && typeof p.catch === 'function') p.catch(function () {});
  }

  function load(video) {
    if (!video.getAttribute('src') && video.dataset.src) {
      video.src = video.dataset.src;
    }
  }

  var hero = document.querySelector('.hero-video');
  var loops = Array.prototype.slice.call(document.querySelectorAll('video.loop'));
  var videos = (hero ? [hero] : []).concat(loops);

  // Videos currently on screen. Only these should be playing.
  var onScreen = new Set();

  function shouldPlay(v) {
    return onScreen.has(v) && !document.hidden && !reduceMotion.matches;
  }

  function resumeVisible() {
    videos.forEach(function (v) {
      if (shouldPlay(v)) { load(v); if (v.paused) safePlay(v); }
    });
  }

  if (reduceMotion.matches && hero) {
    hero.removeAttribute('autoplay');
    hero.pause();
  }

  if (hasIO) {
    var preloader = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          load(entry.target);
          preloader.unobserve(entry.target);
        }
      });
    }, { rootMargin: '600px 0px' });

    var player = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) onScreen.add(v); else onScreen.delete(v);
        if (shouldPlay(v)) { load(v); safePlay(v); } else { v.pause(); }
      });
    }, { threshold: 0.1 });

    loops.forEach(function (v) { preloader.observe(v); });
    videos.forEach(function (v) { player.observe(v); });
  } else {
    videos.forEach(function (v) { onScreen.add(v); load(v); });
    resumeVisible();
  }

  // Pause everything while the tab is hidden; resume what is on screen when it comes back.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) videos.forEach(function (v) { v.pause(); });
    else resumeVisible();
  });
  window.addEventListener('pageshow', resumeVisible);
  window.addEventListener('focus', resumeVisible);

  // If the browser pauses a visible video on its own (power saving, background
  // tab policies), start it again.
  videos.forEach(function (v) {
    v.addEventListener('pause', function () {
      if (shouldPlay(v)) setTimeout(function () { if (shouldPlay(v) && v.paused) safePlay(v); }, 250);
    });
  });

  /* ── Reveal on scroll ─────────────────────────────────────────── */

  var reveals = document.querySelectorAll('.reveal');
  if (hasIO && !reduceMotion.matches) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    Array.prototype.forEach.call(reveals, function (el) { revealer.observe(el); });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-in'); });
  }

  /* ── Analytics events (GA4) ───────────────────────────────────
     page_view, scrolls and outbound links are tracked automatically
     by GA4 Enhanced Measurement. These add the actions that matter. */

  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (a.dataset.track) {
      track(a.dataset.track, { link_text: a.textContent.trim() });
    }
    if (href.indexOf('mailto:') === 0) {
      track('contact_email_click', { link_url: href.split('?')[0] });
    }
  });

  // Fires once when a visitor reaches the contact section.
  var contact = document.getElementById('contact');
  if (contact && hasIO) {
    var seen = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        track('view_contact_section');
        seen.disconnect();
      }
    }, { threshold: 0.4 });
    seen.observe(contact);
  }
})();
