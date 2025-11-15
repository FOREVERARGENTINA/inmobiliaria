# 🔥 Cómo Configurar Firebase

Para que el sitio funcione, necesitas configurar Firebase con tus propias credenciales.

---

## 📋 Paso 1: Crear Proyecto en Firebase

1. **Ve a Firebase Console:**
   ```
   https://console.firebase.google.com/
   ```

2. **Click en "Agregar proyecto" (o "Add project")**

3. **Nombre del proyecto:**
   - Ejemplo: `inmobiliaria-app`
   - Click "Continuar"

4. **Google Analytics** (opcional):
   - Puedes desactivarlo por ahora
   - Click "Crear proyecto"

5. **Espera a que se cree** (toma unos segundos)

6. **Click en "Continuar"**

---

## 📱 Paso 2: Registrar tu App Web

1. **En el Dashboard del proyecto:**
   - Click en el ícono web `</>`

2. **Registra tu app:**
   - Nombre: `InmoPlus Web`
   - ☑️ Firebase Hosting (opcional, pero recomendado)
   - Click "Registrar app"

3. **Copia la configuración:**
   Verás algo como esto:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC...",
     authDomain: "inmobiliaria-app.firebaseapp.com",
     projectId: "inmobiliaria-app",
     storageBucket: "inmobiliaria-app.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

4. **Guarda estas credenciales** (las necesitarás en el siguiente paso)

---

## ⚙️ Paso 3: Configurar el Proyecto Local

1. **Abre el archivo:**
   ```
   js/firebase-config.js
   ```

2. **Reemplaza las líneas 11-17** con tu configuración:

   **Antes:**
   ```javascript
   const firebaseConfig = {
       apiKey: "TU_API_KEY",
       authDomain: "TU_PROJECT_ID.firebaseapp.com",
       projectId: "TU_PROJECT_ID",
       storageBucket: "TU_PROJECT_ID.appspot.com",
       messagingSenderId: "TU_MESSAGING_SENDER_ID",
       appId: "TU_APP_ID"
   };
   ```

   **Después (ejemplo con tus datos):**
   ```javascript
   const firebaseConfig = {
       apiKey: "AIzaSyC1234567890abcdefghijk",
       authDomain: "inmobiliaria-app.firebaseapp.com",
       projectId: "inmobiliaria-app",
       storageBucket: "inmobiliaria-app.appspot.com",
       messagingSenderId: "123456789012",
       appId: "1:123456789012:web:abc123def456"
   };
   ```

3. **Guarda el archivo**

---

## 🔐 Paso 4: Habilitar Authentication

1. **Firebase Console → Authentication**

2. **Click en "Get started"**

3. **Click en "Email/Password"**

4. **Habilitar:**
   - ☑️ Email/Password
   - Click "Guardar"

---

## 💾 Paso 5: Configurar Firestore Database

1. **Firebase Console → Firestore Database**

2. **Click en "Crear base de datos"**

3. **Modo:**
   - Selecciona: **"Comenzar en modo de prueba"**
   - Click "Siguiente"

4. **Ubicación:**
   - Selecciona la región más cercana (ej: `us-east1`)
   - Click "Habilitar"

5. **Reglas de seguridad** (después de que se cree):
   - Ve a la pestaña "Reglas"
   - Reemplaza con esto:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Usuarios pueden leer todas las propiedades
       match /properties/{property} {
         allow read: if true;
         allow write: if request.auth != null;
       }

       // Usuarios autenticados pueden gestionar su perfil
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

   - Click "Publicar"

---

## 📦 Paso 6: Configurar Storage

1. **Firebase Console → Storage**

2. **Click en "Comenzar"**

3. **Reglas de seguridad:**
   - Selecciona: **"Comenzar en modo de prueba"**
   - Click "Siguiente"

4. **Ubicación:**
   - Selecciona la misma región que Firestore
   - Click "Listo"

5. **Reglas de seguridad** (después de crear):
   - Ve a la pestaña "Reglas"
   - Reemplaza con esto:

   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       // Solo usuarios autenticados pueden subir imágenes
       match /properties/{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

   - Click "Publicar"

---

## ✅ Paso 7: Verificar que Funciona

1. **Recarga la página** (Ctrl + F5 o Cmd + Shift + R)

2. **Abre la consola del navegador** (F12)

3. **Deberías ver:**
   ```
   ✅ Firebase inicializado correctamente
   ```

4. **Si ves errores:**
   - Verifica que copiaste bien la configuración
   - Verifica que habilitaste Authentication, Firestore y Storage

---

## 🚀 Paso 8: Crear tu Primera Cuenta

1. **Ve a:**
   ```
   http://localhost:8000/login.html
   ```

2. **Click en "¿No tienes cuenta? Regístrate"**

3. **Completa el formulario:**
   - Nombre: Tu nombre
   - Email: tu@email.com
   - Contraseña: (mínimo 6 caracteres)

4. **Click en "Crear Cuenta"**

5. **Serás redirigido al Dashboard** ✅

---

## 🏠 Paso 9: Crear Propiedades de Ejemplo

1. **Ve a:**
   ```
   http://localhost:8000/seed-properties.html
   ```

2. **Inicia sesión** con tu cuenta

3. **Click en "Crear Propiedades de Ejemplo"**

4. **Espera** a que se creen las 8 propiedades

5. **Ve a index.html** para ver las propiedades

---

## 🔧 Troubleshooting

### Error: "Firebase no está configurado"
- ✅ Verifica que reemplazaste `TU_API_KEY` con tus credenciales reales
- ✅ Guarda el archivo `firebase-config.js`
- ✅ Recarga la página (Ctrl + F5)

### Error: "auth/user-not-found"
- ✅ Primero regístrate en `/login.html`
- ✅ Verifica que Authentication esté habilitado en Firebase Console

### Error: "Missing or insufficient permissions"
- ✅ Verifica las reglas de Firestore (Paso 5)
- ✅ Verifica que estés autenticado

### Error: "storage is not a function"
- ✅ Ya está corregido en el nuevo `firebase-config.js`
- ✅ El Storage solo se usa en páginas que lo necesitan

### No se ven las propiedades en index.html
- ✅ Crea propiedades con `seed-properties.html`
- ✅ O crea manualmente desde el Dashboard

---

## 📚 Recursos

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

## 🎯 Resumen Rápido

```bash
1. Firebase Console → Crear proyecto
2. Agregar app web → Copiar config
3. Pegar config en js/firebase-config.js
4. Habilitar Authentication (Email/Password)
5. Crear Firestore Database (modo prueba)
6. Habilitar Storage
7. Recargar página
8. Registrarte en /login.html
9. Crear propiedades en /seed-properties.html
10. ¡Listo! 🎉
```

---

¿Problemas? Verifica la consola del navegador (F12) para ver errores específicos.
