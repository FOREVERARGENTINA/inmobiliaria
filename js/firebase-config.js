// ========================================
// Firebase Configuration
// ========================================
// IMPORTANTE: Reemplaza estos valores con tu configuración de Firebase
// Para obtener tu configuración:
// 1. Ve a https://console.firebase.google.com/
// 2. Crea un nuevo proyecto o selecciona uno existente
// 3. Ve a Project Settings > Your apps > Add app > Web
// 4. Copia la configuración y pégala aquí

const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROJECT_ID.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT_ID.appspot.com",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

// Verificar si Firebase está configurado
const isConfigured = firebaseConfig.apiKey !== "TU_API_KEY";

if (!isConfigured) {
    console.warn('⚠️ Firebase no está configurado. Por favor edita js/firebase-config.js con tus credenciales.');
    console.warn('📖 Instrucciones en: https://console.firebase.google.com/');
}

// Inicializar Firebase solo si está configurado
let auth = null;
let db = null;
let storage = null;

try {
    firebase.initializeApp(firebaseConfig);

    // Servicios de Firebase
    auth = firebase.auth();
    db = firebase.firestore();

    // Storage solo si está disponible el SDK
    if (typeof firebase.storage === 'function') {
        storage = firebase.storage();
    } else {
        console.warn('⚠️ Firebase Storage SDK no está cargado en esta página');
    }

    console.log('✅ Firebase inicializado correctamente');
} catch (error) {
    console.error('❌ Error inicializando Firebase:', error.message);
    if (!isConfigured) {
        alert('Firebase no está configurado. Por favor configura tus credenciales en js/firebase-config.js');
    }
}

// Exportar para uso en otros archivos
window.firebaseAuth = auth;
window.firebaseDB = db;
window.firebaseStorage = storage;
