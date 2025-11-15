// ========================================
// Dashboard - Property Management System
// ========================================

let currentUser = null;
let properties = [];
let editingPropertyId = null;
let selectedImages = [];
let imageUrls = [];

// ========================================
// Authentication Check
// ========================================
firebaseAuth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        loadUserInfo();
        await loadProperties();
        updateStats();
    } else {
        // Not logged in, redirect to login
        window.location.href = 'login.html';
    }
});

// ========================================
// Load User Information
// ========================================
async function loadUserInfo() {
    const userNameEl = document.querySelector('.user-name');
    const userEmailEl = document.querySelector('.user-email');

    if (currentUser) {
        userNameEl.textContent = currentUser.displayName || 'Usuario';
        userEmailEl.textContent = currentUser.email;

        // Load from Firestore if available
        try {
            const userDoc = await firebaseDB.collection('users').doc(currentUser.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                if (userData.name) {
                    userNameEl.textContent = userData.name;
                }
            }
        } catch (error) {
            console.error('Error loading user info:', error);
        }
    }
}

// ========================================
// Logout
// ========================================
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    try {
        await firebaseAuth.signOut();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
        showToast('error', 'Error', 'No se pudo cerrar sesión');
    }
});

// ========================================
// Sidebar Navigation
// ========================================
const navItems = document.querySelectorAll('.nav-item[data-section]');
const sections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('pageTitle');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();

        const sectionId = item.dataset.section;

        // Update active nav item
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Show corresponding section
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(`${sectionId}-section`)?.classList.add('active');

        // Update page title
        const titles = {
            'properties': 'Propiedades',
            'add-property': 'Nueva Propiedad',
            'stats': 'Estadísticas'
        };
        pageTitle.textContent = titles[sectionId] || 'Dashboard';

        // Close sidebar on mobile
        if (window.innerWidth <= 968) {
            sidebar.classList.remove('active');
        }
    });
});

// ========================================
// Mobile Sidebar Toggle
// ========================================
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarClose = document.getElementById('sidebarClose');

sidebarToggle?.addEventListener('click', () => {
    sidebar.classList.add('active');
});

sidebarClose?.addEventListener('click', () => {
    sidebar.classList.remove('active');
});

// ========================================
// Load Properties from Firebase
// ========================================
async function loadProperties() {
    const propertiesList = document.getElementById('propertiesList');
    propertiesList.innerHTML = `
        <div class="loading-state">
            <div class="spinner-large"></div>
            <p>Cargando propiedades...</p>
        </div>
    `;

    try {
        const snapshot = await firebaseDB
            .collection('properties')
            .where('userId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .get();

        properties = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        displayProperties(properties);
        updateStats();
    } catch (error) {
        console.error('Error loading properties:', error);
        propertiesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <h3>Error al cargar propiedades</h3>
                <p>${error.message}</p>
                <button class="btn btn-primary" onclick="loadProperties()">Reintentar</button>
            </div>
        `;
    }
}

// ========================================
// Display Properties
// ========================================
function displayProperties(propertiesToShow) {
    const propertiesList = document.getElementById('propertiesList');

    if (propertiesToShow.length === 0) {
        propertiesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🏠</div>
                <h3>No hay propiedades</h3>
                <p>Comienza agregando tu primera propiedad</p>
                <button class="btn btn-primary" onclick="showAddPropertyForm()">Agregar Propiedad</button>
            </div>
        `;
        return;
    }

    propertiesList.innerHTML = propertiesToShow.map(property => `
        <div class="property-item" data-id="${property.id}">
            <img
                src="${property.images && property.images[0] ? property.images[0] : 'https://via.placeholder.com/400x300?text=Sin+Imagen'}"
                alt="${property.title}"
                class="property-image"
            >
            <div class="property-body">
                <span class="property-status-badge ${property.status}">${property.status === 'venta' ? 'En Venta' : 'En Alquiler'}</span>
                <h3 class="property-title">${property.title}</h3>
                <p class="property-location">📍 ${property.location}</p>

                <div class="property-details">
                    ${property.bedrooms ? `<span class="property-detail">🛏️ ${property.bedrooms}</span>` : ''}
                    ${property.bathrooms ? `<span class="property-detail">🚿 ${property.bathrooms}</span>` : ''}
                    ${property.area ? `<span class="property-detail">📐 ${property.area} m²</span>` : ''}
                </div>

                <p class="property-price">$${formatNumber(property.price)}</p>

                <div class="property-actions">
                    <button class="btn-icon btn-edit" onclick="editProperty('${property.id}')">
                        ✏️ Editar
                    </button>
                    <button class="btn-icon btn-delete" onclick="confirmDeleteProperty('${property.id}')">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ========================================
// Search and Filter
// ========================================
const searchInput = document.getElementById('searchProperties');
const filterType = document.getElementById('filterType');
const filterStatus = document.getElementById('filterStatus');

searchInput?.addEventListener('input', filterProperties);
filterType?.addEventListener('change', filterProperties);
filterStatus?.addEventListener('change', filterProperties);

function filterProperties() {
    const searchTerm = searchInput.value.toLowerCase();
    const typeFilter = filterType.value;
    const statusFilter = filterStatus.value;

    const filtered = properties.filter(property => {
        const matchesSearch = property.title.toLowerCase().includes(searchTerm) ||
                            property.location.toLowerCase().includes(searchTerm);
        const matchesType = !typeFilter || property.type === typeFilter;
        const matchesStatus = !statusFilter || property.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    displayProperties(filtered);
}

// ========================================
// Add Property Button
// ========================================
document.getElementById('addPropertyBtn')?.addEventListener('click', showAddPropertyForm);

function showAddPropertyForm() {
    // Switch to add property section
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById('add-property-section').classList.add('active');

    navItems.forEach(nav => nav.classList.remove('active'));
    document.querySelector('.nav-item[data-section="add-property"]')?.classList.add('active');

    pageTitle.textContent = 'Nueva Propiedad';

    // Reset form
    resetPropertyForm();
}

// ========================================
// Property Form
// ========================================
const propertyForm = document.getElementById('propertyForm');
const cancelFormBtns = [
    document.getElementById('cancelFormBtn'),
    document.getElementById('cancelFormBtn2')
];

cancelFormBtns.forEach(btn => {
    btn?.addEventListener('click', () => {
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById('properties-section').classList.add('active');

        navItems.forEach(nav => nav.classList.remove('active'));
        document.querySelector('.nav-item[data-section="properties"]')?.classList.add('active');

        pageTitle.textContent = 'Propiedades';
        resetPropertyForm();
    });
});

function resetPropertyForm() {
    propertyForm.reset();
    editingPropertyId = null;
    selectedImages = [];
    imageUrls = [];
    document.getElementById('propertyId').value = '';
    document.getElementById('formTitle').textContent = 'Nueva Propiedad';
    document.getElementById('imagePreview').innerHTML = '';
}

// ========================================
// Image Upload Handling
// ========================================
const propertyImagesInput = document.getElementById('propertyImages');
const imagePreview = document.getElementById('imagePreview');

propertyImagesInput?.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    handleImageFiles(files);
});

// Drag and drop
const uploadArea = document.querySelector('.image-upload-area');

uploadArea?.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--primary-color)';
    uploadArea.style.background = 'rgba(37, 99, 235, 0.05)';
});

uploadArea?.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '';
    uploadArea.style.background = '';
});

uploadArea?.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '';
    uploadArea.style.background = '';

    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    handleImageFiles(files);
});

function handleImageFiles(files) {
    selectedImages = [...selectedImages, ...files];
    displayImagePreviews();
}

function displayImagePreviews() {
    imagePreview.innerHTML = '';

    // Show existing images (when editing)
    imageUrls.forEach((url, index) => {
        const div = document.createElement('div');
        div.className = 'image-preview-item';
        div.innerHTML = `
            <img src="${url}" alt="Property image">
            <button type="button" class="image-preview-remove" onclick="removeExistingImage(${index})">×</button>
        `;
        imagePreview.appendChild(div);
    });

    // Show new images
    selectedImages.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.className = 'image-preview-item';
            div.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="image-preview-remove" onclick="removeNewImage(${index})">×</button>
            `;
            imagePreview.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}

window.removeNewImage = function(index) {
    selectedImages.splice(index, 1);
    displayImagePreviews();
};

window.removeExistingImage = function(index) {
    imageUrls.splice(index, 1);
    displayImagePreviews();
};

// ========================================
// Upload Images to Firebase Storage
// ========================================
async function uploadImages(propertyId) {
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    if (selectedImages.length === 0) {
        return imageUrls; // Return existing images if no new images
    }

    uploadProgress.style.display = 'block';

    const uploadedUrls = [...imageUrls]; // Keep existing images

    for (let i = 0; i < selectedImages.length; i++) {
        const file = selectedImages[i];
        const fileName = `${propertyId}_${Date.now()}_${i}.${file.name.split('.').pop()}`;
        const storageRef = firebaseStorage.ref(`properties/${propertyId}/${fileName}`);

        try {
            // Upload file
            const uploadTask = storageRef.put(file);

            // Track progress
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = ((i + (snapshot.bytesTransferred / snapshot.totalBytes)) / selectedImages.length) * 100;
                    progressFill.style.width = `${progress}%`;
                    progressText.textContent = `Subiendo imagen ${i + 1} de ${selectedImages.length}...`;
                }
            );

            await uploadTask;

            // Get download URL
            const downloadURL = await storageRef.getDownloadURL();
            uploadedUrls.push(downloadURL);

        } catch (error) {
            console.error('Error uploading image:', error);
            showToast('error', 'Error', `No se pudo subir la imagen ${i + 1}`);
        }
    }

    uploadProgress.style.display = 'none';
    progressFill.style.width = '0%';

    return uploadedUrls;
}

// ========================================
// Save Property (Create or Update)
// ========================================
propertyForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = propertyForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    try {
        // Show loader
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        submitBtn.disabled = true;

        // Get form data
        const title = document.getElementById('propertyTitle').value;

        const propertyData = {
            title: title,
            type: document.getElementById('propertyType').value,
            status: document.getElementById('propertyStatus').value,
            description: document.getElementById('propertyDescription').value,
            location: document.getElementById('propertyLocation').value,
            price: parseFloat(document.getElementById('propertyPrice').value),
            bedrooms: parseInt(document.getElementById('propertyBedrooms').value) || 0,
            bathrooms: parseInt(document.getElementById('propertyBathrooms').value) || 0,
            area: parseFloat(document.getElementById('propertyArea').value) || 0,
            userId: currentUser.uid,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Generate unique slug from title
        const slug = await generateUniqueSlug(title, editingPropertyId);
        propertyData.slug = slug;

        if (editingPropertyId) {
            // Update existing property
            const images = await uploadImages(editingPropertyId);
            propertyData.images = images;

            await firebaseDB.collection('properties').doc(editingPropertyId).update(propertyData);
            showToast('success', 'Actualizado', 'Propiedad actualizada exitosamente');

        } else {
            // Create new property
            propertyData.createdAt = firebase.firestore.FieldValue.serverTimestamp();

            const docRef = await firebaseDB.collection('properties').add(propertyData);

            // Upload images with the new document ID
            const images = await uploadImages(docRef.id);

            // Update document with image URLs
            await docRef.update({ images });

            showToast('success', 'Creado', 'Propiedad creada exitosamente');
        }

        // Reload properties and go back to list
        await loadProperties();
        cancelFormBtns[0].click();

    } catch (error) {
        console.error('Error saving property:', error);
        showToast('error', 'Error', 'No se pudo guardar la propiedad: ' + error.message);
    } finally {
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }
});

// ========================================
// Edit Property
// ========================================
window.editProperty = async function(propertyId) {
    try {
        const doc = await firebaseDB.collection('properties').doc(propertyId).get();

        if (!doc.exists) {
            showToast('error', 'Error', 'Propiedad no encontrada');
            return;
        }

        const property = doc.data();
        editingPropertyId = propertyId;

        // Fill form
        document.getElementById('propertyId').value = propertyId;
        document.getElementById('propertyTitle').value = property.title || '';
        document.getElementById('propertyType').value = property.type || '';
        document.getElementById('propertyStatus').value = property.status || '';
        document.getElementById('propertyDescription').value = property.description || '';
        document.getElementById('propertyLocation').value = property.location || '';
        document.getElementById('propertyPrice').value = property.price || '';
        document.getElementById('propertyBedrooms').value = property.bedrooms || '';
        document.getElementById('propertyBathrooms').value = property.bathrooms || '';
        document.getElementById('propertyArea').value = property.area || '';

        // Set existing images
        imageUrls = property.images || [];
        selectedImages = [];
        displayImagePreviews();

        // Switch to form
        document.getElementById('formTitle').textContent = 'Editar Propiedad';
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById('add-property-section').classList.add('active');

        navItems.forEach(nav => nav.classList.remove('active'));
        document.querySelector('.nav-item[data-section="add-property"]')?.classList.add('active');

        pageTitle.textContent = 'Editar Propiedad';

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Error loading property:', error);
        showToast('error', 'Error', 'No se pudo cargar la propiedad');
    }
};

// ========================================
// Delete Property
// ========================================
let propertyToDelete = null;
const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');

window.confirmDeleteProperty = function(propertyId) {
    propertyToDelete = propertyId;
    deleteModal.classList.add('active');
};

cancelDeleteBtn?.addEventListener('click', () => {
    deleteModal.classList.remove('active');
    propertyToDelete = null;
});

confirmDeleteBtn?.addEventListener('click', async () => {
    if (!propertyToDelete) return;

    try {
        // Delete property document
        await firebaseDB.collection('properties').doc(propertyToDelete).delete();

        // Delete images from storage
        const property = properties.find(p => p.id === propertyToDelete);
        if (property && property.images) {
            for (const imageUrl of property.images) {
                try {
                    const imageRef = firebaseStorage.refFromURL(imageUrl);
                    await imageRef.delete();
                } catch (error) {
                    console.error('Error deleting image:', error);
                }
            }
        }

        showToast('success', 'Eliminado', 'Propiedad eliminada exitosamente');
        await loadProperties();

    } catch (error) {
        console.error('Error deleting property:', error);
        showToast('error', 'Error', 'No se pudo eliminar la propiedad');
    } finally {
        deleteModal.classList.remove('active');
        propertyToDelete = null;
    }
});

// ========================================
// Update Statistics
// ========================================
function updateStats() {
    const totalProperties = properties.length;
    const totalSales = properties.filter(p => p.status === 'venta').length;
    const totalRentals = properties.filter(p => p.status === 'alquiler').length;
    const totalValue = properties.reduce((sum, p) => sum + (p.price || 0), 0);

    document.getElementById('totalProperties').textContent = totalProperties;
    document.getElementById('totalSales').textContent = totalSales;
    document.getElementById('totalRentals').textContent = totalRentals;
    document.getElementById('totalValue').textContent = '$' + formatNumber(totalValue);
}

// ========================================
// Refresh Button
// ========================================
document.getElementById('refreshBtn')?.addEventListener('click', async () => {
    await loadProperties();
    showToast('success', 'Actualizado', 'Propiedades actualizadas');
});

// ========================================
// Utility Functions
// ========================================
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = '';
    switch (type) {
        case 'success': icon = '✓'; break;
        case 'error': icon = '✕'; break;
        case 'warning': icon = '⚠'; break;
        default: icon = 'ℹ';
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
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    });

    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}
