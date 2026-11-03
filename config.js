// ==========================================
// CONFIGURACIÓN SUPABASE - Teoría de la Administración
// ==========================================
// NOTA: Reemplazar estos valores con los de tu proyecto Supabase real.
// Puedes crear un proyecto gratuito en https://supabase.com
//
// Para obtener las credenciales:
// 1. Ve a https://supabase.com y crea una cuenta
// 2. Crea un nuevo proyecto
// 3. Ve a Settings → API
// 4. Copia la "Project URL" y la "anon public key"
// 5. Reemplaza los valores a continuación

// Configuración del proyecto
export const SUPABASE_CONFIG = {
  // URL del proyecto Supabase (ej: https://tu-proyecto.supabase.co)
  // Ejemplo: 'https://abc123.supabase.co'
  url: 'https://wnjfvfxsyxfpqdxufwre.supabase.co',

  // Llave pública (publishable key) - VÁLIDA para operaciones anonímicas
  // Formato: sb_publishable_... o empieza por 'pk_'
  // Ejemplo: 'sb_publishable_abc123def456'
  anonKey: 'sb_publishable_NfRHWhTLLWNlWQyfuiF8LA_6pjCW798',

  // ID de examen para identificar este quiz en la base de datos
  examId: 'teoria-administracion-3carreras-2026',

  // Configuración del quiz
  quiz: {
    totalQuestions: 14, // Número de preguntas por intento
    timePerQuestion: 30, // Segundos por pregunta (inamovible 30s)
    scenarios: ['Equipo en Crecimiento', 'Turno de Emergencia'] // Casos disponibles
  }
};

// Mapeo de carreras para exportación
export const CAREER_MAP = {
  'Comercio Exterior': 'Teoría de la Administración (Comercio Exterior)',
  'Contabilidad': 'Teoría de la Administración (Contabilidad)',
  'Marketing': 'Teoría de la Administración (Marketing)'
};

// Nombres de columnas en Supabase
export const SUPABASE_COLUMNS = {
  id: 'id',
  name: 'name',
  score: 'score',
  date: 'date',
  scenario: 'scenario',
  topic_tag: 'topic_tag'
};

// Inicializar Supabase client
// Este cliente se usa en el navegador con la anon key
export function initSupabase() {
  // El cliente se inicializa en quiz.js después de verificar la config
  return null;
}

// Verificar si la configuración está completa
export function isConfigComplete() {
  return SUPABASE_CONFIG.url && SUPABASE_CONFIG.url.startsWith('http') &&
         SUPABASE_CONFIG.anonKey && !SUPABASE_CONFIG.anonKey.startsWith('PEGAR');
}