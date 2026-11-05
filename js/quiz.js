// ===============================
// QUIZ.JS - Mini práctica de 5 preguntas
// ===============================

const quizData = [
  {
    question: "1. ¿Para qué se utiliza principalmente Arduino en el contexto de una cooperativa?",
    options: [
      "Para crear páginas web",
      "Para automatizar procesos físicos con sensores y controladores",
      "Para vender productos por internet",
      "Para hacer aplicaciones de celular"
    ],
    correct: 1
  },
  {
    question: "2. ¿Qué tipo de aplicaciones se crean con Windows Forms?",
    options: [
      "Aplicaciones móviles",
      "Tiendas en línea",
      "Aplicaciones de escritorio para gestionar información",
      "Sistemas de sensores"
    ],
    correct: 2
  },
  {
    question: "3. ¿Cuál es la principal ventaja de .NET MAUI?",
    options: [
      "Solo funciona en Windows",
      "Permite crear aplicaciones que funcionan en Android, iOS y Windows con un solo código",
      "Es una tienda en línea",
      "Solo sirve para electrónica"
    ],
    correct: 1
  },
  {
    question: "4. ¿Qué plataforma se usa en el módulo para crear una tienda en línea profesional?",
    options: [
      "Arduino",
      "Windows Forms",
      "PrestaShop",
      ".NET MAUI"
    ],
    correct: 2
  },
  {
    question: "5. ¿Cuál es el objetivo principal de combinar estas tecnologías en el Módulo 4?",
    options: [
      "Solo aprender programación",
      "Poner en marcha y operar una cooperativa de forma moderna usando tecnología",
      "Crear videojuegos",
      "Diseñar páginas web estáticas"
    ],
    correct: 1
  }
];

let currentQuestion = 0;
let score = 0;
let selectedOption = null;

const quizContent = document.getElementById('quiz-content');

function loadQuestion() {
  if (!quizContent) return;

  if (currentQuestion >= quizData.length) {
    showResults();
    return;
  }

  const q = quizData[currentQuestion];

  let html = `
    <h5 class="mb-3">${q.question}</h5>
    <div class="quiz-options">
  `;

  q.options.forEach((option, index) => {
    html += `
      <button class="quiz-option" data-index="${index}">
        ${option}
      </button>
    `;
  });

  html += `
    </div>
    <button id="next-btn" class="btn btn-primary mt-3" disabled>Siguiente</button>
  `;

  quizContent.innerHTML = html;

  // Eventos de las opciones
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      selectedOption = parseInt(this.getAttribute('data-index'));
      document.getElementById('next-btn').disabled = false;
    });
  });

  // Botón siguiente
  document.getElementById('next-btn').addEventListener('click', () => {
    if (selectedOption === quizData[currentQuestion].correct) {
      score++;
    }
    currentQuestion++;
    selectedOption = null;
    loadQuestion();
  });
}

function showResults() {
  const percentage = (score / quizData.length) * 100;
  let message = '';

  if (percentage === 100) {
    message = '¡Excelente! Dominas los conceptos introductorios del módulo.';
  } else if (percentage >= 60) {
    message = 'Bien hecho. Tienes una buena base de los temas del módulo.';
  } else {
    message = 'Sigue repasando las secciones. ¡Tú puedes mejorar!';
  }

  quizContent.innerHTML = `
    <div class="text-center">
      <h4 class="mb-3">Resultado del Quiz</h4>
      <p class="fs-4 fw-bold text-primary">${score} de ${quizData.length} correctas</p>
      <p class="mb-4">${message}</p>
      <button id="restart-quiz" class="btn btn-outline-primary">Reintentar Quiz</button>
    </div>
  `;

  document.getElementById('restart-quiz').addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    loadQuestion();
  });
}

// Iniciar el quiz cuando carga la página
document.addEventListener('DOMContentLoaded', loadQuestion);
