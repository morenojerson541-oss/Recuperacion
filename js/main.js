// ===============================
// MAIN.JS - Funciones generales
// ===============================

document.addEventListener('DOMContentLoaded', () => {

  // Smooth scroll para los enlaces del menú
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Control del chat (abrir / cerrar)
  const chatToggle = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const chatClose = document.getElementById('chat-close');

  if (chatToggle && chatWindow && chatClose) {
    chatToggle.addEventListener('click', () => {
      chatWindow.classList.toggle('active');
    });

    chatClose.addEventListener('click', () => {
      chatWindow.classList.remove('active');
    });
  }

});
