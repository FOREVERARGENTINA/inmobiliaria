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
    apiKey: "AIzaSyCuQXi0LS6TJ1UN2-sprZWbYliX72grg-Y",
    authDomain: "frandoweb-4c2c7.firebaseapp.com",
    projectId: "frandoweb-4c2c7",
    storageBucket: "frandoweb-4c2c7.firebasestorage.app",
    messagingSenderId: "227831202965",
    appId: "1:227831202965:web:5c254bbaeeb27830f7c79c",
    measurementId: "G-Q8NER1EHYS"
};

// Verificar si Firebase está configurado
const isConfigured = firebaseConfig.apiKey !== "TU_API_KEY";

if (!isConfigured) {
    console.warn('Firebase no está configurado. Por favor edita js/firebase-config.js con tus credenciales.');
    console.warn('Instrucciones en: https://console.firebase.google.com/');
}

// Inicializar Firebase solo si está configurado
let auth = null;
let db = null;
let storage = null;

try {
    firebase.initializeApp(firebaseConfig);

    // Auth solo si está disponible el SDK
    if (typeof firebase.auth === 'function') {
        auth = firebase.auth();
    } else {
        console.warn('Firebase Auth SDK no está cargado en esta página');
    }

    // Firestore solo si está disponible el SDK
    if (typeof firebase.firestore === 'function') {
        db = firebase.firestore();
    } else {
        console.warn('Firebase Firestore SDK no está cargado en esta página');
    }

    // Storage solo si está disponible el SDK
    if (typeof firebase.storage === 'function') {
        storage = firebase.storage();
    } else {
        console.warn('Firebase Storage SDK no está cargado en esta página');
    }

    console.log('Firebase inicializado correctamente');
} catch (error) {
    console.error('Error inicializando Firebase:', error.message);
    if (!isConfigured) {
        alert('Firebase no está configurado. Por favor configura tus credenciales en js/firebase-config.js');
    }
}

// Exportar para uso en otros archivos
window.firebaseAuth = auth;
window.firebaseDB = db;
window.firebaseStorage = storage;
