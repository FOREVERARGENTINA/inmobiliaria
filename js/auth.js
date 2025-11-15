// ========================================
// Authentication Logic
// ========================================

// Get DOM elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const resetForm = document.getElementById('resetForm');
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');
const forgotPasswordBtn = document.getElementById('forgotPassword');
const backToLoginBtn = document.getElementById('backToLogin');

// ========================================
// Form Switching
// ========================================
showRegisterBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    resetForm.style.display = 'none';
});

showLoginBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    resetForm.style.display = 'none';
});

forgotPasswordBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    resetForm.style.display = 'block';
});

backToLoginBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    resetForm.style.display = 'none';
});

// ========================================
// Login Handler
// ========================================
loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    try {
        // Show loader
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        submitBtn.disabled = true;

        // Sign in with Firebase
        const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);

        showToast('success', '¡Bienvenido!', 'Inicio de sesión exitoso');

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    } catch (error) {
        console.error('Login error:', error);

        let errorMessage = 'Error al iniciar sesión';

        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No existe una cuenta con este email';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Contraseña incorrecta';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Email inválido';
                break;
            case 'auth/user-disabled':
                errorMessage = 'Esta cuenta ha sido deshabilitada';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Demasiados intentos. Intenta más tarde';
                break;
            default:
                errorMessage = error.message;
        }

        showToast('error', 'Error', errorMessage);

    } finally {
        // Hide loader
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }
});

// ========================================
// Register Handler
// ========================================
registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    // Validate passwords match
    if (password !== passwordConfirm) {
        showToast('error', 'Error', 'Las contraseñas no coinciden');
        return;
    }

    // Validate password length
    if (password.length < 6) {
        showToast('error', 'Error', 'La contraseña debe tener al menos 6 caracteres');
        return;
    }

    try {
        // Show loader
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        submitBtn.disabled = true;

        // Create user with Firebase
        const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);

        // Update profile with display name
        await userCredential.user.updateProfile({
            displayName: name
        });

        // Create user document in Firestore
        await firebaseDB.collection('users').doc(userCredential.user.uid).set({
            name: name,
            email: email,
            role: 'admin', // Por defecto todos son admin
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showToast('success', '¡Cuenta creada!', 'Redirigiendo al dashboard...');

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);

    } catch (error) {
        console.error('Registration error:', error);

        let errorMessage = 'Error al crear la cuenta';

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'Este email ya está registrado';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Email inválido';
                break;
            case 'auth/weak-password':
                errorMessage = 'La contraseña es muy débil';
                break;
            default:
                errorMessage = error.message;
        }

        showToast('error', 'Error', errorMessage);

    } finally {
        // Hide loader
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }
});

// ========================================
// Password Reset Handler
// ========================================
resetForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('resetEmail').value;
    const submitBtn = resetForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    try {
        // Show loader
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        submitBtn.disabled = true;

        // Send password reset email
        await firebaseAuth.sendPasswordResetEmail(email);

        showToast('success', '¡Email enviado!', 'Revisa tu bandeja de entrada');

        // Reset form and go back to login
        resetForm.reset();
        setTimeout(() => {
            loginForm.style.display = 'block';
            resetForm.style.display = 'none';
        }, 2000);

    } catch (error) {
        console.error('Reset error:', error);

        let errorMessage = 'Error al enviar el email';

        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No existe una cuenta con este email';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Email inválido';
                break;
            default:
                errorMessage = error.message;
        }

        showToast('error', 'Error', errorMessage);

    } finally {
        // Hide loader
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }
});

// ========================================
// Check if user is already logged in
// ========================================
firebaseAuth.onAuthStateChanged((user) => {
    if (user && window.location.pathname.includes('login.html')) {
        // User is signed in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
});

// ========================================
// Toast Notification System
// ========================================
function showToast(type = 'info', title, message) {
    const container = document.getElementById('toastContainer');

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Icon based on type
    let icon = '';
    switch (type) {
        case 'success':
            icon = '✓';
            break;
        case 'error':
            icon = '✕';
            break;
        case 'warning':
            icon = '⚠';
            break;
        default:
            icon = 'ℹ';
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

    // Close button handler
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

// ========================================
// Form Validation Helpers
// ========================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Add real-time validation
document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '';
        }
    });
});

document.querySelectorAll('input[type="password"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validatePassword(this.value)) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '';
        }
    });
});
