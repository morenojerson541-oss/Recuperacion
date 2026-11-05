// ===============================
// TUTOR.JS - Chat con IA (Groq)
// ===============================

// ⚠️ IMPORTANTE: Reemplaza el valor de abajo con tu propia API Key gratuita de Groq
// Consíguela en: https://console.groq.com
const GROQ_API_KEY = "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";

const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const ejercicioTexto = document.getElementById('ejercicio-texto');
const btnEjercicio = document.getElementById('btn-ejercicio');
const ejercicioRespuesta = document.getElementById('ejercicio-respuesta');

// Prompt del sistema (el tutor conoce todo el contenido de la página)
const SYSTEM_PROMPT = `
Eres un tutor amable y claro del Módulo 4: "Puesta en marcha de la empresa en asociatividad cooperativa" del profesor Francisco Arcides Canales.

Tu conocimiento se basa EXCLUSIVAMENTE en el contenido de esta página web. Los temas que manejas son:

1. Introducción a la asociatividad cooperativa y puesta en marcha de empresas cooperativas.
2. Arduino (Proyecto Agustine-Arduino): se usa para automatizar procesos físicos con sensores (temperatura, humedad, movimiento), riego, seguridad e inventarios en una cooperativa.
3. Windows Forms + ASPX: aplicaciones de escritorio (WinForms) y páginas web (ASPX) para gestionar socios, aportes, ventas e inventarios de la cooperativa.
4. .NET MAUI: permite crear aplicaciones que funcionan en Android, iOS y Windows con un solo código, para que los asociados consulten información y hagan pedidos desde el celular.
5. PrestaShop: plataforma para crear una tienda en línea profesional donde la cooperativa vende sus productos (café, productos agrícolas, artesanías, etc.).
6. Integración: cómo todas estas herramientas juntas ayudan a poner en marcha y operar una cooperativa de forma moderna.

Reglas importantes:
- Responde siempre en español, de forma clara y sencilla (nivel introductorio).
- Si te piden un resumen, da un resumen breve y ordenado.
- Si la pregunta NO está relacionada con estos temas, responde amablemente: "Esa pregunta está fuera del contenido de esta página. ¿Quieres que te resuma alguna sección o te explique cómo se usa alguna de las tecnologías en la cooperativa?"
- Nunca inventes información que no esté en los temas de arriba.
- Sé motivador y profesional.
`;

// Función para agregar mensajes al chat
function addMessage(text, isUser = false) {
  const div = document.createElement('div');
  div.className = `message ${isUser ? 'user' : 'bot'}`;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Función principal para llamar a la IA
async function askTutor(userMessage) {
  if (!GROQ_API_KEY || GROQ_API_KEY === "PEGA_AQUI_TU_API_KEY_DE_GROQ") {
    return "⚠️ Falta configurar la API Key de Groq. Ve al archivo js/tutor.js y reemplaza el valor de GROQ_API_KEY por tu clave gratuita.";
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return "Ocurrió un error al conectar con el tutor. Verifica tu conexión a internet o la API Key.";
  }
}

// Enviar mensaje desde el chat
async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage(text, true);
  chatInput.value = "";
  chatSend.disabled = true;

  // Mensaje de "escribiendo..."
  const loading = document.createElement('div');
  loading.className = 'message bot';
  loading.textContent = "Escribiendo...";
  chatMessages.appendChild(loading);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  const reply = await askTutor(text);
  loading.remove();
  addMessage(reply);
  chatSend.disabled = false;
  chatInput.focus();
}

// Eventos del chat
if (chatSend && chatInput) {
  chatSend.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

// Ejercicio práctico
if (btnEjercicio && ejercicioTexto && ejercicioRespuesta) {
  btnEjercicio.addEventListener('click', async () => {
    const idea = ejercicioTexto.value.trim();
    if (!idea) {
      ejercicioRespuesta.innerHTML = `<div class="alert alert-warning">Escribe primero tu idea.</div>`;
      return;
    }

    btnEjercicio.disabled = true;
    ejercicioRespuesta.innerHTML = `<div class="text-muted">El tutor está revisando tu idea...</div>`;

    const prompt = `El estudiante escribió esta idea sobre cómo usaría una tecnología del módulo en una cooperativa:\n\n"${idea}"\n\nDale una retroalimentación corta, clara y motivadora. Menciona 1 o 2 aciertos y 1 sugerencia de mejora. No seas muy largo.`;

    const reply = await askTutor(prompt);
    ejercicioRespuesta.innerHTML = `<div class="alert alert-light border">${reply}</div>`;
    btnEjercicio.disabled = false;
  });
}
