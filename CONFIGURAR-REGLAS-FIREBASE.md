# Configurar Reglas de Seguridad de Firebase

Este documento explica cómo configurar las reglas de seguridad para Firestore y Storage.

## Problema Actual

Estás viendo estos errores:
- `Missing or insufficient permissions` - Firestore no permite leer propiedades
- `CORS policy` - Storage no permite subir imágenes desde localhost

## Solución: Configurar Reglas de Seguridad

### 1. Configurar Reglas de Firestore

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: `frandoweb-4c2c7`
3. En el menú lateral, ve a **Firestore Database**
4. Haz clic en la pestaña **Reglas** (Rules)
5. Copia y pega el contenido del archivo `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Reglas para la colección de propiedades
    match /properties/{propertyId} {
      // Permitir lectura pública de todas las propiedades
      allow read: if true;

      // Solo usuarios autenticados pueden crear, actualizar o eliminar
      allow create, update, delete: if request.auth != null;
    }

    // Reglas para otros documentos (bloquear por defecto)
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

6. Haz clic en **Publicar** (Publish)

### 2. Configurar Reglas de Storage

1. En Firebase Console, ve a **Storage**
2. Haz clic en la pestaña **Reglas** (Rules)
3. Copia y pega el contenido del archivo `storage.rules`:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Reglas para las imágenes de propiedades
    match /properties/{propertyId}/{allPaths=**} {
      // Permitir lectura pública de todas las imágenes
      allow read: if true;

      // Solo usuarios autenticados pueden subir/modificar/eliminar imágenes
      allow write: if request.auth != null
                   && request.resource.size < 10 * 1024 * 1024  // Máximo 10MB
                   && request.resource.contentType.matches('image/.*');  // Solo imágenes
    }

    // Bloquear acceso a otros archivos por defecto
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

4. Haz clic en **Publicar** (Publish)

### 3. Configurar CORS para Storage (Opcional)

Si sigues teniendo problemas con CORS desde localhost, ejecuta este comando:

```bash
gsutil cors set cors.json gs://frandoweb-4c2c7.firebasestorage.app
```

**Nota:** Necesitas tener instalado [Google Cloud SDK](https://cloud.google.com/storage/docs/gsutil_install)

### 4. Alternativa: Usar Firebase Hosting

En lugar de usar `http://127.0.0.1:5500`, puedes usar Firebase Hosting que no tiene problemas de CORS:

```bash
# Servir localmente
firebase serve

# O desplegar directamente
firebase deploy
```

## Verificación

Después de configurar las reglas:

1. Recarga tu página web
2. Los errores de permisos deberían desaparecer
3. Las propiedades se cargarán desde Firebase
4. Podrás subir imágenes desde el dashboard

## Seguridad

Estas reglas permiten:
- ✅ Lectura pública de propiedades (cualquiera puede ver)
- ✅ Solo usuarios autenticados pueden modificar
- ✅ Límite de 10MB por imagen
- ✅ Solo archivos de imagen permitidos
- ❌ Otros documentos/archivos bloqueados por defecto

## ¿Necesitas Ayuda?

Si tienes problemas, verifica:
1. Que hayas publicado las reglas correctamente
2. Que estés usando el proyecto correcto en Firebase Console
3. Que tu usuario esté autenticado al intentar subir imágenes
