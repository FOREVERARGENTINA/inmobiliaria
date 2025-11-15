# Habilitar Firebase Storage

## Problema

Estás viendo este error:
```
Firebase Storage has not been set up on project 'frandoweb-4c2c7'
```

## Solución

### Paso 1: Habilitar Firebase Storage desde la Consola

1. Ve a [Firebase Console - Storage](https://console.firebase.google.com/project/frandoweb-4c2c7/storage)

2. Haz clic en el botón **"Get Started"** o **"Comenzar"**

3. En el diálogo que aparece:
   - Lee las reglas de seguridad predeterminadas
   - Haz clic en **"Next"** o **"Siguiente"**

4. Selecciona la ubicación del bucket:
   - Recomendado: **us-central1** (si estás en América)
   - O **southamerica-east1** (si estás en Sudamérica)
   - Haz clic en **"Done"** o **"Listo"**

5. Espera unos segundos mientras se configura Storage

### Paso 2: Desplegar las Reglas de Storage

Una vez que Storage esté habilitado, ejecuta este comando:

```bash
firebase deploy --only storage
```

O usa el script completo:

```bash
deploy-rules.bat
```

### Paso 3: Verificar

1. Recarga tu dashboard
2. Intenta subir una imagen de una propiedad
3. El error de CORS debería desaparecer

## Estado Actual

✅ **Firestore Rules** - Ya desplegadas correctamente
⏳ **Storage** - Necesita ser habilitado primero
✅ **Hosting** - Configurado correctamente

## Próximos Pasos

Después de habilitar Storage:
1. Las imágenes se podrán subir sin problemas
2. No habrá más errores de CORS
3. El dashboard funcionará completamente
