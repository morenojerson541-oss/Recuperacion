// ===============================
// QUIZ.JS - Mini práctica de 5 preguntas
// ===============================

const quizData = [
  {
    question: "¿Para qué se utiliza principalmente Arduino en el contexto de una cooperativa?",
    options: [
      "Para crear páginas web",
      "Para automatizar procesos físicos con sensores y controladores",
      "Para vender productos por internet",
      "Para hacer aplicaciones de celular"
    ],
    correct: 1,
    feedback: "Arduino automatiza procesos físicos mediante sensores (temperatura, humedad, movimiento) y controladores."
  },
  {
    question: "¿Qué tipo de aplicaciones se crean con Windows Forms?",
    options: [
      "Aplicaciones móviles",
      "Tiendas en línea",
      "Aplicaciones de escritorio para gestionar información",
      "Sistemas de sensores"
    ],
    correct: 2,
    feedback: "Windows Forms sirve para crear aplicaciones de escritorio que gestionan la información interna de la cooperativa."
  },
  {
    question: "¿Cuál es la principal ventaja de .NET MAUI?",
    options: [
      "Solo funciona en Windows",
      "Permite crear aplicaciones que funcionan en Android, iOS y Windows con un solo código",
      "Es una tienda en línea",
      "Solo sirve para electrónica"
    ],
    correct: 1,
    feedback: "La gran ventaja de .NET MAUI es escribir un solo código y ejecutarlo en Android, iOS y Windows."
  },
  {
    question: "¿Qué plataforma se usa en el módulo para crear una tienda en línea profesional?",
    options: [
      "Arduino",
      "Windows Forms",
      "PrestaShop",
      ".NET MAUI"
    ],
    correct: 2,
    feedback: "PrestaShop es la plataforma para crear y administrar una tienda en línea profesional."
  },
  {
    question: "¿Cuál es el objetivo principal de combinar estas tecnologías en el Módulo 4?",
    options: [
      "Solo aprender programación",
      "Poner en marcha y operar una cooperativa de forma moderna usando tecnología",
      "Crear videojuegos",
      "Diseñar páginas web estáticas"
    ],
    correct: 1,
    feedback: "El objetivo es integrar las herramientas para poner en marcha y operar una cooperativa de forma moderna."
  }
];

let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let answered = false;

const quizContent = document.getElementById('quiz-content');
const LETTERS = ['A', 'B', 'C', 'D'];

function loadQuestion() {
  if (!quizContent) return;

  if (currentQuestion >= quizData.length) {
    showResults();
    return;
  }

  answered = false;
  selectedOption = null;
  const q = quizData[currentQuestion];
  const progress = (currentQuestion / quizData.length) * 100;

  let html = `
    <div class="quiz-progress"><div class="quiz-progress-bar" style="width:${progress}%"></div></div>
    <div class="d-flex justify-content-between align-items-center">
      <span class="quiz-step">Pregunta ${currentQuestion + 1} de ${quizData.length}</span>
      <span class="quiz-step" style="color:var(--amber)">Puntaje: ${score}</span>
    </div>
    <p class="quiz-question-text">${q.question}</p>
    <div class="quiz-options">
  `;

  q.options.forEach((option, index) => {
    html += `
      <button class="quiz-option" data-index="${index}">
        <span class="quiz-letter">${LETTERS[index]}</span>
        <span>${option}</span>
      </button>
    `;
  });

  html += `
    </div>
    <div id="quiz-feedback-slot"></div>
    <button id="next-btn" class="btn btn-primary mt-3 px-4" disabled>
      ${currentQuestion === quizData.length - 1 ? 'Ver resultado' : 'Siguiente'}
      <i class="bi bi-arrow-right ms-2"></i>
    </button>
  `;

  quizContent.innerHTML = html;

  // Eventos de las opciones
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', function () {
      if (answered) return;

      document.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      selectedOption = parseInt(this.getAttribute('data-index'), 10);
      document.getElementById('next-btn').disabled = false;
    });
  });

  // Botón siguiente
  document.getElementById('next-btn').addEventListener('click', () => {
    if (selectedOption === null) return;

    const esCorrecta = selectedOption === quizData[currentQuestion].correct;

    if (!answered) {
      // Primera pulsación: muestra el resultado de esta pregunta
      answered = true;
      const options = document.querySelectorAll('.quiz-option');
      options.forEach((opt, i) => {
        opt.classList.remove('selected');
        if (i === quizData[currentQuestion].correct) opt.classList.add('correct');
        if (i === selectedOption && !esCorrecta) opt.classList.add('incorrect');
      });

      if (esCorrecta) score++;

      const slot = document.getElementById('quiz-feedback-slot');
      slot.innerHTML = `
        <div class="quiz-feedback ${esCorrecta ? 'ok' : 'no'}">
          <i class="bi ${esCorrecta ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i>
          <div>
            <strong>${esCorrecta ? '¡Correcto!' : 'Respuesta incorrecta'}</strong><br>
            ${quizData[currentQuestion].feedback}
          </div>
        </div>
      `;

      // Actualiza el contador de puntaje en vivo
      const stepEls = document.querySelectorAll('.quiz-step');
      if (stepEls[1]) stepEls[1].textContent = 'Puntaje: ' + score;

      // Cambia el texto del botón para avanzar
      const btn = document.getElementById('next-btn');
      btn.innerHTML = (currentQuestion === quizData.length - 1)
        ? 'Ver resultado <i class="bi bi-trophy ms-2"></i>'
        : 'Siguiente <i class="bi bi-arrow-right ms-2"></i>';
    } else {
      // Segunda pulsación: avanza a la siguiente pregunta
      currentQuestion++;
      loadQuestion();
    }
  });
}

function showResults() {
  const total = quizData.length;
  const percentage = Math.round((score / total) * 100);
  let message = '';
  let emoji = '';

  if (percentage === 100) {
    message = '¡Excelente! Dominas los conceptos introductorios del módulo.';
    emoji = 'bi-trophy-fill';
  } else if (percentage >= 60) {
    message = 'Bien hecho. Tienes una buena base de los temas del módulo.';
    emoji = 'bi-hand-thumbs-up-fill';
  } else {
    message = 'Sigue repasando las secciones. ¡Tú puedes mejorar!';
    emoji = 'bi-arrow-repeat';
  }

  // Anillo de progreso (circunferencia = 2πr, con r = 70 → ~440)
  const circumference = 440;
  const offset = circumference - (percentage / 100) * circumference;

  quizContent.innerHTML = `
    <div class="quiz-result">
      <div class="score-ring">
        <svg width="158" height="158" viewBox="0 0 158 158">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2f7d5d"/>
              <stop offset="100%" stop-color="#e0a423"/>
            </linearGradient>
          </defs>
          <circle class="ring-bg" cx="79" cy="79" r="70"></circle>
          <circle class="ring-fg" cx="79" cy="79" r="70" data-offset="${offset}"></circle>
        </svg>
        <div class="score-value">${percentage}%</div>
      </div>
      <h4 class="result-title"><i class="bi ${emoji} me-2" style="color:var(--amber)"></i>${score} de ${total} correctas</h4>
      <p class="result-msg">${message}</p>
      <button id="restart-quiz" class="btn btn-primary px-4">
        <i class="bi bi-arrow-clockwise me-2"></i>Reintentar Quiz
      </button>
    </div>
  `;

  // Anima el anillo después de insertarlo
  const ring = document.querySelector('.ring-fg');
  if (ring) {
    requestAnimationFrame(() => {
      setTimeout(() => { ring.style.strokeDashoffset = ring.dataset.offset; }, 120);
    });
  }

  document.getElementById('restart-quiz').addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    loadQuestion();
  });
}

// Iniciar el quiz cuando carga la página
document.addEventListener('DOMContentLoaded', loadQuestion);
