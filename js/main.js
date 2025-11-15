// ========================================
// Mobile Navigation Toggle
// ========================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav__link');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');

        // Animate toggle button
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ========================================
// Search Form - Tab Switching
// ========================================
const searchTabs = document.querySelectorAll('.search-tab');
let currentSearchType = 'venta';

searchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        searchTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentSearchType = tab.dataset.type;
    });
});

// ========================================
// Search Form Submission
// ========================================
const searchForm = document.getElementById('searchForm');

if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const propertyType = document.getElementById('propertyType').value;
        const location = document.getElementById('location').value;
        const priceRange = document.getElementById('priceRange').value;

        // Scroll to properties section
        const propertiesSection = document.getElementById('propiedades');
        if (propertiesSection) {
            const headerOffset = 80;
            const elementPosition = propertiesSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }

        // Filter properties based on search criteria
        filterPropertiesBySearch(currentSearchType, propertyType, location, priceRange);

        // Show search results notification
        showNotification(`Buscando ${currentSearchType} de ${propertyType || 'propiedades'} en ${location || 'todas las ubicaciones'}...`);

        console.log('Search params:', { type: currentSearchType, propertyType, location, priceRange });
    });
}

// Function to filter properties based on search criteria
function filterPropertiesBySearch(transactionType, propertyType, location, priceRange) {
    const propertyCards = document.querySelectorAll('.property-card');
    let visibleCount = 0;

    propertyCards.forEach((card, index) => {
        let shouldShow = true;

        // Filter by transaction type (venta/alquiler)
        const cardCategory = card.dataset.category;
        if (transactionType && cardCategory !== transactionType) {
            shouldShow = false;
        }

        // Filter by property type
        if (shouldShow && propertyType) {
            const cardTitle = card.querySelector('.property-card__title').textContent.toLowerCase();
            const typeKeywords = {
                'casa': ['casa', 'villa', 'chalet'],
                'apartamento': ['apartamento', 'piso', 'penthouse'],
                'local': ['local', 'comercial'],
                'terreno': ['terreno', 'lote', 'parcela']
            };

            const keywords = typeKeywords[propertyType] || [propertyType];
            const matchesType = keywords.some(keyword => cardTitle.includes(keyword));

            if (!matchesType) {
                shouldShow = false;
            }
        }

        // Filter by location
        if (shouldShow && location) {
            const cardLocation = card.querySelector('.property-card__location').textContent.toLowerCase();
            if (!cardLocation.includes(location.toLowerCase())) {
                shouldShow = false;
            }
        }

        // Filter by price range
        if (shouldShow && priceRange) {
            const priceText = card.querySelector('.property-card__price').textContent;
            const price = parsePrice(priceText);

            if (priceRange === '0-100000' && price > 100000) {
                shouldShow = false;
            } else if (priceRange === '100000-200000' && (price < 100000 || price > 200000)) {
                shouldShow = false;
            } else if (priceRange === '200000-300000' && (price < 200000 || price > 300000)) {
                shouldShow = false;
            } else if (priceRange === '300000+' && price < 300000) {
                shouldShow = false;
            }
        }

        // Show or hide the card
        if (shouldShow) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.animation = `fadeInUp 0.5s ease ${visibleCount * 0.1}s backwards`;
            }, 10);
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Update filter buttons to show current filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === transactionType) {
            btn.classList.add('active');
        } else if (transactionType && btn.dataset.filter === 'all') {
            btn.classList.remove('active');
        }
    });

    // Show message if no results
    if (visibleCount === 0) {
        showNotification('No se encontraron propiedades con los criterios seleccionados', 'error');
    }
}

// Helper function to parse price from text
function parsePrice(priceText) {
    // Remove currency symbols, commas, and extract number
    const match = priceText.match(/[\d,]+/);
    if (match) {
        return parseInt(match[0].replace(/,/g, ''));
    }
    return 0;
}

// ========================================
// Property Filtering
// ========================================
const filterButtons = document.querySelectorAll('.filter-btn');
const propertyCards = document.querySelectorAll('.property-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.dataset.filter;

        // Filter properties with animation
        propertyCards.forEach((card, index) => {
            const category = card.dataset.category;

            if (filterValue === 'all' || category === filterValue) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s backwards`;
                }, 10);
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ========================================
// Property Card - View Details
// ========================================
const viewDetailsButtons = document.querySelectorAll('.property-card .btn--secondary');

viewDetailsButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.property-card');
        const title = card.querySelector('.property-card__title').textContent;

        showNotification(`Cargando detalles de: ${title}`);

        // Here you would typically open a modal or redirect to property details page
        console.log('View details for:', title);
    });
});

// ========================================
// Contact Form Submission
// ========================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);

        // Simulate form submission
        showNotification('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');

        // Reset form
        contactForm.reset();

        // Here you would typically send data to a server
        console.log('Form submitted');
    });
}

// ========================================
// Newsletter Form
// ========================================
const newsletterForm = document.querySelector('.newsletter__form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = newsletterForm.querySelector('input[type="email"]').value;

        if (validateEmail(email)) {
            showNotification('¡Gracias por suscribirte! Recibirás nuestras mejores ofertas.', 'success');
            newsletterForm.reset();
        } else {
            showNotification('Por favor ingresa un email válido', 'error');
        }
    });
}

// ========================================
// Scroll to Top Button
// ========================================
const scrollTopButton = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopButton.classList.add('active');
    } else {
        scrollTopButton.classList.remove('active');
    }

    // Add shadow to header on scroll
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
});

if (scrollTopButton) {
    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// Intersection Observer for Animations
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
const animateElements = document.querySelectorAll('.property-card, .service-card, .section__header');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ========================================
// Utility Functions
// ========================================

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '16px 24px',
        background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        zIndex: '9999',
        animation: 'slideInRight 0.3s ease',
        fontWeight: '500',
        maxWidth: '400px'
    });

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;

    if (!document.querySelector('style[data-notification]')) {
        style.setAttribute('data-notification', 'true');
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ========================================
// Lazy Loading Images
// ========================================
const images = document.querySelectorAll('img[loading="lazy"]');

if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ========================================
// Smooth Scroll for Navigation Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Performance Monitoring
// ========================================
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    });
}

// ========================================
// Console Welcome Message
// ========================================
console.log('%c¡Bienvenido a InmoPlus!', 'color: #2563eb; font-size: 24px; font-weight: bold;');
console.log('%cSitio desarrollado con HTML5, CSS3 y JavaScript vanilla', 'color: #6b7280; font-size: 14px;');
