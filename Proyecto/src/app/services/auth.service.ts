import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HybridStorageService } from './hybrid-storage.service';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  pin: string;
  createdAt: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  pin?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isUserLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  private isLoggingOutSubject = new BehaviorSubject<boolean>(false);
  
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public isUserLoggedIn$ = this.isUserLoggedInSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggingOut$ = this.isLoggingOutSubject.asObservable();

  private readonly CURRENT_USER_KEY = 'passvault_current_user';
  
  // Protección contra fuerza bruta
  private failedAttempts = 0;
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private lockoutUntil: number | null = null;
  private readonly LOCKOUT_DURATION = 30000; // 30 segundos

  constructor(
    private hybridStorage: HybridStorageService
  ) {
    // Inicializar estado normal
    this.initializeAuthState();
    
    // Exponer en ventana global para depuración
    (window as any).authService = this;
    (window as any).clearAllData = () => this.clearAllData();
    (window as any).debugUser = () => this.debugUserData();
    (window as any).testPinChange = (newPin: string) => this.testPinChange(newPin);
    (window as any).clearAllStorage = () => this.clearAllStorage();
  }

  /**
   * Función de depuración para ver todos los datos del usuario
   */
  debugUserData(): void {
    console.log('🔍 === DEBUG USER DATA ===');
    
    try {
      const hybridUser = this.hybridStorage.getCurrentUser();
      console.log('🏪 HybridStorage:', hybridUser);
      
      const localUser = JSON.parse(localStorage.getItem(this.CURRENT_USER_KEY) || 'null');
      console.log('💾 localStorage (CURRENT_USER_KEY):', localUser);
      
      const localUser2 = JSON.parse(localStorage.getItem('passvault_current_user') || 'null');
      console.log('💾 localStorage (passvault_current_user):', localUser2);
      
      const users = JSON.parse(localStorage.getItem('passvault_users') || '[]');
      console.log('📝 Lista de usuarios:', users);
      
      const subjectUser = this.currentUserSubject.value;
      console.log('📡 Subject actual:', subjectUser);
      
      const currentUser = this.getCurrentUser();
      console.log('👤 getCurrentUser() resultado:', currentUser);
      
      console.log('🔍 === FIN DEBUG ===');
    } catch (error) {
      console.error('❌ Error en debug:', error);
    }
  }

  /**
   * Inicializar estado de autenticación
   */
  private initializeAuthState(): void {
    try {
      console.log('🔄 Inicializando AuthService...');
      
      // Verificar si hay un usuario guardado
      const savedUser = this.hybridStorage.getCurrentUser();
      
      if (savedUser) {
        console.log('👤 Usuario guardado encontrado:', savedUser.email);
        this.currentUserSubject.next(savedUser);
        this.isUserLoggedInSubject.next(true);
        this.isAuthenticatedSubject.next(false); // Requiere PIN
      } else {
        console.log('❌ No hay usuario guardado - Estado inicial limpio');
        this.currentUserSubject.next(null);
        this.isUserLoggedInSubject.next(false);
        this.isAuthenticatedSubject.next(false);
      }
    } catch (error) {
      console.error('❌ Error al inicializar AuthService:', error);
      // En caso de error, estado limpio
      this.currentUserSubject.next(null);
      this.isUserLoggedInSubject.next(false);
      this.isAuthenticatedSubject.next(false);
    }
  }

  /**
   * Verificar si hay un usuario guardado disponible (llamar manualmente cuando sea necesario)
   */
  checkForSavedUser(): void {
    try {
      const user = this.hybridStorage.getCurrentUser();
      if (user) {
        console.log('👤 Usuario guardado encontrado:', user.email);
        this.currentUserSubject.next(user);
        this.isUserLoggedInSubject.next(true);
        this.isAuthenticatedSubject.next(false); // Requiere PIN
      } else {
        console.log('❌ No hay usuario guardado');
      }
    } catch (error) {
      console.error('Error al verificar usuario guardado:', error);
    }
  }

  /**
   * Cargar usuario existente desde almacenamiento (sin crear demo automáticamente)
   */
  private loadCurrentUser(): void {
    try {
      // Intentar cargar usuario desde localStorage (clave principal)
      const storedUser = localStorage.getItem(this.CURRENT_USER_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.isUserLoggedInSubject.next(true);
        this.isAuthenticatedSubject.next(false); // Requiere PIN
        return;
      }

      // Intentar cargar desde HybridStorage
      const user = this.hybridStorage.getCurrentUser();
      if (user) {
        // Convertir a formato AuthUser si es necesario
        const authUser: AuthUser = {
          id: user.id || 1,
          name: user.name || 'Usuario',
          email: user.email,
          pin: user.pin || '1234',
          createdAt: user.createdAt || new Date().toISOString()
        };
        
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(authUser));
        this.currentUserSubject.next(authUser);
        this.isUserLoggedInSubject.next(true);
        this.isAuthenticatedSubject.next(false); // Requiere PIN
        return;
      }

      // No hay usuario - mantener estado de no logueado
      this.currentUserSubject.next(null);
      this.isUserLoggedInSubject.next(false);
      this.isAuthenticatedSubject.next(false);
    } catch (error) {
      // En caso de error, mantener estado limpio
      this.currentUserSubject.next(null);
      this.isUserLoggedInSubject.next(false);
      this.isAuthenticatedSubject.next(false);
    }
  }

  /**
   * Forzar login automático con usuario dummy (solo desarrollo)
   */
  private forceAutoLogin(): void {
    const dummyUser = {
      id: 1,
      name: 'Demo User',
      email: 'demo@demo.com',
      pin: '1234',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(dummyUser));
    this.currentUserSubject.next(dummyUser);
    this.isUserLoggedInSubject.next(true);
    this.isAuthenticatedSubject.next(false);
  }

  // ===============================
  // CARGA INSTANTÁNEA
  // ===============================
  private loadCurrentUserUltraFast(): void {
    try {
      const user = this.hybridStorage.getCurrentUser();
      if (user) {
        this.currentUserSubject.next(user);
        this.isUserLoggedInSubject.next(true);
        // NO marcamos como autenticado automáticamente - requiere PIN
        // this.isAuthenticatedSubject.next(true);
        console.log('⚡ Usuario cargado - Requiere verificación de PIN');
      }
    } catch (error) {
      console.error('Error cargando usuario:', error);
    }
  }

  // ===============================
  // LOGIN ULTRA-RÁPIDO
  // ===============================
  
  /**
   * Login directo con email y contraseña
   */
  async loginWithCredentials(email: string, password: string): Promise<{ success: boolean; message: string; user?: AuthUser }> {
    try {
      console.log('🔐 Intentando login con:', email);
      
      const result = this.hybridStorage.fastLogin(email, password);
      
      if (result.success && result.user) {
        // Crear el usuario con PIN (asumiendo que el PIN es 1234 por defecto)
        const authUser: AuthUser = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          pin: '1234', // PIN por defecto
          createdAt: result.user.createdAt
        };
        
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(authUser));
        this.currentUserSubject.next(authUser);
        this.isUserLoggedInSubject.next(true);
        this.isAuthenticatedSubject.next(false); // Requiere PIN para acceso completo
        
        console.log('✅ Login exitoso para:', email, 'PIN:', authUser.pin);
        return { success: true, message: 'Login exitoso', user: authUser };
      } else {
        console.log('❌ Login fallido:', result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      return { success: false, message: 'Error en el login' };
    }
  }

  /**
   * Login rápido con datos hardcodeados para j@gmail.com
   */
  forceLoginJUser(): void {
    const jUser: AuthUser = {
      id: 2,
      name: 'J User',
      email: 'j@gmail.com',
      pin: '1234',
      createdAt: new Date().toISOString()
    };
    
    console.log('🚀 Forzando login para j@gmail.com con PIN:', jUser.pin);
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(jUser));
    this.currentUserSubject.next(jUser);
    this.isUserLoggedInSubject.next(true);
    this.isAuthenticatedSubject.next(false);
  }
  async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: AuthUser }> {
    try {
      console.log('⚡ Login ultra-rápido iniciado para:', email);
      const startTime = performance.now();

      const result = this.hybridStorage.fastLogin(email, password);
      console.log('📊 Resultado del login:', result);
      
      if (result.success && result.user) {
        console.log('👤 Usuario logueado exitosamente:', result.user);
        this.currentUserSubject.next(result.user);
        this.isUserLoggedInSubject.next(true);
        // NO marcamos como autenticado hasta después del PIN
        // this.isAuthenticatedSubject.next(true);
        
        const endTime = performance.now();
        console.log(`🚀 Login completado en ${(endTime - startTime).toFixed(0)}ms - Esperando PIN`);
        
        return {
          success: true,
          message: 'Login exitoso - Verificar PIN',
          user: result.user
        };
      } else {
        console.log('❌ Login fallido:', result.message);
        return {
          success: false,
          message: result.message
        };
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      return {
        success: false,
        message: 'Error en el servidor'
      };
    }
  }

  // ===============================
  // REGISTRO ULTRA-RÁPIDO
  // ===============================
  async register(userData: { email: string; password: string; pin: string; name: string }): Promise<RegisterResponse> {
    try {
      console.log('⚡ Registro ultra-rápido iniciado para:', userData.email);
      const startTime = performance.now();

      const result = this.hybridStorage.fastRegister(userData);
      
      if (result.success && result.user) {
        this.currentUserSubject.next(result.user);
        this.isUserLoggedInSubject.next(true);
        this.isAuthenticatedSubject.next(true);
        
        const endTime = performance.now();
        console.log(`🚀 Registro completado en ${(endTime - startTime).toFixed(0)}ms`);
        
        return {
          success: true,
          message: 'Registro exitoso',
          user: result.user,
          pin: userData.pin
        };
      } else {
        return {
          success: false,
          message: result.message
        };
      }
    } catch (error) {
      console.error('❌ Error en registro:', error);
      return {
        success: false,
        message: 'Error en el servidor'
      };
    }
  }

  // ===============================
  // VERIFICACIÓN PIN RÁPIDA
  // ===============================
  
  /**
   * Validar formato del PIN con reglas de seguridad
   */
  validatePinFormat(pin: string): { valid: boolean; message: string } {
    if (!pin) {
      return { valid: false, message: 'PIN es requerido' };
    }
    
    if (pin.length !== 4) {
      return { valid: false, message: 'PIN debe tener exactamente 4 dígitos' };
    }
    
    if (!/^\d{4}$/.test(pin)) {
      return { valid: false, message: 'PIN solo debe contener números' };
    }

    // Validaciones de seguridad adicionales
    if (pin === '0000' || pin === '1111' || pin === '2222' || pin === '3333' || 
        pin === '4444' || pin === '5555' || pin === '6666' || pin === '7777' || 
        pin === '8888' || pin === '9999') {
      return { valid: false, message: 'PIN no puede ser secuencial repetitivo' };
    }

    if (pin === '1234' || pin === '4321' || pin === '0123' || pin === '9876') {
      return { valid: false, message: 'PIN no puede ser secuencial común' };
    }
    
    return { valid: true, message: 'PIN válido' };
  }

  /**
   * Verificar PIN optimizado para producción con protección anti-fuerza bruta
   */
  async verifyPin(pin: string): Promise<{ success: boolean; message: string }> {
    console.log('🔐 Verificando PIN:', pin);
    
    // Verificar si está bloqueado
    if (this.isLockedOut()) {
      const remainingTime = Math.ceil((this.lockoutUntil! - Date.now()) / 1000);
      return { 
        success: false, 
        message: `Demasiados intentos fallidos. Intenta nuevamente en ${remainingTime} segundos.` 
      };
    }

    // Validar formato
    const formatValidation = this.validatePinFormat(pin);
    if (!formatValidation.valid) {
      return { success: false, message: formatValidation.message };
    }

    try {
      // Verificar TODAS las fuentes de datos del usuario
      console.log('🔍 Verificando fuentes de datos...');
      
      const hybridUser = this.hybridStorage.getCurrentUser();
      console.log('🏪 HybridStorage usuario:', hybridUser?.email, 'PIN:', hybridUser?.pin);
      
      const localUser = JSON.parse(localStorage.getItem(this.CURRENT_USER_KEY) || 'null');
      console.log('� localStorage usuario:', localUser?.email, 'PIN:', localUser?.pin);
      
      const subjectUser = this.currentUserSubject.value;
      console.log('📡 Subject usuario:', subjectUser?.email, 'PIN:', subjectUser?.pin);
      
      const currentUser = this.getCurrentUser();
      console.log('👤 Usuario final seleccionado:', currentUser?.email, 'PIN:', currentUser?.pin);
      
      if (!currentUser) {
        return { success: false, message: 'Usuario no encontrado' };
      }
      
      console.log('🔍 Comparando PINs - Ingresado:', pin, 'Guardado:', currentUser.pin, 'Tipos:', typeof pin, typeof currentUser.pin);
      
      // Asegurar que ambos sean strings para comparación
      const pinString = String(pin);
      const savedPinString = String(currentUser.pin);
      
      // Verificación del PIN
      if (savedPinString === pinString) {
        console.log('✅ PIN correcto!');
        // PIN correcto - resetear intentos fallidos
        this.resetFailedAttempts();
        this.isAuthenticatedSubject.next(true);
        
        // Actualizar timestamp de última autenticación
        const updatedUser = { ...currentUser, lastAuthenticated: new Date().toISOString() };
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
        
        return { success: true, message: 'Acceso concedido' };
      } else {
        console.log('❌ PIN incorrecto - Ingresado:', pinString, 'Esperado:', savedPinString);
        // PIN incorrecto - incrementar intentos fallidos
        this.incrementFailedAttempts();
        return { success: false, message: 'PIN incorrecto. Intenta nuevamente.' };
      }
    } catch (error) {
      console.error('❌ Error verificando PIN:', error);
      return { success: false, message: 'Error interno verificando PIN' };
    }
  }

  /**
   * Verificar si la cuenta está bloqueada por intentos fallidos
   */
  private isLockedOut(): boolean {
    if (this.lockoutUntil && Date.now() < this.lockoutUntil) {
      return true;
    }
    if (this.lockoutUntil && Date.now() >= this.lockoutUntil) {
      this.resetFailedAttempts();
    }
    return false;
  }

  /**
   * Incrementar intentos fallidos y aplicar bloqueo si es necesario
   */
  private incrementFailedAttempts(): void {
    this.failedAttempts++;
    if (this.failedAttempts >= this.MAX_FAILED_ATTEMPTS) {
      this.lockoutUntil = Date.now() + this.LOCKOUT_DURATION;
    }
  }

  /**
   * Resetear contador de intentos fallidos
   */
  private resetFailedAttempts(): void {
    this.failedAttempts = 0;
    this.lockoutUntil = null;
  }

  /**
   * Cambiar PIN del usuario actual
   */
  async changePin(currentPin: string, newPin: string): Promise<{ success: boolean; message: string }> {
    console.log('🔄 Cambiando PIN...', { currentPin, newPin });
    
    // Verificar PIN actual SIN cambiar estado de autenticación
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'Usuario no encontrado' };
    }
    
    console.log('🔍 Verificando PIN actual - Ingresado:', currentPin, 'Guardado:', currentUser.pin);
    
    if (currentUser.pin !== currentPin) {
      return { success: false, message: 'PIN actual incorrecto' };
    }
    
    // Validar nuevo PIN
    const newPinValidation = this.validatePinFormat(newPin);
    if (!newPinValidation.valid) {
      return { success: false, message: newPinValidation.message };
    }
    
    try {
      console.log('💾 Actualizando PIN de', currentPin, 'a', newPin);
      
      // Actualizar PIN en el usuario
      const updatedUser = { 
        ...currentUser, 
        pin: newPin, 
        pinUpdated: new Date().toISOString() 
      };
      
      // Actualizar en HybridStorage primero
      await this.updateUserInStorage(updatedUser);
      
      // Forzar sincronización en todos los almacenamientos
      this.forcePinSync(newPin);
      
      console.log('✅ PIN actualizado exitosamente');
      return { success: true, message: 'PIN actualizado exitosamente' };
    } catch (error) {
      console.error('❌ Error cambiando PIN:', error);
      return { success: false, message: 'Error interno cambiando PIN' };
    }
  }

  /**
   * Actualizar usuario en todos los almacenamientos
   */
  private async updateUserInStorage(updatedUser: any): Promise<void> {
    try {
      console.log('💾 Actualizando usuario en almacenamiento...', updatedUser.email);
      
      // Actualizar en HybridStorage PRIMERO
      const hybridResult = this.hybridStorage.updateUser(updatedUser);
      if (!hybridResult.success) {
        console.warn('⚠️ No se pudo actualizar en HybridStorage:', hybridResult.message);
      }
      
      // Actualizar usuario actual en localStorage
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
      localStorage.setItem('passvault_current_user', JSON.stringify(updatedUser));
      
      // Actualizar en la lista de usuarios
      const users = JSON.parse(localStorage.getItem('passvault_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === updatedUser.id);
      
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('passvault_users', JSON.stringify(users));
        console.log('✅ Usuario actualizado en lista de usuarios');
      }
      
      // Actualizar el subject para notificar cambios
      this.currentUserSubject.next(updatedUser);
      
      console.log('✅ Usuario actualizado en TODOS los almacenamientos');
      
    } catch (error) {
      console.error('❌ Error actualizando usuario en almacenamiento:', error);
      throw error;
    }
  }

  /**
   * Resetear PIN (solo para admin/desarrollo)
   */
  async resetPin(newPin: string = '1234'): Promise<{ success: boolean; message: string }> {
    console.log('🔄 Reseteando PIN a:', newPin);
    
    const pinValidation = this.validatePinFormat(newPin);
    if (!pinValidation.valid) {
      console.log('❌ PIN formato inválido:', pinValidation.message);
      return { success: false, message: pinValidation.message };
    }
    
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        console.log('❌ No hay usuario actual');
        return { success: false, message: 'Usuario no encontrado' };
      }
      
      console.log('📝 Reseteando PIN para usuario:', currentUser.email);
      console.log('🔑 PIN anterior:', currentUser.pin);
      console.log('🔑 PIN nuevo:', newPin);
      
      const updatedUser = { ...currentUser, pin: newPin, pinReset: new Date().toISOString() };
      
      // 1. Actualizar usando el método oficial de HybridStorage
      const hybridResult = this.hybridStorage.updateUser(updatedUser);
      if (hybridResult.success) {
        console.log('✅ PIN actualizado en HybridStorage');
      } else {
        console.warn('⚠️ Error actualizando en HybridStorage:', hybridResult.message);
      }
      
      // 2. Guardar en localStorage principal
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
      console.log('✅ PIN reseteado guardado en localStorage principal');
      
      // 3. Actualizar el subject
      this.currentUserSubject.next(updatedUser);
      
      // 4. Forzar sincronización en todos los almacenamientos
      this.forcePinSync(newPin);
      
      // 5. Verificación inmediata
      setTimeout(() => {
        const verifyUser = this.getCurrentUser();
        if (verifyUser && verifyUser.pin === newPin) {
          console.log('✅ VERIFICACIÓN EXITOSA: PIN se guardó correctamente:', newPin);
        } else {
          console.error('❌ VERIFICACIÓN FALLIDA: PIN no coincide', {
            expected: newPin,
            actual: verifyUser?.pin,
            user: verifyUser
          });
        }
      }, 100);
      
      console.log('✅ PIN reseteado exitosamente en todos los almacenamientos');
      return { success: true, message: `PIN reseteado a: ${newPin}` };
    } catch (error) {
      console.error('❌ Error reseteando PIN:', error);
      return { success: false, message: 'Error reseteando PIN' };
    }
  }

  // ===============================
  // MÉTODOS AUXILIARES
  // ===============================
  getCurrentUser(): AuthUser | null {
    // Obtener siempre los datos más frescos del almacenamiento
    try {
      // Primero intentar desde HybridStorage
      const hybridUser = this.hybridStorage.getCurrentUser();
      if (hybridUser) {
        console.log('👤 Usuario obtenido desde HybridStorage:', hybridUser.email, 'PIN:', hybridUser.pin);
        return hybridUser;
      }
      
      // Si no está en HybridStorage, intentar desde localStorage
      const localUser = JSON.parse(localStorage.getItem(this.CURRENT_USER_KEY) || 'null');
      if (localUser) {
        console.log('👤 Usuario obtenido desde localStorage:', localUser.email, 'PIN:', localUser.pin);
        return localUser;
      }
      
      // Como último recurso, usar el subject
      const subjectUser = this.currentUserSubject.value;
      if (subjectUser) {
        console.log('👤 Usuario obtenido desde subject:', subjectUser.email, 'PIN:', subjectUser.pin);
      }
      
      return subjectUser;
    } catch (error) {
      console.error('❌ Error obteniendo usuario actual:', error);
      return this.currentUserSubject.value;
    }
  }

  // Métodos de compatibilidad para componentes existentes
  isUserLoggedIn(): boolean {
    return this.isUserLoggedInSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isUserLoggedInSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private clearUserData(): void {
    this.currentUserSubject.next(null);
    this.isUserLoggedInSubject.next(false);
    this.isAuthenticatedSubject.next(false);
    console.log('🧹 Datos de usuario limpiados');
  }

  // ===============================
  // MÉTODOS DE LIMPIEZA Y UTILIDADES
  // ===============================
  
  /**
   * Eliminar todos los usuarios registrados
   */
  async clearAllUsers(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🧹 Eliminando todos los usuarios...');
      
      // Limpiar localStorage
      localStorage.clear();
      
      // Limpiar almacenamiento híbrido
      await this.hybridStorage.clearAllData();
      
      // Resetear observables
      this.currentUserSubject.next(null);
      this.isUserLoggedInSubject.next(false);
      this.isAuthenticatedSubject.next(false);
      
      console.log('✅ Todos los usuarios eliminados');
      return { success: true, message: 'Todos los usuarios han sido eliminados' };
    } catch (error) {
      console.error('❌ Error eliminando usuarios:', error);
      return { success: false, message: 'Error eliminando usuarios' };
    }
  }

  /**
   * Actualizar perfil del usuario
   */
  async updateUserProfile(updates: { name?: string; email?: string }): Promise<boolean> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return false;

      const updatedUser = { ...currentUser, ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
      
      console.log('✅ Perfil actualizado exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      return false;
    }
  }

  /**
   * Cambiar contraseña (funcionalidad básica)
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    console.log('🔒 Simulando cambio de contraseña...');
    // En una implementación real, verificarías la contraseña actual
    // y actualizarías la nueva con encriptación adecuada
    return true;
  }

  /**
   * Logout y limpiar sesión completamente
   */
  logout(): void {
    console.log('🚪 Iniciando logout completo...');
    
    // MARCAR que estamos haciendo logout
    this.isLoggingOutSubject.next(true);
    
    // Limpiar localStorage inmediatamente
    localStorage.removeItem(this.CURRENT_USER_KEY);
    localStorage.removeItem('passvault_current_user');
    localStorage.removeItem('current_user');
    localStorage.removeItem('user_data');
    
    // Limpiar HybridStorage
    this.hybridStorage.fastLogout();
    
    // Resetear subjects INMEDIATAMENTE
    this.currentUserSubject.next(null);
    this.isUserLoggedInSubject.next(false);
    this.isAuthenticatedSubject.next(false);
    
    console.log('🚪 Logout completado - todos los subjects reseteados');
    
    // Forzar actualización inmediata de todos los observables
    setTimeout(() => {
      this.currentUserSubject.next(null);
      this.isUserLoggedInSubject.next(false);
      this.isAuthenticatedSubject.next(false);
      console.log('🚪 Segundo reseteo de subjects completado');
    }, 50);
    
    // Mantener el flag de logout por un momento para evitar el lock screen
    setTimeout(() => {
      this.isLoggingOutSubject.next(false);
      console.log('🚪 Flag de logout desactivado');
    }, 1000);
  }

  /**
   * Limpiar completamente todos los datos persistentes (reinicio total)
   */
  clearAllData(): void {
    try {
      console.log('🧹 Limpiando TODOS los datos...');
      
      // Limpiar localStorage completamente
      localStorage.clear();
      
      // Limpiar sessionStorage
      sessionStorage.clear();
      
      // Limpiar datos del hybrid storage
      this.hybridStorage.clearAllData();
      
      // Resetear estado del servicio
      this.currentUserSubject.next(null);
      this.isUserLoggedInSubject.next(false);
      this.isAuthenticatedSubject.next(false);
      
      // Resetear intentos fallidos
      this.resetFailedAttempts();
      
      console.log('✅ TODOS los datos eliminados - Estado completamente limpio');
      
      // Recargar la página para empezar desde cero
      window.location.reload();
    } catch (error) {
      console.error('❌ Error limpiando datos:', error);
    }
  }

  /**
   * Reiniciar la aplicación desde el estado inicial (útil para desarrollo)
   */
  resetToInitialState(): void {
    this.logout();
    console.log('🔄 Aplicación reiniciada - Estado inicial limpio');
  }

  /**
   * Obtener estadísticas del usuario
   */
  async getUserStats(): Promise<any> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return null;

      const passwords = this.hybridStorage.getUserPasswords(currentUser.id);
      
      return {
        totalPasswords: passwords.length,
        totalCategories: 0,
        lastLogin: currentUser.createdAt,
        pin: currentUser.pin
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return null;
    }
  }

  /**
   * Obtener PIN del usuario actual
   */
  getUserPin(): string {
    const currentUser = this.getCurrentUser();
    return currentUser?.pin || '';
  }

  /**
   * Regenerar PIN aleatorio con validaciones de seguridad
   */
  async regeneratePin(): Promise<{ success: boolean; message: string; newPin?: string }> {
    let newPin: string;
    let attempts = 0;
    const maxAttempts = 10;

    // Generar PIN seguro (evitar patrones comunes)
    do {
      newPin = Math.floor(1000 + Math.random() * 9000).toString();
      attempts++;
    } while (!this.validatePinFormat(newPin).valid && attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      return { success: false, message: 'No se pudo generar un PIN seguro' };
    }
    
    const result = await this.resetPin(newPin);
    
    if (result.success) {
      // Forzar sincronización
      this.forcePinSync(newPin);
      return { success: true, message: `Nuevo PIN generado: ${newPin}`, newPin };
    } else {
      return result;
    }
  }

  /**
   * Forzar sincronización del PIN en todos los almacenamientos
   */
  private forcePinSync(newPin: string): void {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return;

      const updatedUser = { ...currentUser, pin: newPin, lastSync: new Date().toISOString() };
      
      console.log('🔄 Forzando sincronización de PIN en todos los almacenamientos...');
      
      // Sincronizar en múltiples ubicaciones
      const keys = [
        this.CURRENT_USER_KEY,
        'passvault_current_user',
        'current_user',
        'user_data'
      ];
      
      keys.forEach(key => {
        try {
          localStorage.setItem(key, JSON.stringify(updatedUser));
          console.log(`✅ PIN sincronizado en ${key}`);
        } catch (error) {
          console.warn(`⚠️ No se pudo sincronizar en ${key}:`, error);
        }
      });
      
      // Actualizar subject
      this.currentUserSubject.next(updatedUser);
      
      // Verificar que el PIN se guardó correctamente
      const verificationUser = this.getCurrentUser();
      if (verificationUser && verificationUser.pin === newPin) {
        console.log('✅ PIN verificado correctamente:', newPin);
      } else {
        console.error('❌ Error: PIN no se guardó correctamente', {
          expected: newPin,
          actual: verificationUser?.pin
        });
      }
      
    } catch (error) {
      console.error('❌ Error en forcePinSync:', error);
    }
  }

  /**
   * Función de testing para cambio de PIN (accesible desde consola)
   */
  async testPinChange(newPin: string): Promise<void> {
    console.log('🧪 INICIANDO TEST DE CAMBIO DE PIN:', newPin);
    
    // 1. Estado antes del cambio
    console.log('📊 ESTADO ANTES:');
    this.debugUserData();
    
    try {
      // 2. Ejecutar cambio de PIN usando resetPin (método más directo)
      console.log('🔄 Ejecutando resetPin...');
      const result = await this.resetPin(newPin);
      console.log('📋 Resultado resetPin:', result);
      
      // 3. Verificar estado después del cambio
      console.log('📊 ESTADO DESPUÉS:');
      setTimeout(() => {
        this.debugUserData();
        
        // 4. Test de verificación
        console.log('🔍 PROBANDO VERIFICACIÓN DE PIN...');
        this.verifyPin(newPin).then(verifyResult => {
          console.log('🎯 Resultado verificación:', verifyResult);
          
          if (verifyResult.success) {
            console.log('✅ ¡TEST EXITOSO! El PIN se cambió y verifica correctamente');
          } else {
            console.log('❌ ¡TEST FALLIDO! El PIN no verifica correctamente');
          }
        });
      }, 200);
      
    } catch (error) {
      console.error('❌ Error en test de cambio de PIN:', error);
    }
  }

  /**
   * Función para limpiar completamente el almacenamiento (solo para debugging)
   */
  clearAllStorage(): void {
    console.log('🧹 LIMPIANDO TODO EL ALMACENAMIENTO...');
    
    // Limpiar todas las keys conocidas
    const keysToRemove = [
      this.CURRENT_USER_KEY,
      'passvault_current_user',
      'passvault_users',
      'current_user',
      'user_data'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🗑️ Eliminado: ${key}`);
    });
    
    // Limpiar subjects
    this.currentUserSubject.next(null);
    this.isUserLoggedInSubject.next(false);
    this.isAuthenticatedSubject.next(false);
    
    console.log('✅ Todo el almacenamiento limpiado');
  }
}
