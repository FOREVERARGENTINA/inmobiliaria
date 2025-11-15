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

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Servicios de Firebase
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Exportar para uso en otros archivos
window.firebaseAuth = auth;
window.firebaseDB = db;
window.firebaseStorage = storage;
