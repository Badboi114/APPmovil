import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { EncryptionService } from './encryption.service';
import { AuthService } from './auth.service';
import { PasswordEntry, Category, DatabaseResponse, PaginatedResponse } from '../models/database.models';

export interface PasswordData {
  id?: number;
  siteName: string;
  siteUrl?: string;
  username: string;
  password: string;
  notes?: string;
  category: string;
  isFavorite: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordManagerService {

  constructor(
    private databaseService: DatabaseService,
    private encryptionService: EncryptionService,
    private authService: AuthService
  ) {}

  // Guardar nueva contraseña
  async savePassword(passwordData: PasswordData): Promise<DatabaseResponse<PasswordEntry>> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const userPin = this.authService.getUserPin();
      if (!userPin) {
        return { success: false, error: 'PIN requerido para encriptar' };
      }

      // Encriptar la contraseña y notas
      const encryptedPassword = this.encryptionService.encryptPasswordAdvanced(passwordData.password, userPin);
      const encryptedNotes = passwordData.notes ? 
        this.encryptionService.encryptPasswordAdvanced(passwordData.notes, userPin) : '';

      const passwordEntry: Omit<PasswordEntry, 'id' | 'created_at' | 'updated_at'> = {
        user_id: currentUser.id,
        site_name: passwordData.siteName,
        site_url: passwordData.siteUrl || '',
        username: passwordData.username,
        encrypted_password: encryptedPassword,
        notes: encryptedNotes,
        category: passwordData.category || 'General',
        is_favorite: passwordData.isFavorite
      };

      const result = await this.databaseService.createPasswordEntry(passwordEntry);
      
      if (result.success) {
        // Log de seguridad
        await this.databaseService.createSecurityLog({
          user_id: currentUser.id,
          action: 'PASSWORD_CREATED',
          details: `Nueva contraseña guardada para ${passwordData.siteName}`
        });
      }

      return result;
    } catch (error: any) {
      console.error('Error guardando contraseña:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener contraseñas del usuario con paginación
  async getUserPasswords(page: number = 1, limit: number = 20): Promise<PaginatedResponse<PasswordData>> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        return { data: [], total: 0, page, limit, hasMore: false };
      }

      const result = await this.databaseService.getPasswordsByUserId(currentUser.id, page, limit);
      
      if (result.data && result.data.length > 0) {
        const userPin = this.authService.getUserPin();
        if (!userPin) {
          return { data: [], total: 0, page, limit, hasMore: false };
        }

        // Desencriptar contraseñas
        const decryptedPasswords = result.data.map(entry => this.decryptPasswordEntry(entry, userPin));
        
        return {
          data: decryptedPasswords,
          total: result.total,
          page: result.page,
          limit: result.limit,
          hasMore: result.hasMore
        };
      }

      return {
        data: [],
        total: result.total,
        page: result.page,
        limit: result.limit,
        hasMore: result.hasMore
      };
    } catch (error: any) {
      console.error('Error obteniendo contraseñas:', error);
      return { data: [], total: 0, page, limit, hasMore: false };
    }
  }

  // Buscar contraseñas
  async searchPasswords(searchTerm: string): Promise<PasswordData[]> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        return [];
      }

      const result = await this.databaseService.searchPasswords(currentUser.id, searchTerm);
      
      if (result.success && result.data) {
        const userPin = this.authService.getUserPin();
        if (!userPin) {
          return [];
        }

        return result.data.map(entry => this.decryptPasswordEntry(entry, userPin));
      }

      return [];
    } catch (error: any) {
      console.error('Error buscando contraseñas:', error);
      return [];
    }
  }

  // Actualizar contraseña
  async updatePassword(id: number, updates: Partial<PasswordData>): Promise<DatabaseResponse<PasswordEntry>> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const userPin = this.authService.getUserPin();
      if (!userPin) {
        return { success: false, error: 'PIN requerido para encriptar' };
      }

      // Preparar actualizaciones con encriptación si es necesario
      const updateData: Partial<PasswordEntry> = {};
      
      if (updates.siteName) updateData.site_name = updates.siteName;
      if (updates.siteUrl) updateData.site_url = updates.siteUrl;
      if (updates.username) updateData.username = updates.username;
      if (updates.category) updateData.category = updates.category;
      if (updates.isFavorite !== undefined) updateData.is_favorite = updates.isFavorite;
      
      if (updates.password) {
        updateData.encrypted_password = this.encryptionService.encryptPasswordAdvanced(updates.password, userPin);
      }
      
      if (updates.notes) {
        updateData.notes = this.encryptionService.encryptPasswordAdvanced(updates.notes, userPin);
      }

      const result = await this.databaseService.updatePasswordEntry(id, updateData);
      
      if (result.success) {
        // Log de seguridad
        await this.databaseService.createSecurityLog({
          user_id: currentUser.id,
          action: 'PASSWORD_UPDATED',
          details: `Contraseña actualizada ID: ${id}`
        });
      }

      return result;
    } catch (error: any) {
      console.error('Error actualizando contraseña:', error);
      return { success: false, error: error.message };
    }
  }

  // Eliminar contraseña
  async deletePassword(id: number): Promise<DatabaseResponse<void>> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const result = await this.databaseService.deletePasswordEntry(id);
      
      if (result.success) {
        // Log de seguridad
        await this.databaseService.createSecurityLog({
          user_id: currentUser.id,
          action: 'PASSWORD_DELETED',
          details: `Contraseña eliminada ID: ${id}`
        });
      }

      return result;
    } catch (error: any) {
      console.error('Error eliminando contraseña:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener categorías del usuario
  async getUserCategories(): Promise<Category[]> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        return [];
      }

      const result = await this.databaseService.getCategoriesByUserId(currentUser.id);
      return result.success ? result.data || [] : [];
    } catch (error: any) {
      console.error('Error obteniendo categorías:', error);
      return [];
    }
  }

  // Crear nueva categoría
  async createCategory(categoryData: { name: string; color: string; icon: string }): Promise<DatabaseResponse<Category>> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const category: Omit<Category, 'id' | 'created_at' | 'updated_at'> = {
        user_id: currentUser.id,
        name: categoryData.name,
        color: categoryData.color,
        icon: categoryData.icon
      };

      const result = await this.databaseService.createCategory(category);
      
      if (result.success) {
        // Log de seguridad
        await this.databaseService.createSecurityLog({
          user_id: currentUser.id,
          action: 'CATEGORY_CREATED',
          details: `Nueva categoría creada: ${categoryData.name}`
        });
      }

      return result;
    } catch (error: any) {
      console.error('Error creando categoría:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener estadísticas del usuario
  async getUserStats(): Promise<any> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        return null;
      }

      const [passwords, categories] = await Promise.all([
        this.databaseService.getPasswordsByUserId(currentUser.id, 1, 1), // Solo para contar
        this.databaseService.getCategoriesByUserId(currentUser.id)
      ]);

      return {
        totalPasswords: passwords.total,
        totalCategories: categories.data?.length || 0,
        strongPasswords: 0, // TODO: Implementar análisis de fortaleza
        weakPasswords: 0,
        duplicatePasswords: 0
      };
    } catch (error: any) {
      console.error('Error obteniendo estadísticas:', error);
      return null;
    }
  }

  // Generar contraseña segura
  generateSecurePassword(length: number = 16, includeNumbers: boolean = true, includeSymbols: boolean = true): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = lowercase + uppercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    let password = '';
    
    // Asegurar al menos un carácter de cada tipo requerido
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    
    if (includeNumbers) {
      password += numbers[Math.floor(Math.random() * numbers.length)];
    }
    
    if (includeSymbols) {
      password += symbols[Math.floor(Math.random() * symbols.length)];
    }

    // Completar el resto de la longitud
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Mezclar la contraseña
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }

  // Método auxiliar para desencriptar entrada de contraseña
  private decryptPasswordEntry(entry: PasswordEntry, userPin: string): PasswordData {
    try {
      const decryptedPassword = this.encryptionService.decryptPasswordAdvanced(entry.encrypted_password, userPin);
      const decryptedNotes = entry.notes ? 
        this.encryptionService.decryptPasswordAdvanced(entry.notes, userPin) : '';

      return {
        id: entry.id,
        siteName: entry.site_name,
        siteUrl: entry.site_url || '',
        username: entry.username,
        password: decryptedPassword,
        notes: decryptedNotes,
        category: entry.category || 'General',
        isFavorite: entry.is_favorite
      };
    } catch (error) {
      console.error('Error desencriptando contraseña:', error);
      return {
        id: entry.id,
        siteName: entry.site_name,
        siteUrl: entry.site_url || '',
        username: entry.username,
        password: '[Error al desencriptar]',
        notes: '[Error al desencriptar]',
        category: entry.category || 'General',
        isFavorite: entry.is_favorite
      };
    }
  }

  // Exportar datos del usuario (para backup)
  async exportUserData(): Promise<any> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        return null;
      }

      const userPin = this.authService.getUserPin();
      if (!userPin) {
        return null;
      }

      const [passwords, categories] = await Promise.all([
        this.databaseService.getPasswordsByUserId(currentUser.id, 1, 1000), // Todas las contraseñas
        this.databaseService.getCategoriesByUserId(currentUser.id)
      ]);

      const decryptedPasswords = passwords.data?.map(entry => this.decryptPasswordEntry(entry, userPin)) || [];

      return {
        user: {
          name: currentUser.name,
          email: currentUser.email,
          exportDate: new Date().toISOString()
        },
        passwords: decryptedPasswords,
        categories: categories.data || [],
        metadata: {
          version: '1.0',
          encryption: 'AES-256-CBC + HMAC-SHA256'
        }
      };
    } catch (error: any) {
      console.error('Error exportando datos:', error);
      return null;
    }
  }
}
