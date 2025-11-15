// ========================================
// Properties Loader for Public Site
// ========================================
// This script loads properties from Firebase and displays them on the public website

// Wait for Firebase to be initialized
document.addEventListener('DOMContentLoaded', async () => {
    // Check if Firebase is configured
    if (!window.firebaseDB) {
        console.warn('Firebase not configured - using static properties');
        return;
    }

    await loadPropertiesFromFirebase();
});

// ========================================
// Load Properties from Firebase
// ========================================
async function loadPropertiesFromFirebase() {
    const propertiesGrid = document.getElementById('propertiesGrid');

    if (!propertiesGrid) {
        return; // Not on properties page
    }

    try {
        // Show loading state
        propertiesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <div class="spinner-large" style="width: 48px; height: 48px; border: 4px solid #e5e7eb; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 20px;"></div>
                <p style="color: #6b7280;">Cargando propiedades...</p>
            </div>
        `;

        // Load all properties (you can add filters here)
        const snapshot = await firebaseDB
            .collection('properties')
            .orderBy('createdAt', 'desc')
            .limit(20) // Limit to 20 properties
            .get();

        if (snapshot.empty) {
            // No properties found - show static ones or empty state
            propertiesGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <div style="font-size: 4rem; margin-bottom: 20px; opacity: 0.5;">🏠</div>
                    <h3 style="color: #1f2937; margin-bottom: 10px;">No hay propiedades disponibles</h3>
                    <p style="color: #6b7280;">Vuelve pronto para ver nuevas propiedades</p>
                </div>
            `;
            return;
        }

        // Display properties
        const properties = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        displayPropertiesOnSite(properties);

        // Re-attach filter functionality
        attachFilterListeners(properties);

    } catch (error) {
        console.error('Error loading properties from Firebase:', error);

        // Show error message but keep static properties as fallback
        propertiesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: #fee2e2; border-radius: 12px; border: 2px solid #ef4444;">
                <p style="color: #991b1b; font-weight: 600;">No se pudieron cargar las propiedades desde la base de datos</p>
                <p style="color: #991b1b; font-size: 0.9rem; margin-top: 8px;">Mostrando propiedades estáticas de ejemplo</p>
            </div>
        `;

        // Fallback to static HTML properties after 2 seconds
        setTimeout(() => {
            location.reload();
        }, 3000);
    }
}

// ========================================
// Display Properties on Public Site
// ========================================
function displayPropertiesOnSite(properties) {
    const propertiesGrid = document.getElementById('propertiesGrid');

    propertiesGrid.innerHTML = properties.map(property => {
        const badgeClass = property.status === 'venta' ? 'property-card__badge--sale' : 'property-card__badge--rent';
        const badgeText = property.status === 'venta' ? 'En Venta' : 'En Alquiler';
        const image = (property.images && property.images[0])
            ? property.images[0]
            : 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop';

        const priceText = property.status === 'alquiler'
            ? `$${formatNumber(property.price)}/mes`
            : `$${formatNumber(property.price)}`;

        // Generate URL with slug or fallback to ID
        const propertyUrl = `/propiedad/${property.slug || property.id}`;

        return `
            <article class="property-card" data-category="${property.status}">
                <div class="property-card__badge ${badgeClass}">${badgeText}</div>
                <div class="property-card__image">
                    <img src="${image}" alt="${property.title}" loading="lazy">
                </div>
                <div class="property-card__content">
                    <h3 class="property-card__title">${property.title}</h3>
                    <p class="property-card__location">📍 ${property.location}</p>
                    <div class="property-card__features">
                        ${property.bedrooms ? `<span class="feature">🛏️ ${property.bedrooms} Hab</span>` : ''}
                        ${property.bathrooms ? `<span class="feature">🚿 ${property.bathrooms} Baños</span>` : ''}
                        ${property.area ? `<span class="feature">📐 ${property.area} m²</span>` : ''}
                    </div>
                    <div class="property-card__footer">
                        <p class="property-card__price">${priceText}</p>
                        <a href="${propertyUrl}" class="btn btn--secondary">Ver Detalles</a>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

// ========================================
// Attach Filter Listeners
// ========================================
function attachFilterListeners(allProperties) {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        // Remove old listeners by cloning
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            newButton.classList.add('active');

            const filterValue = newButton.dataset.filter;

            // Filter properties
            const filtered = filterValue === 'all'
                ? allProperties
                : allProperties.filter(p => p.status === filterValue);

            displayPropertiesOnSite(filtered);
        });
    });
}

// ========================================
// View Property Details - Redirect to details page
// ========================================
window.viewPropertyDetails = async function(propertyId) {
    try {
        const doc = await firebaseDB.collection('properties').doc(propertyId).get();

        if (!doc.exists) {
            alert('Propiedad no encontrada');
            return;
        }

        const property = doc.data();

        // Redirect to property details page using slug
        const slug = property.slug || propertyId;
        window.location.href = `/propiedad/${slug}`;

    } catch (error) {
        console.error('Error loading property details:', error);
        alert('Error al cargar los detalles de la propiedad');
    }
};

// ========================================
// Utility Functions
// ========================================
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}
