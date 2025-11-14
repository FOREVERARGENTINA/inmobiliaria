# InmoPlus - Sitio Web de Inmobiliaria

Sitio web moderno, optimizado y responsive para una inmobiliaria, desarrollado con HTML5, CSS3 y JavaScript vanilla.

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
├── index.html          # Página principal
├── css/
│   └── styles.css     # Estilos principales
├── js/
│   └── main.js        # JavaScript interactivo
├── images/            # Imágenes (actualmente usando Unsplash CDN)
├── .gitignore         # Archivos ignorados por Git
└── README.md          # Este archivo
```

## Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con Flexbox y Grid
- **JavaScript ES6+** - Funcionalidad interactiva
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
