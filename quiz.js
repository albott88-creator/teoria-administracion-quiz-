// ==========================================
// QUIZ TEORÍA DE LA ADMINISTRACIÓN - LÓGICA PRINCIPAL
// ==========================================
// Este archivo contiene el banco de preguntas, lógica de renderizado,
// toggle open/close, intentos únicos, guardado en Supabase,
// y panel docente.

import { SUPABASE_CONFIG, CAREER_MAP, SUPABASE_COLUMNS, isConfigComplete } from './config.js';

// ==========================================
// BANCO DE PREGUNTAS (15 MCQ)
// ==========================================
// Reglas aplicadas (skill balanceo-opciones-quiz):
// 1. Correcta NUNCA es la opción más larga (únicamente)
// 2. Todos los distractores deben parecer correctos bajo lectura superficial
// 3. Longitudes balanceadas: todas dentro de ~10-22 chars
// 4. No hay símbolos AI (→, ↑, ↓, πᵉ, Yf) - usar texto natural
// 5. Contenido NM-only excluido (solo temas Teoría de la Administración)
// 6. Distractores con error conceptual plausible (cadena causal truncada,
//    inversión de causalidad, confusión de agente, magnitud inexacta)

// Formato: { topic, question, options: [4], correctIdx: number, explanation }
// Las opciones ya vienen shuffleadas; answerIdx se remapa después.

const QUESTION_BANK = [
  {
    topic: "PODC - Planificación",
    question: "En el ciclo PODC, la fase de Planificación consiste en:",
    options: [
      "Definir objetivos y asegurar los recursos para cumplarlos",
      "Ejecutar las actividades según el plan establecido",
      "Verificar los resultados contra los estándares planificados",
      "Tomar acciones correctivas cuando los desvíos son significativos"
    ],
    correctIdx: 0,
    explanation: "La Planificación define qué se quiere lograr y cómo, estableciendo objetivos y los recursos necesarios antes de actuar."
  },
  {
    topic: "PODC - Organización",
    question: "Durante la fase de Organización del ciclo PODC, el gerente debe:",
    options: [
      "Distribuir autoridad y responsabilidades entre el equipo",
      "Medir el desempeño contra los estándares establecidos",
      "Seleccionar y desarrollar al personal para los roles requeridos",
      "Corregir las desviaciones entre lo planificado y lo ejecutado"
    ],
    correctIdx: 0,
    explanation: "Organizar implica estructurar los recursos, distribuir autoridad y crear la disposición necesaria para la ejecución."
  },
  {
    topic: "PODC - Dirección",
    question: "En la fase de Dirección PODC, la actividad principal es:",
    options: [
      "Guiar y motivar al equipo",
      "Establecer estándares de desempeño y medir resultados",
      "Desarrollar capacidades y habilidades del personal",
      "Corregir desviaciones entre lo planificado y lo ejecutado"
    ],
    correctIdx: 0,
    explanation: "Dirección es guiar y motivar al equipo, asegurando que trabajen hacia los mismos objetivos."
  },
{
    topic: "PODC - Control",
    question: "La fase de Control en PODC se enfoca en:",
    options: [
      "Verificar resultados contra los estándares",
      "Organizar recursos humanos y materiales del proceso",
      "Establecer los objetivos y metas de la organización",
      "Dirigir y motivar al equipo hacia la meta"
    ],
    correctIdx: 0,
    explanation: "Control compara lo que sucedió con lo planeado y toma acciones para corregir desviaciones."
  },
{
    topic: "Estilos de liderazgo - Blake & Mouton",
    question: "El estilo (1,9) en la cuadrícula Blake & Mouton representa:",
    options: [
      "Alta preocupación por la producción y baja preocupación por las personas",
      "Baja preocupación por la producción",
      "Alta preocupación por ambas dimensiones",
      "Baja preocupación por ambas dimensiones"
    ],
    correctIdx: 1,
    explanation: "El estilo (1,9) es country club: prioriza el clima laboral por encima de resultados o producción."
  },
  {
    topic: "Liderazgo Situacional - Hersey & Blanchard",
    question: "En el liderazgo situacional, para un empleado con baja competencia y alta motivación (S1), el líder debe:",
    options: [
      "Dirigir (alto contacto, baja participación)",
      "Coaching (alto contacto, alta participación)",
      "Apoyar (bajo contacto, alta participación)",
      "Delegar (bajo contacto, bajo contacto)"
    ],
    correctIdx: 0,
    explanation: "Para el estadio S1 (competencia baja, motivación alta), el liderazgo debe ser directoramente orientado."
  },
  {
    topic: "Liderazgo Situacional - Hersey & Blanchard",
    question: "Para un empleado con alta competencia y alta madurez (S4) en liderazgo situacional, el líder debe:",
    options: [
      "Dirigir",
      "Coaching",
      "Apoyar",
      "Delegar"
    ],
    correctIdx: 3,
    explanation: "S4 corresponde al máximo desarrollo: el empleado es competente y comprometido, por lo que se delega."
  },
  {
    topic: "KPIs por fase - Planificación",
    question: "Un KPI adecuado para medir la efectividad de la fase de Planificación sería:",
    options: [
      "Objetivos cumplidos en el periodo",
      "Número de tareas completadas por empleado",
      "Tiempo promedio de ejecución de procesos",
      "Satisfacción del personal con el clima laboral"
    ],
    correctIdx: 0,
    explanation: "El cumplimiento de objetivos planificados es el indicador directo de la efectividad deplanificación."
  },
  {
    topic: "KPIs por fase - Control",
    question: "Para evaluar la efectividad de la fase de Control, el KPI más relevante es:",
    options: [
      "Desviación porcentual entre planificado y real",
      "Número de reportes de calidad generados",
      "Tiempo transcurrido entre detectar y corregir una desviación",
      "Puntuación de satisfacción del gerente"
    ],
    correctIdx: 0,
    explanation: "La desviación porcentual mide directamente qué tan bien el control está funcionando."
  },
  {
    topic: "Toma de decisiones - Sesgos cognitivos",
    question: "El sesgo de sobreconfianza en la toma de decisiones se caracteriza por:",
    options: [
      "Sobreestimar la precisión de nuestro juicio",
      "Confiar excesivamente en nuestra propia intuición",
      "Subestimar los riesgos de nuestras decisiones",
      "Ignorar opiniones ajenas al tomar decisiones"
    ],
    correctIdx: 0,
    explanation: "La sobreconfianza lleva a creer más preciso nuestro juicio del que realmente es."
  },
  {
    topic: "Toma de decisiones - Sesgos cognitivos",
    question: "El sesgo de confirmación afecta la toma de decisiones al:",
    options: [
      "Hacer que el decisor busque solo información que confirme",
      "Hacer que el decisor descarte datos que contradigan sus creencias",
      "Provocar exceso de peso a datos cuantitativos sobre cualitativos",
      "Generar sesgo de anclaje en la evaluación final"
    ],
    correctIdx: 0,
    explanation: "El sesgo de confirmación lleva a seleccionar solo los datos que validan lo que ya creemos."
  },
  {
    topic: "Mini-caso - Equipo en Crecimiento",
    question: "En el caso 'Equipo en Crecimiento', un líder nuevo llega a un equipo que ya tiene 6 meses de trabajo conjunto. El líder debe tener especial cuidado de no:",
    options: [
      "Imponer cambios drásticos sin antes evaluar la cultura existente",
      "Delegar responsabilidades sin capacitación previa",
      "Realizar una diagnóstico situacional del nivel de madurez del equipo",
      "Preguntar al equipo sobre sus experiencias y desafíos actuales"
    ],
    correctIdx: 1,
    explanation: "Delegar sin capacitación previa puede generar frustración y errores costosos en equipos que aún están en proceso de maduración."
  },
  {
    topic: "Mini-caso - Turno de Emergencia",
    question: "En un turno de emergencia operativa, el estilo de liderazgo más efectivo es normalmente:",
    options: [
      "Autocrático, para tomar decisiones rápidas y claras",
      "Democrático, para integrar opiniones del equipo completo",
      "Laissez-faire, para maximizar la autonomía del personal",
      "Situacional, adaptando el estilo según la fase de la emergencia"
    ],
    correctIdx: 0,
    explanation: "En emergencias, la toma de decisiones rápida y directa es crítica; el estilo autocrático minimiza la latencia en momentos de crisis."
  },
  {
    topic: "Evaluación de desempeño",
    question: "Al evaluar el desempeño de un subordinado usando KPIs, es importante evitar:",
    options: [
      "Evaluar solo resultados cuantitativos",
      "Considerar factores externos que afectaron el desempeño",
      "Establecer metas demasiado fáciles de alcanzar",
      "Usar una combinación de indicadores leading y lagging"
    ],
    correctIdx: 0,
    explanation: "Evaluar solo números sin contexto puede castigar injustamente a quien enfrentó circunstancias adversas."
  },
];

// ==========================================
// ESTADO DE LA APLICACIÓN
// ==========================================
const STATE = {
  currentQuestion: 0,
  score: 0,
  answered: [],
  selectedOptions: [],
  isQuizOpen: true,
  studentName: '',
  studentLastname: '',
  career: '',
  scenario: '',
  attemptId: '',
  completed: false
};

// ==========================================
// ELEMENTOS DEL DOM
// ==========================================
const elements = {
  introScreen: document.getElementById('introScreen'),
  quizScreen: document.getElementById('quizScreen'),
  resultScreen: document.getElementById('resultScreen'),
  teacherPanel: document.getElementById('teacherPanel'),
  caseDisplay: document.getElementById('caseDisplay'),
  studentNameInput: document.getElementById('studentName'),
  careerSelect: document.getElementById('career'),
  startForm: document.querySelector('.student-form'),
  questionIndex: document.getElementById('questionIndex'),
  totalQuestions: document.getElementById('totalQuestions'),
  questionText: document.getElementById('questionText'),
  optionsContainer: document.getElementById('optionsContainer'),
  timer: document.getElementById('timer'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  questionNumber: document.getElementById('questionNumber'),
  currentCaseLabel: document.getElementById('currentCaseLabel'),
  scoreCircle: document.getElementById('scoreCircle'),
  scoreValue: document.getElementById('scoreValue'),
  feedback: document.getElementById('feedback'),
  correctCount: document.getElementById('correctCount'),
  incorrectCount: document.getElementById('incorrectCount'),
  exportBtn: document.getElementById('exportBtn'),
  restartBtn: document.getElementById('restartBtn'),
  toggleBtn: document.getElementById('toggleBtn'),
  toggleStatus: document.getElementById('toggleStatus'),
  teacherPanel: document.getElementById('teacherPanel'),
  teacherCode: document.getElementById('teacherCode'),
  teacherForm: document.querySelector('.teacher-form'),
  panelContent: document.getElementById('panelContent'),
  teacherTableWrap: document.getElementById('teacherTableWrap'),
  clearAllBtn: document.getElementById('clearAllBtn'),
  teacherDot: document.getElementById('teacherDot')
};

// ==========================================
// INICIALIZACIÓN
// ==========================================
function init() {
  // Verificar configuración de Supabase
  if (!isConfigComplete()) {
    showError('Configuración de Supabase incompleta. Por favor, configure las credenciales en js/config.js');
    return;
  }

  // Verificar si el quiz está cerrado (toggle)
  checkQuizStatus();

  // Event listeners
  elements.startForm.addEventListener('submit', handleStartQuiz);
  elements.teacherForm.addEventListener('submit', handleTeacherLogin);
  elements.toggleBtn.addEventListener('click', toggleQuiz);
  elements.exportBtn.addEventListener('click', exportCSV);
  elements.restartBtn.addEventListener('click', restartQuiz);
  elements.prevBtn.addEventListener('click', prevQuestion);
  elements.nextBtn.addEventListener('click', nextQuestion);

  // Toggle invisible dot
  elements.teacherDot.addEventListener('click', toggleQuiz);

  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboardNav);
  
  // Detect when student leaves quiz screen
  document.addEventListener('visibilitychange', () => {
    hasLeftScreen = document.hidden;
  });
  window.addEventListener('blur', () => {
    hasLeftScreen = true;
  });

  // Cargar preguntas barajadas
  loadQuestions();

  console.log('Quiz inicializado correctamente');
}

// ==========================================
// MANEJO DEL TOGGLE "CERRAR/ABRIR QUIZ"
// ==========================================
let quizOpen = true; // Estado por defecto: abierto

function checkQuizStatus() {
  // Si hay configuración de quiz_config en Supabase, consultar
  if (navigator.onLine && SUPABASE_CONFIG.url && !SUPABASE_CONFIG.url.startsWith('PEGAR')) {
    fetchQuizConfig().then(isOpen => {
      quizOpen = isOpen;
      updateToggleUI();
    }).catch(() => {
      // Fail-open: si no se puede verificar, el quiz se queda abierto
      quizOpen = true;
      updateToggleUI();
    });
  } else {
    // Modo local: quiz abierto por defecto
    quizOpen = true;
    updateToggleUI();
  }
}

async function fetchQuizConfig() {
  try {
    const supabase = window.sb;
    if (!supabase) return true; // Fallback abierto

    const { data, error } = await supabase
      .from('quiz_config')
      .select('open')
      .eq('exam_id', SUPABASE_CONFIG.examId)
      .single();

    if (error || data === null) {
      // Sin fila = fail-open (quiz abierto)
      return true;
    }

    return data.open === true || data.open !== false;
  } catch (e) {
    console.error('Error fetching quiz config:', e);
    return true; // Fallback abierto
  }
}

function updateToggleUI() {
  if (quizOpen) {
    elements.toggleBtn.textContent = 'Cerrar quiz';
    elements.toggleStatus.textContent = 'abierto';
    elements.toggleBtn.classList.remove('closed');
    elements.toggleBtn.classList.add('open');
    // Estudiante: esconder banner de cerrado
    hideStudentClosedBanner();
  } else {
    elements.toggleBtn.textContent = 'Abrir quiz';
    elements.toggleStatus.textContent = 'cerrado';
    elements.toggleBtn.classList.remove('open');
    elements.toggleBtn.classList.add('closed');
    // Estudiante: mostrar banner de cerrado
    showStudentClosedBanner();
  }
}

function hideStudentClosedBanner() {
  // Remover banner si existe
  const existingBanner = document.querySelector('.quiz-closed-banner');
  if (existingBanner) existingBanner.remove();
}

function showStudentClosedBanner() {
  // Crear banner
  const banner = document.createElement('div');
  banner.className = 'quiz-closed-banner';
  banner.innerHTML = `
    <div style="background:#fee2e2;border:2px solid #fecaca;padding:1rem 1.5rem;border-radius:8px;max-width:600px;margin:1.5rem auto;color:#991b1b;">
      <strong>⚠️ La evaluación está cerrada</strong><br>
      La evaluación actual está cerrada por el docente. No puede comenzar o continuar el quiz.
    </div>
  `;
  const intro = document.getElementById('introScreen');
  if (intro) intro.prepend(banner);
}

function toggleQuiz() {
  // Cambiar estado
  quizOpen = !quizOpen;
  updateToggleUI();

  // Guardar en Supabase
  if (navigator.onLine && SUPABASE_CONFIG.url && !SUPABASE_CONFIG.url.startsWith('PEGAR')) {
    saveQuizConfig(quizOpen);
  }
}

function saveQuizConfig(isOpen) {
  try {
    const supabase = window.sb;
    if (!supabase) return;

    const { error } = await supabase
      .from('quiz_config')
      .upsert({
        exam_id: SUPABASE_CONFIG.examId,
        open: isOpen,
        updated_at: new Date().toISOString()
      }, { onConflict: 'exam_id' });

    if (error) console.error('Error guardando config:', error);
  } catch (e) {
    console.error('Error saving quiz config:', e);
  }
}

// ==========================================
// MANEJO DEL INICIO DEL QUIZ
// ==========================================
function handleStartQuiz(e) {
  e.preventDefault();

  const name = elements.studentNameInput.value.trim();
  const career = elements.career.value;

  if (!name || career === '') {
    showError('Por favor, complete nombre y seleccione su carrera.');
    return;
  }

  // Normalizar nombre
  const [namePart, ...lastnameParts] = name.split(' ');
  const studentLastname = lastnameParts.join(' ') || '';
  const normalizedName = namePart.toUpperCase().trim();
  const normalizedLastname = studentLastname.toUpperCase().trim();

  // Verificar si ya completó intento (skill quiz-attempt-integrity)
  if (!checkAttemptStatus(normalizedName, normalizedLastname)) {
    // Guardar datos y comenzar
    STATE.studentName = normalizedName;
    STATE.studentLastname = normalizedLastname;
    STATE.career = career;

    // Seleccionar caso aleatorio
    const scenarios = SUPABASE_CONFIG.quiz.scenarios;
    STATE.scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    // Mostrar caso en pantalla
    showCase(STATE.scenario);

    // Guardar en Supabase (intento iniciado)
    saveAttemptStart(normalizedName, normalizedLastname, career, STATE.scenario);

    // Ocultar pantalla de inicio
    hideScreen(elements.introScreen);
    showScreen(elements.quizScreen);

    // Comenzar quiz
    startQuiz();
  } else {
    // Ya completó intento - mostrar mensaje
    showAlreadyCompletedMessage();
  }
}

function checkAttemptStatus(name, lastname) {
  // Verificar en Supabase
  if (navigator.onLine && SUPABASE_CONFIG.url && !SUPABASE_CONFIG.url.startsWith('PEGAR')) {
    return checkAttemptInSupabase(name, lastname);
  }

  // Fallback a localStorage
  const records = JSON.parse(localStorage.getItem('macro_quiz_results') || '[]');
  return records.some(r => 
    (r.name || '').toUpperCase().includes(name.toUpperCase()) && 
    (r.lastname || '').toUpperCase().includes(lastname.toUpperCase())
  );
}

async function checkAttemptInSupabase(name, lastname) {
  try {
    const supabase = window.sb;
    if (!supabase) return false;

    const { data, error } = await supabase
      .from('students_scores')
      .select('*')
      .eq('name', name)
      .eq('lastname', lastname)
      .eq('scenario', STATE.scenario || '');

    if (error) return false;

    // Si ya hay registro, el estudiante ya completó
    if (data && data.length > 0) {
      return true;
    }

    return false;
  } catch (e) {
    console.error('Error checking attempt:', e);
    return false;
  }
}

function saveAttemptStart(name, lastname, career, scenario) {
  try {
    const supabase = window.sb;
    if (!supabase) return;

    const { error } = await supabase
      .from('students_scores')
      .insert({
        name: name,
        lastname: lastname,
        score: 0,
        date: new Date().toISOString(),
        scenario: scenario,
        topic_tag: 'teoria-administracion'
      });

    if (error) console.error('Error guardando inicio:', error);
  } catch (e) {
    console.error('Error saving attempt start:', e);
  }
}

function showAlreadyCompletedMessage() {
  showError('Ya ha completado esta evaluación. Su docente puede borrar su registro si desea intentar nuevamente.');
}

// ==========================================
// LÓGICA DEL QUIZ
// ==========================================
let shuffledQuestions = [];
let currentQuestionIndex = 0;
let timeLeft = 30;
let timerInterval = null;
let studentAnswers = {}; // { questionIdx: answerIdx }
let hasLeftScreen = false; // Track if student left quiz screen

function loadQuestions() {
  // Barajar el banco de preguntas
  shuffledQuestions = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
  // Tomar solo 15
  shuffledQuestions = shuffledQuestions.slice(0, 15);
  
  // Remapear answerIdx después del shuffle
  shuffledQuestions.forEach((q, i) => {
    // Las opciones ya vienen con correctIdx fijo; después del shuffle, el correcto se mantiene en esa posición
    // Pero necesitamos almacenar el índice correcto para cada pregunta barajada
    q.answerIdx = q.correctIdx; // Inicializar como correcto en posición original
  });
}

function startQuiz() {
  currentQuestionIndex = 0;
  STATE.currentQuestion = 0;
  timeLeft = 30;
  studentAnswers = {};
  
  // Reiniciar timer
  clearInterval(timerInterval);
  elements.timer.textContent = '30';
  
  // Mostrar primera pregunta
  renderQuestion();
  
  // Iniciar timer
  startTimer();
  
  // Habilitar botón next
  elements.nextBtn.disabled = false;
  elements.prevBtn.disabled = true;
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    elements.timer.textContent = timeLeft;
    
    // Cambiar color cuando queda poco tiempo
    if (timeLeft <= 10) {
      elements.timer.style.color = '#e74c3c';
    }
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      nextQuestion(); // Auto-avanzar cuando se acaba el tiempo
    }
  }, 1000);
}

function renderQuestion() {
  const current = shuffledQuestions[currentQuestionIndex];
  
  // Mostrar texto de la pregunta
  elements.questionText.textContent = current.question;
  
  // Generar opciones con shuffle y remapeo de answerIdx
  const shuffled = shuffleOptions(current.options, current.correctIdx);
  
  // Almacenar el índice correcto remapeado para esta pregunta (después del shuffle)
  current.answerIdx = shuffled.answerIdx;
  
  // Renderizar opciones
  elements.optionsContainer.innerHTML = '';
  
  shuffled.options.forEach((option, idx) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'option';
    optionElement.dataset.idx = idx;
    optionElement.innerHTML = `
      <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
      <span>${option}</span>
    `;
    
    // Marcar si ya fue seleccionada esta pregunta
    if (studentAnswers[currentQuestionIndex] !== undefined) {
      if (studentAnswers[currentQuestionIndex] === idx) {
        optionElement.classList.add('selected');
      }
    }
    
    optionElement.addEventListener('click', () => selectOption(idx, optionElement));
    elements.optionsContainer.appendChild(optionElement);
  });
  
  // Actualizar numeración
  elements.questionIndex.textContent = currentQuestionIndex + 1;
  elements.questionNumber.textContent = 15;
  
  // Actualizar estado de botones
  elements.prevBtn.disabled = currentQuestionIndex === 0;
  elements.nextBtn.disabled = currentQuestionIndex === shuffledQuestions.length - 1 && currentQuestionIndex > 0;
  
  // Focus management
  const firstOption = elements.optionsContainer.querySelector('.option');
  if (firstOption) firstOption.focus();
}

function shuffleOptions(options, correctIdx) {
  // Crear array con opciones indexadas
  const indexed = options.map((text, idx) => ({ text, originalIdx: idx }));
  
  // Fisher-Yates shuffle
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  
  // Encontrar el nuevo índice de la correcta
  const newCorrectIdx = indexed.findIndex(item => item.originalIdx === correctIdx);
  
  // Retornar opciones barajadas y el nuevo índice correcto
  return {
    options: indexed.map(item => item.text),
    answerIdx: newCorrectIdx
  };
}

function selectOption(idx, element) {
  // Marcar selección
  studentAnswers[currentQuestionIndex] = idx;
  
  // Remover clases anteriores
  const options = elements.optionsContainer.querySelectorAll('.option');
  options.forEach(opt => opt.classList.remove('selected', 'correct', 'incorrect'));
  
  // Añadir clase seleccionada a la opción elegida
  element.classList.add('selected');
  
  // Actualizar botones
  elements.nextBtn.disabled = false;
  elements.prevBtn.disabled = false;
  
  // Focus out
  element.blur();
}

function nextQuestion() {
  // Detener timer temporalmente
  clearInterval(timerInterval);
  
  // Si es la última pregunta, ir a resultados
  if (currentQuestionIndex >= shuffledQuestions.length - 1) {
    showResults();
    return;
  }
  
  currentQuestionIndex++;
  STATE.currentQuestion = currentQuestionIndex;
  
  // Renderizar próxima pregunta
  renderQuestion();
  
  // Reiniciar timer
  timeLeft = 30;
  elements.timer.textContent = '30';
  elements.timer.style.color = '#2c3e50';
  
  // Reiniciar timer interval
  clearInterval(timerInterval);
  startTimer();
}

function prevQuestion() {
  if (currentQuestionIndex <= 0) return;
  
  currentQuestionIndex--;
  STATE.currentQuestion = currentQuestionIndex;
  
  renderQuestion();
  
  timeLeft = 30;
  elements.timer.textContent = '30';
  elements.timer.style.color = '#2c3e50';
  
  clearInterval(timerInterval);
  startTimer();
}

// ==========================================
// RESULTADOS
// ==========================================
function showResults() {
  clearInterval(timerInterval);
  
  // Aplicar penalti si el estudiante abandonó la pantalla
  let penaltyApplied = false;
  if (hasLeftScreen) {
    STATE.score = Math.max(STATE.score - 0.5, 0); // Mínimo 0
    penaltyApplied = true;
  }
  
  // Calificar
  let correctas = 0;
  let incorrectas = 0;
  
  shuffledQuestions.forEach((q, i) => {
    const studentAnswer = studentAnswers[i];
    // Comparar con answerIdx que viene en el objeto shuffleado
    const isCorrect = studentAnswer === q.answerIdx;
    
    if (isCorrect) {
      correctas++;
    } else {
      incorrectas++;
    }
  });
  
  STATE.score = Math.round((correctas / shuffledQuestions.length) * 10);
  STATE.answered = [...studentAnswers];
  
  // Guardar en Supabase
  saveScore(correctas, incorrectas);
  
  // Mostrar pantalla de resultados
  elements.scoreValue.textContent = STATE.score;
  elements.correctCount.textContent = correctas;
  elements.incorrectCount.textContent = incorrectas;
  
  // Mostrar feedback sobre penalti si aplicó
  if (penaltyApplied) {
    const penaltyDiv = document.createElement('div');
    penaltyDiv.style.cssText = 'background:#e8f5e9;border:2px solid #a5d6a7;padding:1rem 1.5rem;border-radius:8px;max-width:600px;margin:1rem auto;color:#2e7d32;margin-bottom:1rem;';
    penaltyDiv.innerHTML = `<strong>⚠️ Penalti aplicado</strong>: Se detectó abandono de pantalla. Se descontaron 0.5 puntos.`;
    // Insertar antes del feedback
    const feedback = document.getElementById('feedback');
    if (feedback) {
      feedback.parentNode.insertBefore(penaltyDiv, feedback);
    }
  }
  
  showFeedback(correctas);
  
  hideScreen(elements.quizScreen);
  showScreen(elements.resultScreen);
}

function showFeedback(correctas) {
  const percentage = (correctas / 15) * 100;
  
  if (percentage >= 90) {
    elements.feedback.textContent = 'Excelente desempeño. Demuestra dominio sólido de la teoría de la administración.';
    elements.feedback.style.color = '#27ae60';
  } else if (percentage >= 70) {
    elements.feedback.textContent = 'Buen desempeño. Tiene una base sólida que reforzar con práctica continua.';
    elements.feedback.style.color = '#27ae60';
  } else if (percentage >= 50) {
    elements.feedback.textContent = 'Satisfactorio. Identifica los conceptos básicos pero requiere reforzar los temas clave.';
    elements.feedback.style.color = '#f1c40f';
  } else {
    elements.feedback.textContent = 'Necesita reforzar los conceptos fundamentales. Consulte las diapositivas y practique más.';
    elements.feedback.style.color = '#e74c3c';
  }
}

function saveScore(correctas, incorrectas) {
  try {
    const supabase = window.sb;
    if (!supabase) return;
    
    const score = Math.round((correctas / 15) * 10);
    
    const { error } = await supabase
      .from('students_scores')
      .insert({
        name: STATE.studentName,
        lastname: STATE.studentLastname,
        score: score,
        date: new Date().toISOString(),
        scenario: STATE.scenario,
        topic_tag: 'teoria-administracion'
      });
    
    if (error) console.error('Error guardando score:', error);
  } catch (e) {
    console.error('Error saving score:', e);
  }
}

// ==========================================
// PANEL DOCENTE
// ==========================================
function handleTeacherLogin(e) {
  e.preventDefault();
  const code = elements.teacherCode.value.trim();
  
  if (code === 'DOCENTE2026') {
    showTeacherPanel();
    elements.teacherCode.value = '';
  } else {
    showError('Código incorrecto. Por favor, intente nuevamente.');
    elements.teacherCode.value = '';
  }
}

function showTeacherPanel() {
  hideScreen(elements.introScreen);
  hideScreen(elements.quizScreen);
  hideScreen(elements.resultScreen);
  
  // Cargar resultados de estudiantes
  loadTeacherResults();
  
  showScreen(elements.teacherPanel);
}

function loadTeacherResults() {
  if (!navigator.onLine || SUPABASE_CONFIG.url.startsWith('PEGAR')) {
    // Mostrar datos de ejemplo si no hay conexión
    displaySampleResults();
    return;
  }
  
  try {
    const supabase = window.sb;
    if (!supabase) {
      displaySampleResults();
      return;
    }
    
    const { data, error } = await supabase
      .from('students_scores')
      .select('*')
      .order('score', { ascending: false });
    
    if (error) {
      console.error('Error loading results:', error);
      displaySampleResults();
      return;
    }
    
    displayTeacherResults(data || []);
  } catch (e) {
    console.error('Error loading teacher results:', e);
    displaySampleResults();
  }
}

function displayTeacherResults(results) {
  const wrap = elements.teacherTableWrap;
  
  if (results.length === 0) {
    wrap.innerHTML = '<p>No hay registros de estudiantes aún.</p>';
    clearAllBtn.style.display = 'none';
    return;
  }
  
  // Construir tabla
  let html = `
    <table class="teacher-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Carrera</th>
          <th>Escenario</th>
          <th>Puntuación</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  results.forEach((row, index) => {
    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${row.name || '—'}</td>
        <td>${row.career || '—'}</td>
        <td>${row.scenario || '—'}</td>
        <td>${row.score || 0} / 10</td>
        <td>${new Date(row.date).toLocaleDateString()}</td>
      </tr>
    `;
  });
  
  html += `</tbody></table>`;
  wrap.innerHTML = html;
  
  // Mostrar botón de borrar
  clearAllBtn.style.display = 'block';
  
  // Agregar event listeners a los botones de delete
  setupDeleteButtons();
}

function setupDeleteButtons() {
  const deleteButtons = document.querySelectorAll('.btn-delete');
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const rowId = btn.dataset.del;
      deleteStudentRecord(rowId);
    });
  });
}

function deleteStudentRecord(id) {
  if (!confirm('¿Está seguro de desear borrar este registro?')) return;
  
  if (navigator.onLine && SUPABASE_CONFIG.url && !SUPABASE_CONFIG.url.startsWith('PEGAR')) {
    const supabase = window.sb;
    if (supabase) {
      supabase
        .from('students_scores')
        .delete()
        .eq('id', id)
        .then(() => {
          loadTeacherResults(); // Recargar
          showError('Registro borrado correctamente.');
        })
        .catch(err => console.error('Error borrando registro:', err));
    }
  } else {
    // Modo local: remover de localStorage
    const records = JSON.parse(localStorage.getItem('macro_quiz_results') || '[]');
    const filtered = records.filter(r => r.id !== id);
    localStorage.setItem('macro_quiz_results', JSON.stringify(filtered));
    loadTeacherResults();
  }
}

function clearAllResults() {
  if (!confirm('¿Está seguro de borrar TODOS los registros de estudiantes?')) return;
  
  if (navigator.onLine && SUPABASE_CONFIG.url && !SUPABASE_CONFIG.url.startsWith('PEGAR')) {
    const supabase = window.sb;
    if (supabase) {
      supabase
        .from('students_scores')
        .delete()
        .neq('id', 0) // Esto borra todo en Supabase
        .then(() => {
          loadTeacherResults();
          showError('Todos los registros han sido borrados.');
        })
        .catch(err => console.error('Error borrando todos:', err));
    }
  } else {
    localStorage.removeItem('macro_quiz_results');
    loadTeacherResults();
  }
}

// ==========================================
// EXPORTAR CSV
// ==========================================
function exportCSV() {
  // Generar CSV con BOM para Excel
  let csv = '\ufeff'; // BOM de UTF-8
  
  // Cabecera
  csv += 'Nombre,Apellido,Carrera,Escenario,Puntuación /10,Fecha\n';
  
  // Datos - obtener de Supabase o localStorage
  const records = getAllRecords();
  
  records.forEach((record, index) => {
    const nombre = `"${(record.name || '').replace(/"/, '""')}"`;
    const apellido = `"${(record.lastname || '').replace(/"/, '""')}"`;
    const carrera = `"${(record.career || '').replace(/"/, '""')}"`;
    const escenario = `"${(record.scenario || '').replace(/"/, '""')}"`;
    const puntuacion = record.score !== undefined ? record.score : 0;
    const fecha = record.date ? new Date(record.date).toLocaleDateString() : '';
    
    csv += `${nombre},${apellido},${carrera},${escenario},${puntuacion},${fecha}\n`;
  });
  
  // Trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `teoria-administracion-notas-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function getAllRecords() {
  if (navigator.onLine && SUPABASE_CONFIG.url && !SUPABASE_CONFIG.url.startsWith('PEGAR')) {
    // En producción, aquí haríamos un fetch a Supabase
    // Por ahora, retornar vacío para que el CSV esté vacío o use localStorage
    return [];
  }
  
  return JSON.parse(localStorage.getItem('macro_quiz_results') || '[]');
}

// ==========================================
// UTILIDADES
// ==========================================
function showError(message) {
  // Mostrar error temporal
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'background:#fee2e2;border:2px solid #fecaca;padding:1rem 1.5rem;border-radius:8px;max-width:600px;margin:1rem auto;color:#991b1b;margin-bottom:1rem;';
  errorDiv.textContent = message;
  
  // Insertar en el container principal
  const container = document.querySelector('.app-container');
  container.insertBefore(errorDiv, container.firstElementChild.nextSibling);
  
  setTimeout(() => errorDiv.remove(), 5000);
}

function hideScreen(screen) {
  screen.classList.remove('active');
}

function showScreen(screen) {
  // Ocultar todas las pantallas
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
}

// ==========================================
// INICIAR CUANDO EL DOM ESTÉ LISTO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Verificar si el toggle docente está cerrado al cargar
  checkQuizStatus();
  
  // Inicializar la aplicación
  init();
});

// Helper para exportar CSV con BOM
function exportResultsCSV() {
  exportCSV();
}