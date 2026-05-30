/* ============================================================
   H&T HAIR LOUNGE — interactions
   ============================================================ */
(function () {
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');

  // --- header scrolled state ---
  let lastY = -1;
  function onScroll(){
    const y = window.scrollY;
    if (y !== lastY){
      header.classList.toggle('scrolled', y > 40);
      lastY = y;
    }
    // hero parallax
    const px = document.querySelector('[data-parallax]');
    if (px && y < window.innerHeight){
      px.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
    }
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  // --- mobile menu ---
  function toggleMenu(open){
    const willOpen = open ?? !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', willOpen);
    burger.setAttribute('aria-expanded', String(willOpen));
    document.body.style.overflow = willOpen ? 'hidden' : '';
  }
  burger?.addEventListener('click', ()=>toggleMenu());
  menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));

  // --- smooth scroll for in-page anchors (with header offset) ---
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior:'smooth' });
    });
  });

  // --- reveal on scroll (with robust fallbacks) ---
  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
  const show = el => el.classList.add('in');

  // Fallback 1: reveal anything currently within (or near) the viewport.
  function revealInView(){
    const vh = window.innerHeight || document.documentElement.clientHeight;
    revealEls.forEach(el=>{
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) show(el);
    });
  }

  let ioFired = false;
  try {
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if (en.isIntersecting){ ioFired = true; show(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(el=>io.observe(el));
  } catch(e){ /* no IO support */ }

  // Run the rect-based check on load + scroll/resize so reveals work even if IO is unreliable.
  // Defer the initial pass through a real timer so the base opacity:0 frame paints first;
  // rAF alone runs before paint here and strands the above-the-fold transition at 0.
  setTimeout(revealInView, 80);
  window.addEventListener('scroll', revealInView, { passive:true });
  window.addEventListener('resize', revealInView, { passive:true });
  window.addEventListener('load', revealInView);

  // Fallback 2: if IO never fires (throttled/preview compositor where CSS
  // animations/transitions may not advance), force every element fully visible
  // via inline styles that don't depend on the animation clock.
  setTimeout(()=>{
    if (ioFired) return;
    revealEls.forEach(el=>{
      el.style.animation = 'none';
      el.style.transition = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }, 1000);

  // --- duplicate marquee track if needed for seamless loop (already doubled in HTML) ---
})();
