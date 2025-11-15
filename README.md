# InmoPlus - Sitio Web de Inmobiliaria

Sitio web moderno, optimizado y responsive para una inmobiliaria, desarrollado con HTML5, CSS3, JavaScript vanilla y **Firebase**.

## 🚀 Nuevo: Sistema de Gestión Completo con Firebase

### Características Principales
- ✅ **Dashboard de Administración** - Panel completo para gestionar propiedades
- ✅ **Sistema de Autenticación** - Login y registro con Firebase Auth
- ✅ **CRUD de Propiedades** - Crear, editar y eliminar propiedades en tiempo real
- ✅ **Subida de Imágenes** - Múltiples imágenes por propiedad con Firebase Storage
- ✅ **Base de Datos en Tiempo Real** - Firestore para almacenar propiedades
- ✅ **Filtros y Búsqueda** - Sistema avanzado de filtrado
- ✅ **Estadísticas** - Dashboard con métricas de tus propiedades
- ✅ **Responsive** - Dashboard funciona perfectamente en móviles

### Cómo Empezar

#### 1. Configurar Firebase (Requerido)

Sigue la guía completa en **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** para:
1. Crear cuenta en Firebase
2. Configurar Authentication, Firestore y Storage
3. Obtener credenciales y configurar el proyecto

#### 2. Abrir el Sitio

```bash
# Opción 1: Servidor Python
python -m http.server 8000

# Opción 2: Node.js
npx serve

# Opción 3: PHP
php -S localhost:8000
```

Luego abre `http://localhost:8000` en tu navegador.

#### 3. Acceder al Dashboard

1. Click en **"🔐 Admin"** en el menú de navegación
2. Regístrate con tu email y contraseña
3. ¡Comienza a agregar propiedades!

### Páginas del Sistema

- **`index.html`** - Sitio público con propiedades (carga desde Firebase)
- **`login.html`** - Página de login y registro
- **`dashboard.html`** - Panel de administración (requiere autenticación)

## Características

### Diseño y UI/UX
- **Diseño moderno y atractivo** con gradientes y sombras suaves
- **Totalmente responsive** - se adapta a todos los dispositivos (móvil, tablet, desktop)
- **Animaciones suaves** y transiciones para mejor experiencia de usuario
- **Tipografía clara** usando Google Fonts (Poppins)
- **Colores profesionales** con sistema de variables CSS

### Funcionalidades

#### Navegación
- Menú responsive con toggle para móviles
- Navegación suave (smooth scroll) entre secciones
- Header fijo con efecto de sombra al hacer scroll

#### Hero Section
- Banner principal con imagen de fondo
- Buscador integrado con tabs (Comprar/Alquilar)
- Filtros de búsqueda (tipo de propiedad, ubicación, precio)

#### Propiedades
- Grid responsive de tarjetas de propiedades
- Filtros dinámicos (Todas/En Venta/En Alquiler)
- Imágenes optimizadas con lazy loading
- Badges distintivos (Venta/Alquiler)
- Efectos hover en las tarjetas
- Información detallada (habitaciones, baños, metros cuadrados)

#### Secciones Adicionales
- **Servicios**: Cuatro servicios principales con iconos
- **Nosotros**: Información de la empresa con estadísticas
- **Contacto**: Formulario de contacto completo e información de contacto

#### Interactividad
- Sistema de notificaciones para acciones del usuario
- Validación de formularios
- Filtrado de propiedades en tiempo real
- Botón de scroll to top
- Animaciones on scroll

### Optimización

#### Performance
- **JavaScript vanilla** (sin frameworks pesados)
- **Lazy loading** de imágenes
- **Código optimizado** y minificable
- **CSS con variables** para fácil mantenimiento
- **GPU acceleration** para animaciones suaves

#### SEO
- Meta tags optimizados
- HTML5 semántico
- Estructura clara y accesible
- Alt text en imágenes

#### Accesibilidad
- Diseño semántico
- Contraste de colores adecuado
- Soporte para prefers-reduced-motion
- Formularios accesibles

## Estructura del Proyecto

```
inmobiliaria/
├── index.html              # Página principal (sitio público)
├── login.html              # Página de login/registro
├── dashboard.html          # Dashboard de administración
├── FIREBASE_SETUP.md       # Guía de configuración de Firebase
├── README.md               # Este archivo
├── .gitignore              # Archivos ignorados por Git
├── css/
│   ├── styles.css          # Estilos principales del sitio
│   ├── auth.css            # Estilos de autenticación
│   └── dashboard.css       # Estilos del dashboard
├── js/
│   ├── main.js             # JavaScript del sitio público
│   ├── firebase-config.js  # Configuración de Firebase
│   ├── auth.js             # Lógica de autenticación
│   ├── dashboard.js        # Lógica del dashboard (CRUD)
│   └── properties-loader.js # Carga propiedades desde Firebase
└── images/                 # Imágenes locales (opcional)
```

## Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con Flexbox y Grid
- **JavaScript ES6+** - Funcionalidad interactiva (vanilla JS, sin frameworks)
- **Firebase** - Backend completo
  - **Firebase Authentication** - Sistema de usuarios
  - **Cloud Firestore** - Base de datos NoSQL
  - **Firebase Storage** - Almacenamiento de imágenes
- **Google Fonts** - Tipografía Poppins
- **Unsplash** - Imágenes placeholder de alta calidad

## Instalación y Uso

### Opción 1: Abrir directamente
1. Clona este repositorio:
   ```bash
   git clone [URL-del-repositorio]
   ```
2. Abre `index.html` en tu navegador

### Opción 2: Servidor local
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (npx)
npx serve

# Con PHP
php -S localhost:8000
```

Luego abre `http://localhost:8000` en tu navegador.

## Personalización

### Colores
Edita las variables CSS en `css/styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #10b981;
    --accent-color: #f59e0b;
    /* ... más variables */
}
```

### Contenido
- **Propiedades**: Edita las tarjetas de propiedades en `index.html` (sección `#propiedades`)
- **Servicios**: Modifica la sección de servicios en `index.html` (sección `#servicios`)
- **Información de contacto**: Actualiza los datos en la sección `#contacto`

### Imágenes
Reemplaza las URLs de Unsplash en `index.html` con tus propias imágenes:
```html
<!-- Ejemplo -->
<img src="tu-imagen.jpg" alt="Descripción">
```

## Características Responsive

### Breakpoints
- **Desktop**: > 968px
- **Tablet**: 640px - 968px
- **Mobile**: < 640px

### Adaptaciones Móviles
- Menú hamburguesa
- Grid de una columna para propiedades
- Formularios apilados verticalmente
- Fuentes y espaciados optimizados

## Navegadores Soportados

- Chrome (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Edge (últimas 2 versiones)

## Funcionalidades JavaScript

### Interacciones Principales
- ✅ Toggle de menú móvil
- ✅ Filtrado de propiedades
- ✅ Búsqueda de propiedades
- ✅ Validación de formularios
- ✅ Notificaciones de usuario
- ✅ Scroll to top
- ✅ Smooth scrolling
- ✅ Lazy loading de imágenes
- ✅ Animaciones on scroll (Intersection Observer)

## Próximas Mejoras Sugeridas

- [ ] Backend para almacenar propiedades
- [ ] Sistema de búsqueda avanzada
- [ ] Página de detalles de propiedad
- [ ] Sistema de favoritos
- [ ] Integración con mapas (Google Maps / Mapbox)
- [ ] Panel de administración
- [ ] Sistema de usuarios y autenticación
- [ ] Galería de imágenes para cada propiedad
- [ ] Calculadora de hipoteca
- [ ] Chat en vivo
- [ ] Integración con redes sociales
- [ ] Blog de noticias inmobiliarias

## Optimizaciones Implementadas

### Performance
- ⚡ Sin dependencias externas pesadas
- ⚡ Lazy loading de imágenes
- ⚡ CSS optimizado con variables
- ⚡ JavaScript vanilla (sin jQuery)
- ⚡ Animaciones con GPU acceleration

### SEO
- 🔍 Meta tags completos
- 🔍 HTML semántico
- 🔍 URLs amigables (preparado para)
- 🔍 Estructura de headings correcta

### Accesibilidad
- ♿ Formularios accesibles
- ♿ Contraste de colores WCAG AA
- ♿ Soporte para motion reduce
- ♿ Navegación por teclado

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Contacto y Soporte

Para preguntas o sugerencias sobre este proyecto, por favor abre un issue en el repositorio.

---

**Desarrollado con ❤️ para el sector inmobiliario**
