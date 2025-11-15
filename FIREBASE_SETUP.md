# Guía de Configuración de Firebase

Esta guía te ayudará a configurar Firebase para tu sitio web de inmobiliaria InmoPlus.

## ¿Qué es Firebase?

Firebase es una plataforma de Google que proporciona:
- **Authentication**: Sistema de login/registro
- **Firestore**: Base de datos en tiempo real
- **Storage**: Almacenamiento de imágenes
- **Hosting**: (Opcional) Para publicar tu sitio

## Paso 1: Crear Cuenta y Proyecto en Firebase

### 1.1 Crear Cuenta
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Inicia sesión con tu cuenta de Google (o crea una)

### 1.2 Crear Proyecto
1. Click en **"Agregar proyecto"** o **"Add project"**
2. Ingresa un nombre para tu proyecto: `inmoplus` (o el que prefieras)
3. (Opcional) Deshabilita Google Analytics si no lo necesitas
4. Click en **"Crear proyecto"**
5. Espera a que se complete la configuración

## Paso 2: Configurar Firebase Authentication

1. En el menú lateral, ve a **"Build" > "Authentication"**
2. Click en **"Get started"** o **"Comenzar"**
3. En la pestaña **"Sign-in method"**:
   - Click en **"Email/Password"**
   - **Activa** el primer switch (Email/Password)
   - Guarda los cambios

## Paso 3: Configurar Firestore Database

1. En el menú lateral, ve a **"Build" > "Firestore Database"**
2. Click en **"Create database"** o **"Crear base de datos"**
3. Selecciona **"Start in test mode"** (modo de prueba)
   - **Importante**: Esto es solo para desarrollo. Para producción, configura reglas más estrictas
4. Elige una ubicación cercana a tus usuarios (ej: `us-central1`, `southamerica-east1`)
5. Click en **"Enable"** o **"Habilitar"**

### 3.1 Configurar Reglas de Seguridad de Firestore

Una vez creada la base de datos:

1. Ve a la pestaña **"Rules"** en Firestore
2. Reemplaza las reglas con estas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - solo el usuario puede leer/escribir su propia info
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Properties collection - autenticados pueden crear, solo owner puede editar/eliminar
    match /properties/{propertyId} {
      allow read: if true; // Todos pueden leer (sitio público)
      allow create: if request.auth != null; // Solo autenticados pueden crear
      allow update, delete: if request.auth != null &&
                               request.auth.uid == resource.data.userId;
    }
  }
}
```

3. Click en **"Publish"** o **"Publicar"**

## Paso 4: Configurar Firebase Storage

1. En el menú lateral, ve a **"Build" > "Storage"**
2. Click en **"Get started"** o **"Comenzar"**
3. Acepta las reglas de seguridad por defecto
4. Elige la misma ubicación que usaste para Firestore
5. Click en **"Done"** o **"Listo"**

### 4.1 Configurar Reglas de Seguridad de Storage

1. Ve a la pestaña **"Rules"** en Storage
2. Reemplaza las reglas con estas:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Properties images - solo autenticados pueden subir
    match /properties/{propertyId}/{allPaths=**} {
      allow read: if true; // Todos pueden leer las imágenes
      allow write: if request.auth != null; // Solo autenticados pueden subir
    }
  }
}
```

3. Click en **"Publish"** o **"Publicar"**

## Paso 5: Obtener Configuración de Firebase

1. En el menú lateral, click en el ícono de engranaje > **"Project settings"**
2. Baja hasta la sección **"Your apps"**
3. Click en el ícono **</>** (Web)
4. Registra tu app:
   - Ingresa un nombre: `InmoPlus Web`
   - **NO** marques "Firebase Hosting"
   - Click en **"Register app"**

5. Verás un código similar a este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "inmoplus-xxxxx.firebaseapp.com",
  projectId: "inmoplus-xxxxx",
  storageBucket: "inmoplus-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxx"
};
```

6. **COPIA** estos valores

## Paso 6: Configurar el Proyecto

1. Abre el archivo **`js/firebase-config.js`** en tu proyecto
2. Reemplaza los valores de ejemplo con tu configuración:

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "TU_PROJECT_ID.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT_ID.appspot.com",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};
```

3. Guarda el archivo

## Paso 7: Probar la Configuración

### 7.1 Abrir el Sitio

Abre `index.html` en tu navegador (o usa un servidor local):

```bash
# Opción 1: Python
python -m http.server 8000

# Opción 2: Node.js
npx serve

# Opción 3: PHP
php -S localhost:8000
```

### 7.2 Crear una Cuenta

1. En el sitio, click en **"Admin"** en el menú
2. Click en **"Regístrate aquí"**
3. Completa el formulario:
   - Nombre: Tu nombre
   - Email: tu@email.com
   - Contraseña: mínimo 6 caracteres
4. Click en **"Crear Cuenta"**

Si todo está correcto, serás redirigido al dashboard.

### 7.3 Agregar una Propiedad

1. En el dashboard, click en **"Nueva Propiedad"**
2. Completa el formulario:
   - Título: "Casa Moderna de Prueba"
   - Tipo: Casa
   - Estado: En Venta
   - Ubicación: "Centro, Ciudad"
   - Precio: 250000
   - Habitaciones: 3
   - Baños: 2
   - Área: 150
3. Sube 1-3 imágenes
4. Click en **"Guardar Propiedad"**

### 7.4 Verificar en el Sitio Público

1. Vuelve a `index.html` (página principal)
2. Baja a la sección **"Propiedades Destacadas"**
3. Deberías ver tu propiedad recién creada

## Solución de Problemas

### Error: "Firebase App not initialized"

**Solución**: Verifica que `firebase-config.js` tenga la configuración correcta.

### Error: "Missing or insufficient permissions"

**Solución**: Verifica las reglas de seguridad en Firestore y Storage (Pasos 3.1 y 4.1).

### Las imágenes no se suben

**Solución**:
1. Verifica que Firebase Storage esté habilitado
2. Verifica las reglas de Storage
3. Revisa la consola del navegador (F12) para ver errores

### Error: "auth/email-already-in-use"

**Solución**: El email ya está registrado. Usa otro email o inicia sesión.

### Las propiedades no aparecen en el sitio público

**Solución**:
1. Verifica que las propiedades existan en Firestore (Firebase Console > Firestore)
2. Abre la consola del navegador (F12) y busca errores
3. Verifica que `firebase-config.js` esté bien configurado

## Reglas de Seguridad para Producción

**IMPORTANTE**: Cuando publiques el sitio en producción, actualiza las reglas de Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /properties/{propertyId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
                               request.auth.uid == resource.data.userId;
    }
  }
}
```

## Límites del Plan Gratuito (Spark)

Firebase tiene límites en el plan gratuito:

- **Authentication**: 10,000 verificaciones/mes
- **Firestore**:
  - 50,000 lecturas/día
  - 20,000 escrituras/día
  - 1 GB de almacenamiento
- **Storage**: 5 GB de almacenamiento, 1 GB/día de transferencia

Para sitios pequeños-medianos, esto es más que suficiente.

## Recursos Adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Precios de Firebase](https://firebase.google.com/pricing)
- [Guía de Seguridad](https://firebase.google.com/docs/rules)

## Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12) para ver errores
2. Verifica la configuración en Firebase Console
3. Consulta la documentación oficial de Firebase

---

¡Listo! Ahora tu sitio de inmobiliaria está completamente funcional con Firebase
