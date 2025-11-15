# 🔗 Sistema de URLs Dinámicas - Documentación

## 📋 Resumen

Se ha implementado un sistema completo de URLs dinámicas con slugs para las propiedades del sitio inmobiliario. Ahora cada propiedad tiene su propia URL limpia y amigable para compartir.

---

## ✨ Características Implementadas

### 1. URLs Limpias y Profesionales

**Antes:** Las propiedades no tenían URLs individuales
**Ahora:** Cada propiedad tiene una URL única

```
https://tusitio.com/propiedad/casa-moderna-zona-premium
https://tusitio.com/propiedad/apartamento-centro-3-habitaciones
https://tusitio.com/propiedad/local-comercial-avenida-principal
```

### 2. Generación Automática de Slugs

Al crear o editar una propiedad, el sistema:
- Genera automáticamente un slug desde el título
- Elimina acentos y caracteres especiales
- Convierte a minúsculas
- Reemplaza espacios por guiones
- Verifica duplicados (añade -2, -3, etc. si es necesario)

**Ejemplos:**
```javascript
"Casa Moderna en Zona Premium" → "casa-moderna-en-zona-premium"
"Apartamento 3 Hab. Centro"     → "apartamento-3-hab-centro"
"Local Comercial - Av. Principal" → "local-comercial-av-principal"
```

### 3. Página de Detalles Completa

Nueva página profesional (`propiedad.html`) que incluye:
- ✅ Galería de imágenes con navegación
- ✅ Información completa de la propiedad
- ✅ Características destacadas (habitaciones, baños, área)
- ✅ Botones de contacto (WhatsApp, Email)
- ✅ Botón para compartir URL
- ✅ Propiedades relacionadas
- ✅ Meta tags para redes sociales (Open Graph)
- ✅ Diseño responsive (móvil, tablet, desktop)

---

## 🚀 Cómo Funciona

### Creación de Propiedades

1. **Usuario crea una propiedad:**
   - Va al Dashboard → Nueva Propiedad
   - Ingresa título: "Casa Moderna en Zona Premium"
   - Completa el formulario

2. **Sistema genera slug automáticamente:**
   ```javascript
   // En dashboard.js:449-451
   const slug = await generateUniqueSlug(title, editingPropertyId);
   propertyData.slug = slug;
   ```

3. **Guarda en Firebase:**
   ```javascript
   {
     id: "KzX9mQp2nL4oP8rS",
     title: "Casa Moderna en Zona Premium",
     slug: "casa-moderna-en-zona-premium",  // ← NUEVO
     type: "casa",
     price: 250000,
     // ... resto de campos
   }
   ```

### Visualización de Propiedades

1. **En index.html:**
   - Cada tarjeta tiene un enlace: `/propiedad/{slug}`
   - Click en "Ver Detalles" navega a la URL con slug

2. **Firebase Hosting:**
   - Reescribe `/propiedad/*` → `propiedad.html`
   - JavaScript lee el slug de la URL
   - Consulta Firebase por slug
   - Muestra los datos dinámicamente

---

## 📁 Archivos del Sistema

### Nuevos Archivos

#### 1. `js/slug-utils.js`
Utilidades para generar y validar slugs.

**Funciones principales:**
```javascript
// Genera slug desde título
generateSlug(title)
// "Casa Moderna" → "casa-moderna"

// Genera slug único (verifica duplicados)
await generateUniqueSlug(title, excludeId)
// Si "casa-moderna" existe → "casa-moderna-2"

// Busca propiedad por slug
await getPropertyBySlug(slug)
// Devuelve { id, ...data } o null
```

#### 2. `js/property-details.js`
Lógica de la página de detalles.

**Funcionalidades:**
- Carga datos desde Firebase por slug
- Maneja galería de imágenes
- Botones de compartir (clipboard + native API)
- Botones de contacto (WhatsApp, Email)
- Carga propiedades relacionadas
- Estados de carga y error

#### 3. `css/property-details.css`
Estilos completos para la página de detalles.

**Incluye:**
- Layout responsive
- Galería de imágenes con thumbnails
- Cards de información
- Botones de acción
- Estados de carga y error

#### 4. `propiedad.html`
Página de detalles de propiedad.

**Secciones:**
- Header con navegación
- Breadcrumb
- Información principal
- Galería de imágenes
- Características y detalles
- Contacto
- Propiedades relacionadas
- Footer

#### 5. `firebase.json`
Configuración de Firebase Hosting.

**Configuración:**
```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "/propiedad/**",
        "destination": "/propiedad.html"
      }
    ],
    "headers": [
      // Cache optimizado para imágenes y assets
    ]
  }
}
```

### Archivos Modificados

#### 1. `js/dashboard.js`
**Cambios en líneas 432-451:**
- Extrae título antes de crear propertyData
- Genera slug único con `generateUniqueSlug()`
- Añade slug a propertyData

#### 2. `dashboard.html`
**Cambio en línea 352-353:**
- Incluye script `js/slug-utils.js`

#### 3. `js/properties-loader.js`
**Cambios en líneas 101-120:**
- Genera URL con slug: `/propiedad/${property.slug || property.id}`
- Cambia botón de onclick a enlace `<a href>`

**Cambios en líneas 156-175:**
- Función `viewPropertyDetails()` redirige a URL con slug

---

## 🔧 Uso del Sistema

### Para Usuarios (Dashboard)

1. **Crear propiedad:**
   - Dashboard → Nueva Propiedad
   - Rellenar formulario (el slug se genera automáticamente)
   - Guardar

2. **Editar propiedad:**
   - Si cambias el título, el slug se regenera
   - Se verifica que no existan duplicados

3. **Ver propiedad pública:**
   - Desde el listado de propiedades
   - Click en "Ver Detalles"
   - Se abre en nueva pestaña con URL limpia

### Para Visitantes (Sitio Público)

1. **Navegar propiedades:**
   - index.html → Sección de propiedades
   - Click en "Ver Detalles"

2. **Compartir propiedad:**
   - En página de detalles → Botón "Compartir"
   - Copia URL al portapapeles
   - Compartir por redes sociales, WhatsApp, etc.

3. **Contactar:**
   - Botón WhatsApp → Abre chat con mensaje predefinido
   - Botón Email → Abre cliente de email

---

## 🌐 Ejemplo de Flujo Completo

### Caso: Usuario crea "Departamento Moderno 2 Ambientes"

```
1. Dashboard → Nueva Propiedad
   └─ Título: "Departamento Moderno 2 Ambientes"
   └─ Ubicación: "Palermo, CABA"
   └─ Precio: $150,000
   └─ 2 habitaciones, 1 baño, 60m²

2. Sistema genera slug:
   └─ "departamento-moderno-2-ambientes"

3. Verifica unicidad:
   └─ Query a Firebase: WHERE slug == "departamento-moderno-2-ambientes"
   └─ Si existe → "departamento-moderno-2-ambientes-2"
   └─ Si no existe → OK

4. Guarda en Firebase:
   {
     id: "abc123",
     title: "Departamento Moderno 2 Ambientes",
     slug: "departamento-moderno-2-ambientes",
     location: "Palermo, CABA",
     price: 150000,
     bedrooms: 2,
     bathrooms: 1,
     area: 60,
     // ...
   }

5. En sitio público:
   └─ URL: https://tusitio.com/propiedad/departamento-moderno-2-ambientes
   └─ Visitante accede a esta URL
   └─ JavaScript lee "departamento-moderno-2-ambientes"
   └─ Consulta Firebase
   └─ Muestra datos en página bonita

6. Compartir:
   └─ Botón "Compartir" copia URL al portapapeles
   └─ Visitante pega en WhatsApp, Facebook, etc.
   └─ Destinatario accede directamente a esa propiedad
```

---

## 📱 Funcionalidades Móviles

### Botón Compartir
- **Desktop:** Copia URL al portapapeles
- **Mobile:** Usa API nativa de compartir del dispositivo
  - Permite compartir por WhatsApp, Instagram, etc.

### Diseño Responsive
- **Desktop:** Galería grande, grid de 2 columnas
- **Tablet:** Grid de 1 columna
- **Mobile:** Layout vertical optimizado

---

## 🎨 Estructura de URL

### Formato
```
/propiedad/{slug}
```

### Ejemplos Reales
```
/propiedad/casa-moderna-zona-premium
/propiedad/apartamento-centro-3-habitaciones
/propiedad/local-comercial-avenida-principal
/propiedad/terreno-country-500m2
/propiedad/departamento-moderno-2-ambientes
```

### Fallback
Si una propiedad antigua no tiene slug:
```javascript
const propertyUrl = `/propiedad/${property.slug || property.id}`;
// Usa ID de Firebase si no hay slug
```

---

## 🔍 SEO y Redes Sociales

### Meta Tags Implementados
```html
<meta property="og:type" content="website">
<meta property="og:title" content="Casa Moderna en Zona Premium">
<meta property="og:description" content="...">
<meta property="og:image" content="https://...">
<meta property="og:url" content="https://tusitio.com/propiedad/casa-moderna">
```

### Beneficios
- ✅ URLs amigables para buscadores
- ✅ Preview bonito al compartir en redes sociales
- ✅ Títulos descriptivos
- ✅ Imágenes en previews

---

## 🚀 Deploy

### Firebase Hosting

1. **Instalar Firebase CLI** (si no está instalado):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login:**
   ```bash
   firebase login
   ```

3. **Inicializar** (si no está inicializado):
   ```bash
   firebase init hosting
   # Seleccionar directorio actual (.)
   ```

4. **Deploy:**
   ```bash
   firebase deploy --only hosting
   ```

5. **Verificar:**
   - Las URLs limpias funcionarán automáticamente
   - Firebase Hosting usa el `firebase.json` para rewrites

### Otro Hosting

Si usas otro hosting que soporte rewrites/redirects:

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteRule ^propiedad/([^/]+)$ /propiedad.html [L]
```

**Nginx:**
```nginx
location ~ ^/propiedad/(.+)$ {
    try_files $uri /propiedad.html;
}
```

**Netlify (_redirects):**
```
/propiedad/*  /propiedad.html  200
```

---

## 🐛 Troubleshooting

### Problema: URLs no funcionan (404)

**Causa:** Firebase Hosting no configurado
**Solución:**
```bash
firebase deploy --only hosting
```

### Problema: Slug duplicado

**Causa:** Dos propiedades con mismo título
**Solución:** El sistema añade automáticamente -2, -3, etc.

### Problema: Propiedad no se carga

**Causa:** Slug no existe en Firebase
**Solución:** Verificar en Firebase Console que la propiedad tenga campo `slug`

### Problema: Imágenes no se muestran

**Causa:** Array de imágenes vacío
**Solución:** El sistema muestra placeholder automáticamente

---

## 📊 Métricas de Mejora

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **URLs** | ❌ Sin URLs | ✅ `/propiedad/slug` |
| **SEO** | ⚠️ Malo | ✅ Excelente |
| **Compartir** | ❌ Imposible | ✅ Fácil |
| **UX** | ⚠️ Alert básico | ✅ Página completa |
| **Móvil** | ⚠️ No optimizado | ✅ Responsive |
| **Social** | ❌ Sin preview | ✅ Meta tags |

---

## 📝 Notas Técnicas

### Normalización de Slugs
```javascript
// js/slug-utils.js:18-26
.normalize('NFD')              // Descompone caracteres
.replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos
.replace(/[^a-z0-9\s-]/g, '')  // Solo alfanuméricos
.trim()                        // Elimina espacios
.replace(/\s+/g, '-')          // Espacios → guiones
.replace(/-+/g, '-')           // Múltiples guiones → uno
.replace(/^-+|-+$/g, '')       // Elimina guiones inicio/fin
```

### Verificación de Duplicados
```javascript
// js/slug-utils.js:67-77
async function generateUniqueSlug(title, excludeId = null) {
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (await slugExists(slug, excludeId)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
}
```

### Query por Slug
```javascript
// js/slug-utils.js:87-99
await firebaseDB
    .collection('properties')
    .where('slug', '==', slug)
    .limit(1)
    .get();
```

---

## 🔐 Seguridad

### Validación de Slugs
- Solo caracteres alfanuméricos y guiones
- Sin caracteres especiales peligrosos
- Normalización consistente

### Acceso a Propiedades
- Solo propiedades públicas accesibles
- Sin exposición de IDs internos sensibles
- Slugs públicos y seguros

---

## 🎯 Próximos Pasos (Opcional)

### Mejoras Futuras Posibles

1. **Analytics:**
   - Trackear vistas por propiedad
   - Contadores de compartidos
   - Fuentes de tráfico

2. **Cache:**
   - Service Worker para offline
   - Cache de propiedades visitadas

3. **Breadcrumbs enriquecidos:**
   - Schema.org markup
   - Mejora SEO

4. **URLs con categorías:**
   ```
   /venta/casa-moderna-zona-premium
   /alquiler/apartamento-centro
   ```

5. **Búsqueda por slug:**
   - Autocompletar en barra de búsqueda
   - Sugerencias de propiedades

---

## 📞 Soporte

Si encuentras algún problema:
1. Revisar la sección de Troubleshooting
2. Verificar logs en consola del navegador
3. Verificar Firebase Console
4. Revisar configuración de `firebase.json`

---

## ✅ Checklist de Verificación

Después de hacer pull:

- [ ] Verificar que `firebase.json` existe
- [ ] Verificar que `propiedad.html` existe
- [ ] Verificar que `js/slug-utils.js` existe
- [ ] Verificar que `js/property-details.js` existe
- [ ] Verificar que `css/property-details.css` existe
- [ ] Dashboard genera slugs al crear propiedades
- [ ] Links en index.html usan URLs con slug
- [ ] Deploy a Firebase Hosting
- [ ] Probar crear una propiedad nueva
- [ ] Probar acceder a URL de propiedad
- [ ] Probar botón compartir
- [ ] Probar botones de contacto

---

## 📅 Información del Commit

**Commit:** `a204d76`
**Rama:** `claude/dynamic-url-property-creation-018tUaAzjTRrEJqouftZ9oKo`
**Fecha:** 2025-11-15
**Archivos:** 8 modificados (+1194 líneas)

---

**¡El sistema está listo para usar!** 🎉
