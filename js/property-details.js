// ========================================
// Property Details Page
// ========================================

let currentProperty = null;
let currentImageIndex = 0;
let images = [];

// ========================================
// Initialize Page
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    const slug = getSlugFromURL();

    if (!slug) {
        showError();
        return;
    }

    await loadProperty(slug);
});

// ========================================
// Get Slug from URL
// ========================================
function getSlugFromURL() {
    // Support both formats:
    // /propiedad/slug-here
    // /propiedad.html?slug=slug-here

    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    // Check query parameter first
    if (params.has('slug')) {
        return params.get('slug');
    }

    // Check path format: /propiedad/slug-here
    const parts = path.split('/').filter(p => p);
    if (parts.length >= 2 && parts[0] === 'propiedad') {
        return parts[1];
    }

    // Fallback: check if last part is a slug (not .html file)
    const lastPart = parts[parts.length - 1];
    if (lastPart && !lastPart.endsWith('.html')) {
        return lastPart;
    }

    return null;
}

// ========================================
// Load Property Data
// ========================================
async function loadProperty(slug) {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const propertyDetails = document.getElementById('propertyDetails');

    try {
        // Get property by slug
        const property = await getPropertyBySlug(slug);

        if (!property) {
            showError();
            return;
        }

        currentProperty = property;
        images = property.images || [];

        // Hide loading, show content
        loadingState.style.display = 'none';
        propertyDetails.style.display = 'block';

        // Populate page
        updatePageTitle(property);
        updateMetaTags(property);
        displayPropertyHeader(property);
        displayGallery(property);
        displayPropertyInfo(property);
        setupContactButtons(property);
        loadRelatedProperties(property);

    } catch (error) {
        console.error('Error loading property:', error);
        showError();
    }
}

// ========================================
// Show Error State
// ========================================
function showError() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'flex';
    document.getElementById('propertyDetails').style.display = 'none';
}

// ========================================
// Update Page Title and Meta Tags
// ========================================
function updatePageTitle(property) {
    document.title = `${property.title} - InmoPlus`;
    document.getElementById('breadcrumbTitle').textContent = property.title;
}

function updateMetaTags(property) {
    // Update Open Graph tags for social sharing
    const metaTitle = document.querySelector('meta[property="og:title"]');
    const metaDesc = document.querySelector('meta[property="og:description"]');
    const metaImage = document.querySelector('meta[property="og:image"]');
    const metaUrl = document.querySelector('meta[property="og:url"]');

    if (metaTitle) metaTitle.content = property.title;
    if (metaDesc) metaDesc.content = property.description?.substring(0, 200) || '';
    if (metaImage && property.images?.[0]) metaImage.content = property.images[0];
    if (metaUrl) metaUrl.content = window.location.href;
}

// ========================================
// Display Property Header
// ========================================
function displayPropertyHeader(property) {
    const statusBadge = document.getElementById('propertyStatusBadge');
    statusBadge.textContent = property.status === 'venta' ? 'En Venta' : 'En Alquiler';
    statusBadge.className = `property-status-badge ${property.status}`;

    document.getElementById('propertyTitle').textContent = property.title;
    document.getElementById('propertyLocation').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${property.location}`;
    document.getElementById('propertyPrice').textContent = `$${formatNumber(property.price)}`;
}

// ========================================
// Display Gallery
// ========================================
function displayGallery(property) {
    if (!property.images || property.images.length === 0) {
        document.getElementById('galleryMainImage').src = 'https://via.placeholder.com/800x600?text=Sin+Imagen';
        return;
    }

    // Set main image
    updateMainImage(0);

    // Create thumbnails
    const thumbnailsContainer = document.getElementById('galleryThumbnails');
    thumbnailsContainer.innerHTML = property.images.map((img, index) => `
        <div class="gallery-thumbnail ${index === 0 ? 'active' : ''}" onclick="selectImage(${index})">
            <img src="${img}" alt="Imagen ${index + 1}">
        </div>
    `).join('');

    // Setup navigation
    document.getElementById('galleryPrev').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateMainImage(currentImageIndex);
    });

    document.getElementById('galleryNext').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateMainImage(currentImageIndex);
    });
}

function updateMainImage(index) {
    currentImageIndex = index;
    const mainImage = document.getElementById('galleryMainImage');
    mainImage.src = images[index];

    // Update active thumbnail
    document.querySelectorAll('.gallery-thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

window.selectImage = function(index) {
    updateMainImage(index);
};

// ========================================
// Display Property Information
// ========================================
function displayPropertyInfo(property) {
    // Description
    document.getElementById('propertyDescription').textContent = property.description || 'Sin descripción disponible.';

    // Features
    const featuresHtml = `
        ${property.bedrooms ? `
            <div class="feature-item">
            <div class="feature-icon"><i class="fa-solid fa-bed"></i></div>
            <div class="feature-label">Habitaciones</div>
            <div class="feature-value">${property.bedrooms}</div>
        </div>
        ` : ''}
        ${property.bathrooms ? `
            <div class="feature-item">
            <div class="feature-icon"><i class="fa-solid fa-bath"></i></div>
            <div class="feature-label">Baños</div>
            <div class="feature-value">${property.bathrooms}</div>
        </div>
        ` : ''}
        ${property.area ? `
            <div class="feature-item">
            <div class="feature-icon"><i class="fa-solid fa-ruler-combined"></i></div>
            <div class="feature-label">Área</div>
            <div class="feature-value">${property.area} m²</div>
        </div>
        ` : ''}
            <div class="feature-item">
            <div class="feature-icon">${getTypeIcon(property.type)}</div>
            <div class="feature-label">Tipo</div>
            <div class="feature-value">${getTypeName(property.type)}</div>
        </div>
    `;
    document.getElementById('propertyFeatures').innerHTML = featuresHtml;

    // Details
    const detailsHtml = `
        <div class="detail-item">
            <span class="detail-label">Tipo de propiedad</span>
            <span class="detail-value">${getTypeName(property.type)}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Estado</span>
            <span class="detail-value">${property.status === 'venta' ? 'En Venta' : 'En Alquiler'}</span>
        </div>
        ${property.bedrooms ? `
        <div class="detail-item">
            <span class="detail-label">Habitaciones</span>
            <span class="detail-value">${property.bedrooms}</span>
        </div>
        ` : ''}
        ${property.bathrooms ? `
        <div class="detail-item">
            <span class="detail-label">Baños</span>
            <span class="detail-value">${property.bathrooms}</span>
        </div>
        ` : ''}
        ${property.area ? `
        <div class="detail-item">
            <span class="detail-label">Superficie</span>
            <span class="detail-value">${property.area} m²</span>
        </div>
        ` : ''}
        <div class="detail-item">
            <span class="detail-label">Ubicación</span>
            <span class="detail-value">${property.location}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Precio</span>
            <span class="detail-value">$${formatNumber(property.price)}</span>
        </div>
    `;
    document.getElementById('propertyDetailsList').innerHTML = detailsHtml;
}

// ========================================
// Setup Contact Buttons
// ========================================
function setupContactButtons(property) {
    const message = `Hola, estoy interesado en la propiedad: ${property.title}\n${window.location.href}`;
    const encodedMessage = encodeURIComponent(message);

    // WhatsApp button
    document.getElementById('whatsappBtn').addEventListener('click', () => {
        window.open(`https://wa.me/5491112345678?text=${encodedMessage}`, '_blank');
    });

    // Email button
    document.getElementById('emailBtn').addEventListener('click', () => {
        const subject = encodeURIComponent(`Consulta sobre: ${property.title}`);
        window.location.href = `mailto:info@inmoplus.com?subject=${subject}&body=${encodedMessage}`;
    });

    // Contact button (header)
    document.getElementById('contactBtn').addEventListener('click', () => {
        window.open(`https://wa.me/5491112345678?text=${encodedMessage}`, '_blank');
    });

    // Share button
    document.getElementById('shareBtn').addEventListener('click', async () => {
        const url = window.location.href;

        // Try native share API first
        if (navigator.share) {
            try {
                await navigator.share({
                    title: property.title,
                    text: property.description?.substring(0, 100) || '',
                    url: url
                });
                showToast('success', 'Compartido', 'Enlace compartido exitosamente');
                return;
            } catch (error) {
                // User cancelled or error occurred, fall back to clipboard
            }
        }

        // Fallback: copy to clipboard
        try {
            await navigator.clipboard.writeText(url);
            showToast('success', 'Copiado', 'Enlace copiado al portapapeles');
        } catch (error) {
            showToast('error', 'Error', 'No se pudo copiar el enlace');
        }
    });
}

// ========================================
// Load Related Properties
// ========================================
async function loadRelatedProperties(property) {
    const container = document.getElementById('relatedPropertiesGrid');

    try {
        const snapshot = await firebaseDB
            .collection('properties')
            .where('type', '==', property.type)
            .where('status', '==', property.status)
            .limit(4)
            .get();

        const related = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(p => p.id !== property.id)
            .slice(0, 3);

        if (related.length === 0) {
            container.innerHTML = '<p style="color: var(--text-light);">No hay propiedades similares disponibles.</p>';
            return;
        }

        container.innerHTML = related.map(prop => {
            const propertyUrl = `/propiedad/${prop.slug || prop.id}`;
            return `
                <article class="property-card">
                    <div class="property-card__badge property-card__badge--${prop.status === 'venta' ? 'sale' : 'rent'}">
                        ${prop.status === 'venta' ? 'En Venta' : 'En Alquiler'}
                    </div>
                    <div class="property-card__image">
                        <img src="${prop.images?.[0] || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}" alt="${prop.title}">
                    </div>
                    <div class="property-card__content">
                        <h3 class="property-card__title">${prop.title}</h3>
                        <p class="property-card__location"><i class="fa-solid fa-location-dot"></i> ${prop.location}</p>
                        <div class="property-card__features">
                            ${prop.bedrooms ? `<span><i class="fa-solid fa-bed"></i> ${prop.bedrooms}</span>` : ''}
                            ${prop.bathrooms ? `<span><i class="fa-solid fa-bath"></i> ${prop.bathrooms}</span>` : ''}
                            ${prop.area ? `<span><i class="fa-solid fa-ruler-combined"></i> ${prop.area} m²</span>` : ''}
                        </div>
                        <div class="property-card__footer">
                            <span class="property-card__price">$${formatNumber(prop.price)}</span>
                            <a href="${propertyUrl}" class="btn btn--primary btn--small">Ver Detalles</a>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

    } catch (error) {
        console.error('Error loading related properties:', error);
        container.innerHTML = '<p style="color: var(--text-light);">Error al cargar propiedades similares.</p>';
    }
}

// ========================================
// Utility Functions
// ========================================
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

function getTypeName(type) {
    const types = {
        'casa': 'Casa',
        'apartamento': 'Apartamento',
        'local': 'Local Comercial',
        'terreno': 'Terreno'
    };
    return types[type] || type;
}

function getTypeIcon(type) {
    const icons = {
        'casa': '<i class="fa-solid fa-house"></i>',
        'apartamento': '<i class="fa-solid fa-building"></i>',
        'local': '<i class="fa-solid fa-store"></i>',
        'terreno': '<i class="fa-solid fa-tree"></i>'
    };
    return icons[type] || '<i class="fa-solid fa-house"></i>';
}

function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = '';
    switch (type) {
        case 'success': icon = '<i class="fa-solid fa-check"></i>'; break;
        case 'error': icon = '<i class="fa-solid fa-xmark"></i>'; break;
        case 'warning': icon = '<i class="fa-solid fa-triangle-exclamation"></i>'; break;
        default: icon = '<i class="fa-solid fa-info"></i>';
    }

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">×</button>
    `;

    container.appendChild(toast);

    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });

    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}
