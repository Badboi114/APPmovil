import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EncryptionService } from './encryption.service';
import { DatabaseService } from './database.service';
import { User, DatabaseResponse } from '../models/database.models';

// Exportar User para que otros componentes puedan usarlo
export { User } from '../models/database.models';

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
  pin?: string; // PIN sin hashear para mostrar al usuario
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isUserLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public isUserLoggedIn$ = this.isUserLoggedInSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly CURRENT_USER_KEY = 'passvault_current_user';
  private userPin: string = '';

  constructor(
    private encryptionService: EncryptionService,
    private databaseService: DatabaseService
  ) {
    console.log('🚀 AuthService iniciado con base de datos híbrida');
    // Cargar usuario de forma asíncrona para no bloquear la UI
    setTimeout(() => this.loadCurrentUser(), 0);
  }

  // Cargar usuario actual al inicializar - OPTIMIZADO
  private async loadCurrentUser() {
    try {
      const storedUser = localStorage.getItem(this.CURRENT_USER_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log('✅ Usuario encontrado:', user.email);
        this.currentUserSubject.next(user);
        this.isUserLoggedInSubject.next(true);
      }
    } catch (error) {
      console.error('❌ Error cargando usuario:', error);
      this.clearUserData();
    }
  }

  private clearUserData() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.currentUserSubject.next(null);
    this.isUserLoggedInSubject.next(false);
    this.isAuthenticatedSubject.next(false);
    console.log('🧹 Datos de usuario limpiados');
  }

    // Registro optimizado con base de datos híbrida
  async register(userData: { name: string; email: string; password: string; pin: string }): Promise<RegisterResponse> {
    try {
      console.log('📝 Iniciando registro para:', userData.email);
      
      // Verificar si el usuario ya existe
      const existingUser = await this.databaseService.getUserByEmail(userData.email);
      if (existingUser.success) {
        return {
          success: false,
          message: 'Ya existe un usuario con este email'
        };
      }

      // Hashear password y PIN
      const passwordHash = this.encryptionService.hashUserPassword(userData.password);
      const pinHash = this.encryptionService.hashUserPassword(userData.pin);

      // Crear usuario en la base de datos
      const newUser: Omit<User, 'id' | 'created_at' | 'updated_at'> = {
        email: userData.email,
        password_hash: passwordHash,
        pin_hash: pinHash,
        name: userData.name,
        registration_date: new Date().toISOString(),
        last_login: new Date().toISOString()
      };

      const result = await this.databaseService.createUser(newUser);
      
      if (result.success && result.data) {
        const authUser: AuthUser = {
          id: result.data.id!,
          name: result.data.name,
          email: result.data.email,
          pin: userData.pin,
          createdAt: result.data.created_at
        };

        // Guardar en localStorage para sesión
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(authUser));
        
        this.currentUserSubject.next(authUser);
        this.isUserLoggedInSubject.next(true);

        // Log de seguridad
        await this.databaseService.createSecurityLog({
          user_id: result.data.id!,
          action: 'REGISTER',
          details: 'Usuario registrado exitosamente'
        });

        console.log('✅ Usuario registrado exitosamente');
        return {
          success: true,
          message: 'Usuario registrado exitosamente',
          user: authUser,
          pin: userData.pin // PIN sin hashear para mostrar al usuario
        };
      }

      return {
        success: false,
        message: result.error || 'Error al crear usuario'
      };

    } catch (error: any) {
      console.error('❌ Error en registro:', error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  }

  // Login optimizado con base de datos híbrida
  async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: AuthUser }> {
    try {
      console.log('🔐 Intentando login para:', email);

      // Obtener usuario de la base de datos
      const userResult = await this.databaseService.getUserByEmail(email);
      
      if (!userResult.success || !userResult.data) {
        console.log('❌ Usuario no encontrado');
        return {
          success: false,
          message: 'Email o contraseña incorrectos'
        };
      }

      const user = userResult.data;
      console.log('✅ Usuario encontrado en base de datos');
      console.log('🔑 Hash almacenado:', user.password_hash.substring(0, 20) + '...');
      console.log('🔑 Password ingresado hash:', this.encryptionService.hashUserPassword(password).substring(0, 20) + '...');

      const isPasswordValid = this.encryptionService.verifyPassword(password, user.password_hash);
      
      if (isPasswordValid) {
        const authUser: AuthUser = {
          id: user.id!,
          name: user.name,
          email: user.email,
          pin: '', // No guardamos el PIN real por seguridad
          createdAt: user.created_at
        };

        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(authUser));
        this.currentUserSubject.next(authUser);
        this.isUserLoggedInSubject.next(true);
        
        // Actualizar last_login
        await this.databaseService.updateUser(user.id!, { last_login: new Date().toISOString() });
        
        // Log de seguridad
        await this.databaseService.createSecurityLog({
          user_id: user.id!,
          action: 'LOGIN',
          details: 'Login exitoso'
        });

        console.log('✅ Login exitoso');
        return {
          success: true,
          message: 'Login exitoso',
          user: authUser
        };
      } else {
        console.log('❌ Contraseña incorrecta');
        
        // Log de seguridad para intento fallido
        await this.databaseService.createSecurityLog({
          user_id: user.id!,
          action: 'LOGIN_FAILED',
          details: 'Intento de login con contraseña incorrecta'
        });

        return {
          success: false,
          message: 'Email o contraseña incorrectos'
        };
      }
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  }

  // Verificar PIN optimizado
  async verifyPin(pin: string): Promise<{ success: boolean; message: string }> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return { success: false, message: 'No hay usuario logueado' };
      }

      // Obtener usuario de la base de datos para verificar PIN
      const userResult = await this.databaseService.getUserById(currentUser.id);
      
      if (!userResult.success || !userResult.data) {
        return { success: false, message: 'Usuario no encontrado' };
      }

      const user = userResult.data;
      const isPinValid = this.encryptionService.verifyPassword(pin, user.pin_hash);
      
      if (isPinValid) {
        this.userPin = pin; // Guardar PIN para esta sesión
        this.isAuthenticatedSubject.next(true);
        
        // Log de seguridad
        await this.databaseService.createSecurityLog({
          user_id: user.id!,
          action: 'PIN_VERIFIED',
          details: 'PIN verificado correctamente'
        });
        
        console.log('✅ PIN verificado correctamente');
        return { success: true, message: 'PIN verificado correctamente' };
      } else {
        // Log de seguridad para intento fallido
        await this.databaseService.createSecurityLog({
          user_id: user.id!,
          action: 'PIN_FAILED',
          details: 'Intento de verificación de PIN fallido'
        });
        
        console.log('❌ PIN incorrecto');
        return { success: false, message: 'PIN incorrecto' };
      }
    } catch (error: any) {
      console.error('❌ Error verificando PIN:', error);
      return { success: false, message: 'Error interno' };
    }
  }

  // Cambiar PIN
  async changePin(newPin: string): Promise<boolean> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        console.log('❌ No hay usuario logueado');
        return false;
      }

      // Hashear nuevo PIN
      const pinHash = this.encryptionService.hashUserPassword(newPin);
      
      // Actualizar en base de datos
      const result = await this.databaseService.updateUser(currentUser.id, { pin_hash: pinHash });
      
      if (result.success) {
        // Log de seguridad
        await this.databaseService.createSecurityLog({
          user_id: currentUser.id,
          action: 'PIN_CHANGED',
          details: 'PIN cambiado exitosamente'
        });
        
        console.log('✅ PIN actualizado exitosamente');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Error cambiando PIN:', error);
      return false;
    }
  }

  // Actualizar información del usuario
  async updateUserInfo(updates: { name?: string; email?: string }): Promise<{ success: boolean; message: string }> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return { success: false, message: 'No hay usuario logueado' };
      }

      const result = await this.databaseService.updateUser(currentUser.id, updates);
      
      if (result.success && result.data) {
        // Actualizar datos locales
        const updatedAuthUser: AuthUser = {
          ...currentUser,
          name: result.data.name,
          email: result.data.email
        };
        
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedAuthUser));
        this.currentUserSubject.next(updatedAuthUser);
        
        // Log de seguridad
        await this.databaseService.createSecurityLog({
          user_id: currentUser.id,
          action: 'PROFILE_UPDATED',
          details: `Perfil actualizado: ${Object.keys(updates).join(', ')}`
        });
        
        return { success: true, message: 'Información actualizada exitosamente' };
      }
      
      return { success: false, message: result.error || 'Error al actualizar' };
    } catch (error: any) {
      console.error('❌ Error actualizando usuario:', error);
      return { success: false, message: 'Error interno del servidor' };
    }
  }

  // Cambiar contraseña
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return { success: false, message: 'No hay usuario logueado' };
      }

      // Verificar contraseña actual
      const userResult = await this.databaseService.getUserById(currentUser.id);
      if (!userResult.success || !userResult.data) {
        return { success: false, message: 'Usuario no encontrado' };
      }

      const user = userResult.data;
      const isCurrentPasswordValid = this.encryptionService.verifyPassword(currentPassword, user.password_hash);
      
      if (!isCurrentPasswordValid) {
        // Log de seguridad
        await this.databaseService.createSecurityLog({
          user_id: user.id!,
          action: 'PASSWORD_CHANGE_FAILED',
          details: 'Intento de cambio de contraseña con contraseña actual incorrecta'
        });
        
        return { success: false, message: 'Contraseña actual incorrecta' };
      }

      // Hashear nueva contraseña
      const newPasswordHash = this.encryptionService.hashUserPassword(newPassword);
      
      // Actualizar en base de datos
      const result = await this.databaseService.updateUser(currentUser.id, { password_hash: newPasswordHash });
      
      if (result.success) {
        // Log de seguridad
        await this.databaseService.createSecurityLog({
          user_id: currentUser.id,
          action: 'PASSWORD_CHANGED',
          details: 'Contraseña cambiada exitosamente'
        });
        
        return { success: true, message: 'Contraseña actualizada exitosamente' };
      }
      
      return { success: false, message: result.error || 'Error al cambiar contraseña' };
    } catch (error: any) {
      console.error('❌ Error cambiando contraseña:', error);
      return { success: false, message: 'Error interno del servidor' };
    }
  }

  // Logout
  logout() {
    this.clearUserData();
    this.userPin = '';
    console.log('👋 Usuario deslogueado');
  }

  // Getters
  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isUserLoggedInSubject.value;
  }

  // Método para compatibilidad con componentes existentes
  isUserLoggedIn(): boolean {
    return this.isUserLoggedInSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Método para autenticar con PIN (compatibilidad con lock-screen)
  authenticate(pin: string): boolean {
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.pin === pin) {
      this.isAuthenticatedSubject.next(true);
      this.userPin = pin;
      return true;
    }
    return false;
  }

  getUserPin(): string {
    return this.userPin;
  }

  // Regenerar PIN
  async regeneratePin(): Promise<boolean> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        console.log('❌ No hay usuario actual para regenerar PIN');
        return false;
      }

      // Generar nuevo PIN
      const newPin = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedPin = this.encryptionService.hashUserPassword(newPin);

      // Actualizar en base de datos
      const updateResult = await this.databaseService.updateUser(currentUser.id, {
        pin_hash: hashedPin
      });

      if (updateResult.success) {
        // Actualizar usuario actual
        const updatedUser = { ...currentUser, pin: newPin };
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
        this.userPin = newPin;

        // Log de seguridad
        await this.databaseService.createSecurityLog({
          user_id: currentUser.id,
          action: 'PIN_REGENERATED',
          details: 'PIN regenerado por el usuario'
        });

        console.log('✅ PIN regenerado exitosamente');
        return true;
      }

      console.log('❌ Error actualizando PIN en base de datos');
      return false;
    } catch (error) {
      console.error('❌ Error regenerando PIN:', error);
      return false;
    }
  }

  // Actualizar perfil de usuario
  async updateUserProfile(updates: Partial<{ name: string; email: string }>): Promise<boolean> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        console.log('❌ No hay usuario actual para actualizar');
        return false;
      }

      // Actualizar en base de datos
      const updateResult = await this.databaseService.updateUser(currentUser.id, updates);

      if (updateResult.success) {
        // Actualizar usuario en memoria
        const updatedUser = { ...currentUser, ...updates };
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);

        // Log de seguridad
        await this.databaseService.createSecurityLog({
          user_id: currentUser.id,
          action: 'PROFILE_UPDATED',
          details: `Perfil actualizado: ${Object.keys(updates).join(', ')}`
        });

        console.log('✅ Perfil actualizado exitosamente');
        return true;
      }

      console.log('❌ Error actualizando perfil en base de datos');
      return false;
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      return false;
    }
  }

  // Obtener estadísticas del usuario
  async getUserStats(): Promise<any> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return null;

      const passwords = await this.databaseService.getPasswordsByUserId(currentUser.id);
      const categories = await this.databaseService.getCategoriesByUserId(currentUser.id);
      
      return {
        totalPasswords: passwords.total,
        totalCategories: categories.data?.length || 0,
        lastLogin: currentUser.createdAt
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return null;
    }
  }
}
