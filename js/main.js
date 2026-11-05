// ===============================
// MAIN.JS - Funciones generales e interacciones de la página
// ===============================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Scroll suave para los enlaces del menú ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('mainNav').offsetHeight;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
        window.scrollTo({ top, behavior: 'smooth' });

        // Cierra el menú móvil si está abierto
        const navCollapse = document.getElementById('navbarNav');
        if (navCollapse && navCollapse.classList.contains('show')) {
          new bootstrap.Collapse(navCollapse).hide();
        }
      }
    });
  });

  /* ---------- Navbar: cambio al hacer scroll ---------- */
  const mainNav = document.getElementById('mainNav');
  const backToTop = document.getElementById('back-to-top');
  const progressBar = document.getElementById('scroll-progress');

  function onScroll() {
    const y = window.pageYOffset;

    if (mainNav) mainNav.classList.toggle('scrolled', y > 40);
    if (backToTop) backToTop.classList.toggle('show', y > 500);

    // Barra de progreso de lectura
    if (progressBar) {
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const percent = height > 0 ? (y / height) * 100 : 0;
      progressBar.style.width = percent + '%';
    }

    // Enlace activo según la sección visible
    highlightNav(y);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Resaltar la sección activa en el menú ---------- */
  const sections = Array.from(document.querySelectorAll('section[id], header[id]'));
  const navLinks = Array.from(document.querySelectorAll('.navbar-nav .nav-link'));
  let ticking = false;

  function highlightNav(y) {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      let current = '';
      const offset = 120;
      sections.forEach(sec => {
        if (y >= sec.offsetTop - offset) current = sec.getAttribute('id');
      });
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === '#' + current);
      });
      ticking = false;
    });
  }

  /* ---------- Volver arriba ---------- */
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Animaciones al aparecer (scroll reveal) ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Pequeño retardo escalonado para las tarjetas vecinas
          const delay = (entry.target.dataset.delay || i * 60);
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Respaldo si el navegador es antiguo
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Control del chat (abrir / cerrar) ---------- */
  const chatToggle = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const chatClose = document.getElementById('chat-close');
  const chatInput = document.getElementById('chat-input');

  if (chatToggle && chatWindow) {
    chatToggle.addEventListener('click', () => {
      chatWindow.classList.toggle('active');
      if (chatWindow.classList.contains('active') && chatInput) chatInput.focus();
    });
  }

  if (chatClose && chatWindow) {
    chatClose.addEventListener('click', () => chatWindow.classList.remove('active'));
  }

  /* ---------- Chips de preguntas rápidas ---------- */
  document.querySelectorAll('.quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-q');
      if (!q || !chatInput) return;
      chatInput.value = q;
      chatInput.focus();
      // Dispara el envío si el chat ya está listo
      const sendBtn = document.getElementById('chat-send');
      if (sendBtn) sendBtn.click();
    });
  });

  /* ---------- Contador de caracteres del ejercicio ---------- */
  const ejercicioTexto = document.getElementById('ejercicio-texto');
  const charCount = document.getElementById('char-count');
  if (ejercicioTexto && charCount) {
    ejercicioTexto.addEventListener('input', () => {
      charCount.textContent = ejercicioTexto.value.length;
    });
  }

  /* ---------- Año dinámico en el footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Ejecuta una vez al cargar
  onScroll();

});
