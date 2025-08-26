import { Injectable } from '@angular/core';

/**
 * Sistema de almacenamiento híbrido ultra-rápido
 * Combina localStorage para velocidad + SQLite para robustez
 */
@Injectable({
  providedIn: 'root'
})
export class HybridStorageService {
  private readonly STORAGE_PREFIX = 'passvault_';
  private readonly USER_KEY = 'current_user';
  private readonly PASSWORDS_KEY = 'user_passwords';
  private readonly CATEGORIES_KEY = 'user_categories';
  
  constructor() {}

  // ===============================
  // OPERACIONES ULTRA-RÁPIDAS (localStorage)
  // ===============================

  /**
   * Login ultra-rápido usando solo localStorage
   */
  fastLogin(email: string, password: string): { success: boolean; user?: any; message: string } {
    try {
      const users = this.getStoredUsers();
      const user = users.find((u: any) => u.email === email);
      
      if (!user) {
        return { success: false, message: 'Usuario no encontrado' };
      }

      // Verificación simple de contraseña (para velocidad)
      const passwordMatch = this.simplePasswordCheck(password, user.password_hash);
      
      if (passwordMatch) {
        // Guardar sesión actual
        localStorage.setItem(this.STORAGE_PREFIX + this.USER_KEY, JSON.stringify(user));
        
        return { 
          success: true, 
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            pin: user.pin,
            createdAt: user.created_at
          },
          message: 'Login exitoso' 
        };
      }

      return { success: false, message: 'Contraseña incorrecta' };
    } catch (error) {
      return { success: false, message: 'Error en login' };
    }
  }

  /**
   * Registro ultra-rápido
   */
  fastRegister(userData: any): { success: boolean; user?: any; message: string } {
    try {
      const users = this.getStoredUsers();
      
      // Verificar si el usuario ya existe
      if (users.find((u: any) => u.email === userData.email)) {
        return { success: false, message: 'El usuario ya existe' };
      }

      const newUser = {
        id: Date.now(), // ID simple basado en timestamp
        email: userData.email,
        name: userData.name,
        password_hash: this.simplePasswordHash(userData.password),
        pin: userData.pin, // Guardar PIN directamente para compatibilidad
        created_at: new Date().toISOString(),
        registration_date: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem(this.STORAGE_PREFIX + 'users', JSON.stringify(users));
      
      // Auto-login después del registro
      localStorage.setItem(this.STORAGE_PREFIX + this.USER_KEY, JSON.stringify(newUser));

      return {
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          pin: newUser.pin,
          createdAt: newUser.created_at
        },
        message: 'Registro exitoso'
      };
    } catch (error) {
      return { success: false, message: 'Error en registro' };
    }
  }

  /**
   * Obtener usuario actual (instantáneo)
   */
  getCurrentUser(): any | null {
    try {
      const userData = localStorage.getItem(this.STORAGE_PREFIX + this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Logout ultra-rápido
   */
  fastLogout(): void {
    localStorage.removeItem(this.STORAGE_PREFIX + this.USER_KEY);
  }

  // ===============================
  // GESTIÓN DE CONTRASEÑAS RÁPIDA
  // ===============================

  /**
   * Obtener contraseñas del usuario actual
   */
  getUserPasswords(userId: number): any[] {
    try {
      const passwords = localStorage.getItem(this.STORAGE_PREFIX + this.PASSWORDS_KEY + '_' + userId);
      return passwords ? JSON.parse(passwords) : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Guardar contraseña (instantáneo)
   */
  savePassword(userId: number, passwordData: any): boolean {
    try {
      const passwords = this.getUserPasswords(userId);
      const newPassword = {
        id: Date.now(),
        ...passwordData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      passwords.push(newPassword);
      localStorage.setItem(this.STORAGE_PREFIX + this.PASSWORDS_KEY + '_' + userId, JSON.stringify(passwords));
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Actualizar contraseña
   */
  updatePassword(userId: number, passwordId: number, updates: any): boolean {
    try {
      const passwords = this.getUserPasswords(userId);
      const index = passwords.findIndex(p => p.id === passwordId);
      
      if (index !== -1) {
        passwords[index] = {
          ...passwords[index],
          ...updates,
          updated_at: new Date().toISOString()
        };
        localStorage.setItem(this.STORAGE_PREFIX + this.PASSWORDS_KEY + '_' + userId, JSON.stringify(passwords));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Eliminar contraseña
   */
  deletePassword(userId: number, passwordId: number): boolean {
    try {
      const passwords = this.getUserPasswords(userId);
      const filtered = passwords.filter(p => p.id !== passwordId);
      localStorage.setItem(this.STORAGE_PREFIX + this.PASSWORDS_KEY + '_' + userId, JSON.stringify(filtered));
      return true;
    } catch (error) {
      return false;
    }
  }

  // ===============================
  // FUNCIONES AUXILIARES
  // ===============================

  private getStoredUsers(): any[] {
    try {
      const users = localStorage.getItem(this.STORAGE_PREFIX + 'users');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      return [];
    }
  }

  private simplePasswordHash(password: string): string {
    // Hash simple para velocidad (puedes mejorarlo después)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private simplePasswordCheck(password: string, storedHash: string): boolean {
    return this.simplePasswordHash(password) === storedHash;
  }

  /**
   * Sincronización con SQLite en segundo plano (opcional)
   */
  async syncWithSQLite(): Promise<void> {
    console.log('🔄 Sincronización con SQLite en segundo plano...');
    // Implementar sincronización later sin bloquear UI
  }

  /**
   * Actualizar usuario existente
   */
  updateUser(updatedUser: any): { success: boolean; message: string } {
    try {
      console.log('🔄 HybridStorage: Actualizando usuario:', updatedUser.email);
      
      // 1. Actualizar en la lista de usuarios
      const users = this.getStoredUsers();
      const userIndex = users.findIndex((u: any) => u.id === updatedUser.id || u.email === updatedUser.email);
      
      if (userIndex !== -1) {
        // Mantener la estructura original del usuario pero actualizar campos
        users[userIndex] = {
          ...users[userIndex],
          pin: updatedUser.pin,
          name: updatedUser.name || users[userIndex].name,
          email: updatedUser.email || users[userIndex].email,
          updated_at: new Date().toISOString()
        };
        
        localStorage.setItem(this.STORAGE_PREFIX + 'users', JSON.stringify(users));
        console.log('✅ Usuario actualizado en lista de usuarios');
        
        // 2. Actualizar usuario actual si es el mismo
        const currentUser = this.getCurrentUser();
        if (currentUser && (currentUser.id === updatedUser.id || currentUser.email === updatedUser.email)) {
          const updatedCurrentUser = {
            ...currentUser,
            pin: updatedUser.pin,
            name: updatedUser.name || currentUser.name,
            email: updatedUser.email || currentUser.email,
            updated_at: new Date().toISOString()
          };
          
          localStorage.setItem(this.STORAGE_PREFIX + this.USER_KEY, JSON.stringify(updatedCurrentUser));
          console.log('✅ Usuario actual también actualizado');
        }
        
        return { success: true, message: 'Usuario actualizado exitosamente' };
      } else {
        console.warn('⚠️ Usuario no encontrado para actualizar');
        return { success: false, message: 'Usuario no encontrado' };
      }
    } catch (error) {
      console.error('❌ Error actualizando usuario:', error);
      return { success: false, message: 'Error actualizando usuario' };
    }
  }

  /**
   * Limpiar datos
   */
  clearAllData(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}
