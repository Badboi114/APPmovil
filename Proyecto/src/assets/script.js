// Estado de la aplicación
let currentPin = '';
const correctPin = '1234';
let savedPasswords = [];
let currentTab = 'generator';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadSavedPasswords();
    updateVaultDisplay();
    registerServiceWorker();
});

// Registro del Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('./sw.js')
                .then(function(registration) {
                    console.log('Service Worker registrado correctamente:', registration.scope);
                })
                .catch(function(error) {
                    console.log('Error al registrar Service Worker:', error);
                });
        });
    }
}

// =================
// FUNCIONES DE BLOQUEO/DESBLOQUEO
// =================

function enterPin(digit) {
    if (currentPin.length < 4) {
        currentPin += digit;
        updatePinDots();
        
        // Vibración en dispositivos móviles
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
}

function deletePin() {
    if (currentPin.length > 0) {
        currentPin = currentPin.slice(0, -1);
        updatePinDots();
    }
}

function updatePinDots() {
    for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById(`dot${i}`);
        if (i <= currentPin.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    }
}

function unlockVault() {
    if (currentPin === correctPin) {
        // Animación de éxito
        const lockScreen = document.getElementById('lockScreen');
        const mainApp = document.getElementById('mainApp');
        
        lockScreen.style.transform = 'scale(0.9)';
        lockScreen.style.opacity = '0';
        
        setTimeout(() => {
            lockScreen.classList.add('hidden');
            mainApp.classList.remove('hidden');
            mainApp.classList.add('fade-in');
        }, 300);
        
        currentPin = '';
        updatePinDots();
    } else {
        // Animación de error
        const lockContainer = document.querySelector('.lock-container');
        lockContainer.style.animation = 'shake 0.5s ease-in-out';
        
        // Limpiar PIN después de error
        setTimeout(() => {
            currentPin = '';
            updatePinDots();
            lockContainer.style.animation = '';
        }, 500);
        
        // Vibración de error
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    }
}

function lockApp() {
    const lockScreen = document.getElementById('lockScreen');
    const mainApp = document.getElementById('mainApp');
    
    mainApp.classList.add('hidden');
    lockScreen.classList.remove('hidden');
    
    currentPin = '';
    updatePinDots();
}

// =================
// FUNCIONES DE NAVEGACIÓN
// =================

function showTab(tabName) {
    // Actualizar botones de navegación
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
    
    // Mostrar contenido de tab
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    currentTab = tabName;
}

// =================
// GENERADOR DE CONTRASEÑAS
// =================

function generatePassword() {
    const length = parseInt(document.getElementById('lengthSlider').value);
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;
    
    let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    if (includeNumbers) {
        charset += '0123456789';
    }
    
    if (includeSymbols) {
        charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    document.getElementById('passwordDisplay').textContent = password;
    
    // Animación del botón generar
    const generateBtn = document.querySelector('.generate-btn .fas');
    generateBtn.style.animation = 'spin 0.5s ease-in-out';
    setTimeout(() => {
        generateBtn.style.animation = '';
    }, 500);
}

function updateLength(value) {
    document.getElementById('lengthValue').textContent = value;
}

function copyPassword() {
    const password = document.getElementById('passwordDisplay').textContent;
    
    if (password && password !== "Haz clic en 'Generar'...") {
        navigator.clipboard.writeText(password).then(() => {
            // Feedback visual
            const copyBtn = document.querySelector('.copy-btn');
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyBtn.style.background = 'rgba(72, 187, 120, 0.5)';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalIcon;
                copyBtn.style.background = '';
            }, 1000);
            
            // Vibración de confirmación
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
        }).catch(err => {
            console.error('Error al copiar: ', err);
        });
    }
}

// =================
// GESTIÓN DE BÓVEDA
// =================

function showAddModal() {
    document.getElementById('addModal').classList.add('show');
    document.getElementById('siteName').focus();
}

function closeAddModal() {
    document.getElementById('addModal').classList.remove('show');
    clearModalForm();
}

function clearModalForm() {
    document.getElementById('siteName').value = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

function savePassword() {
    const siteName = document.getElementById('siteName').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!siteName || !username || !password) {
        alert('Por favor, completa todos los campos.');
        return;
    }
    
    const newPassword = {
        id: Date.now(),
        siteName: siteName,
        username: username,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    savedPasswords.push(newPassword);
    savePasswordsToStorage();
    updateVaultDisplay();
    closeAddModal();
    
    // Feedback visual
    showToast('Contraseña guardada exitosamente');
}

function deletePassword(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta contraseña?')) {
        savedPasswords = savedPasswords.filter(pwd => pwd.id !== id);
        savePasswordsToStorage();
        updateVaultDisplay();
        showToast('Contraseña eliminada');
    }
}

function copyStoredPassword(password) {
    navigator.clipboard.writeText(password).then(() => {
        showToast('Contraseña copiada al portapapeles');
        
        // Vibración de confirmación
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}

function updateVaultDisplay() {
    const vaultContent = document.getElementById('vaultContent');
    
    if (savedPasswords.length === 0) {
        vaultContent.innerHTML = `
            <div class="empty-vault">
                <i class="fas fa-key"></i>
                <h3>Tu bóveda está vacía.</h3>
                <p>Añade una contraseña para empezar.</p>
            </div>
        `;
    } else {
        vaultContent.innerHTML = savedPasswords.map(pwd => `
            <div class="password-item">
                <div class="password-item-header">
                    <div class="password-item-title">${escapeHtml(pwd.siteName)}</div>
                    <div class="password-item-actions">
                        <button class="action-btn" onclick="copyStoredPassword('${escapeHtml(pwd.password)}')" 
                                title="Copiar contraseña">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="action-btn" onclick="deletePassword(${pwd.id})" 
                                title="Eliminar contraseña">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="password-item-info">
                    Usuario: ${escapeHtml(pwd.username)}
                </div>
            </div>
        `).join('');
    }
}

// =================
// ALMACENAMIENTO LOCAL
// =================

function savePasswordsToStorage() {
    try {
        localStorage.setItem('passvault_passwords', JSON.stringify(savedPasswords));
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
    }
}

function loadSavedPasswords() {
    try {
        const stored = localStorage.getItem('passvault_passwords');
        if (stored) {
            savedPasswords = JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error al cargar desde localStorage:', error);
        savedPasswords = [];
    }
}

// =================
// UTILIDADES
// =================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message) {
    // Crear elemento de toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(72, 187, 120, 0.9);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        animation: toastSlideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// =================
// EVENTOS DE TECLADO
// =================

document.addEventListener('keydown', function(event) {
    // En pantalla de bloqueo
    if (!document.getElementById('lockScreen').classList.contains('hidden')) {
        if (event.key >= '0' && event.key <= '9') {
            enterPin(event.key);
        } else if (event.key === 'Backspace') {
            deletePin();
        } else if (event.key === 'Enter') {
            unlockVault();
        }
    }
    
    // En modal
    if (document.getElementById('addModal').classList.contains('show')) {
        if (event.key === 'Escape') {
            closeAddModal();
        }
    }
    
    // Atajo para bloquear (Ctrl+L)
    if (event.ctrlKey && event.key === 'l') {
        event.preventDefault();
        lockApp();
    }
});

// =================
// EVENTOS DE CLIC FUERA DEL MODAL
// =================

document.getElementById('addModal').addEventListener('click', function(event) {
    if (event.target === this) {
        closeAddModal();
    }
});

// =================
// ANIMACIONES CSS ADICIONALES
// =================

const additionalStyles = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
}

@keyframes toastSlideIn {
    from {
        opacity: 0;
        transform: translate(-50%, -100%);
    }
    to {
        opacity: 1;
        transform: translate(-50%, 0);
    }
}

@keyframes toastSlideOut {
    from {
        opacity: 1;
        transform: translate(-50%, 0);
    }
    to {
        opacity: 0;
        transform: translate(-50%, -100%);
    }
}
`;

// Agregar estilos adicionales
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// =================
// SOPORTE PARA PWA (opcional)
// =================

// Detectar si la app está siendo ejecutada como PWA
function isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone ||
           document.referrer.includes('android-app://');
}

// Configurar comportamiento PWA
if (isPWA()) {
    // Prevenir zoom en dispositivos móviles
    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    });
    
    // Manejar la navegación hacia atrás en Android
    window.addEventListener('popstate', function(event) {
        if (!document.getElementById('lockScreen').classList.contains('hidden')) {
            // En pantalla de bloqueo, salir de la app
            if (navigator.app) {
                navigator.app.exitApp();
            }
        } else {
            // En la app principal, ir a pantalla de bloqueo
            lockApp();
        }
    });
}
