import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { User, PasswordEntry, Category, SecurityLog, AppSettings, DatabaseResponse, PaginatedResponse } from '../models/database.models';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqliteConnection!: SQLiteConnection;
  private database!: SQLiteDBConnection;
  private isWeb = false;
  private dbName = 'passvault.db';
  private isDbReady = false;
  private dbInitPromise: Promise<void> | null = null;

  constructor(private platform: Platform) {
    this.isWeb = Capacitor.getPlatform() === 'web';
    // NO inicializar inmediatamente, solo cuando se necesite
  }

  // Inicialización lazy - solo cuando se usa por primera vez
  private async ensureDatabaseReady(): Promise<void> {
    if (this.isDbReady) return;
    
    if (this.dbInitPromise) {
      await this.dbInitPromise;
      return;
    }

    this.dbInitPromise = this.initializeDatabase();
    await this.dbInitPromise;
  }

  async initializeDatabase(): Promise<void> {
    try {
      console.log(`⚡ Inicializando SQLite híbrida para ${this.isWeb ? 'WEB' : 'MÓVIL'}...`);
      const startTime = performance.now();
      
      this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
      
      if (this.isWeb) {
        // Para web, inicialización optimizada
        await this.initWebSQLiteOptimized();
      }

      // Crear/abrir la base de datos
      this.database = await this.sqliteConnection.createConnection(
        this.dbName,
        false,
        'no-encryption',
        1,
        false
      );

      await this.database.open();
      await this.createTables();
      this.isDbReady = true;
      
      const endTime = performance.now();
      console.log(`✅ Base de datos híbrida lista en ${(endTime - startTime).toFixed(0)}ms`);
    } catch (error) {
      console.error('❌ Error al inicializar la base de datos:', error);
      this.dbInitPromise = null; // Reset para reintento
      throw error;
    }
  }

  // Inicialización web ultra-optimizada
  private async initWebSQLiteOptimized(): Promise<void> {
    try {
      console.log('🌐 Configurando SQLite para navegador...');
      
      // Verificar si jeep-sqlite ya existe para evitar duplicados
      let jeepElement = document.querySelector('jeep-sqlite') as any;
      
      if (!jeepElement) {
        jeepElement = document.createElement('jeep-sqlite');
        document.body.appendChild(jeepElement);
        console.log('📦 Elemento jeep-sqlite creado');
      }
      
      // Esperar definición del componente
      await customElements.whenDefined('jeep-sqlite');
      console.log('✅ jeep-sqlite definido');
      
      // Inicializar store web solo si es necesario
      try {
        await this.sqliteConnection.initWebStore();
        console.log('✅ WebStore inicializado');
      } catch (storeError) {
        // El store podría ya estar inicializado
        console.log('ℹ️ WebStore ya estaba inicializado');
      }
    } catch (error) {
      console.error('❌ Error inicializando SQLite Web:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    const createTableStatements = `
      -- Tabla de usuarios
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        pin_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        registration_date TEXT NOT NULL,
        last_login TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      -- Tabla de entradas de contraseñas
      CREATE TABLE IF NOT EXISTS password_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        site_name TEXT NOT NULL,
        site_url TEXT,
        username TEXT NOT NULL,
        encrypted_password TEXT NOT NULL,
        notes TEXT,
        category TEXT DEFAULT 'General',
        is_favorite BOOLEAN DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );

      -- Tabla de categorías
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        color TEXT NOT NULL DEFAULT '#4C63D2',
        icon TEXT NOT NULL DEFAULT 'folder-outline',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE(user_id, name)
      );

      -- Tabla de logs de seguridad
      CREATE TABLE IF NOT EXISTS security_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        details TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );

      -- Tabla de configuraciones
      CREATE TABLE IF NOT EXISTS app_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        setting_key TEXT NOT NULL,
        setting_value TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE(user_id, setting_key)
      );

      -- Índices para optimizar consultas
      CREATE INDEX IF NOT EXISTS idx_password_entries_user_id ON password_entries(user_id);
      CREATE INDEX IF NOT EXISTS idx_password_entries_site_name ON password_entries(site_name);
      CREATE INDEX IF NOT EXISTS idx_password_entries_category ON password_entries(category);
      CREATE INDEX IF NOT EXISTS idx_password_entries_is_favorite ON password_entries(is_favorite);
      CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
      CREATE INDEX IF NOT EXISTS idx_security_logs_user_id ON security_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at);
      CREATE INDEX IF NOT EXISTS idx_app_settings_user_id ON app_settings(user_id);
    `;

    await this.database.execute(createTableStatements);
    console.log('✅ Tablas creadas correctamente');
  }

  // Método actualizado para usar lazy loading
  private async ensureDbReady(): Promise<void> {
    await this.ensureDatabaseReady();
  }

  // CRUD para USUARIOS
  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseResponse<User>> {
    try {
      await this.ensureDbReady();
      const now = new Date().toISOString();
      
      const query = `
        INSERT INTO users (email, password_hash, pin_hash, name, registration_date, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const result = await this.database.run(query, [
        user.email,
        user.password_hash,
        user.pin_hash,
        user.name,
        user.registration_date,
        now,
        now
      ]);

      const newUser: User = {
        id: result.changes?.lastId,
        ...user,
        created_at: now,
        updated_at: now
      };

      return { success: true, data: newUser, message: 'Usuario creado exitosamente' };
    } catch (error: any) {
      console.error('Error creando usuario:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserByEmail(email: string): Promise<DatabaseResponse<User>> {
    try {
      await this.ensureDbReady();
      const query = 'SELECT * FROM users WHERE email = ?';
      const result = await this.database.query(query, [email]);
      
      if (result.values && result.values.length > 0) {
        return { success: true, data: result.values[0] as User };
      }
      
      return { success: false, error: 'Usuario no encontrado' };
    } catch (error: any) {
      console.error('Error obteniendo usuario:', error);
      return { success: false, error: error.message };
    }
  }

  async updateUser(id: number, updates: Partial<User>): Promise<DatabaseResponse<User>> {
    try {
      await this.ensureDbReady();
      const now = new Date().toISOString();
      
      const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(updates), now, id];
      
      const query = `UPDATE users SET ${setClause}, updated_at = ? WHERE id = ?`;
      await this.database.run(query, values);
      
      const userResult = await this.getUserById(id);
      return userResult;
    } catch (error: any) {
      console.error('Error actualizando usuario:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserById(id: number): Promise<DatabaseResponse<User>> {
    try {
      await this.ensureDbReady();
      const query = 'SELECT * FROM users WHERE id = ?';
      const result = await this.database.query(query, [id]);
      
      if (result.values && result.values.length > 0) {
        return { success: true, data: result.values[0] as User };
      }
      
      return { success: false, error: 'Usuario no encontrado' };
    } catch (error: any) {
      console.error('Error obteniendo usuario por ID:', error);
      return { success: false, error: error.message };
    }
  }

  // CRUD para CONTRASEÑAS
  async createPasswordEntry(entry: Omit<PasswordEntry, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseResponse<PasswordEntry>> {
    try {
      await this.ensureDbReady();
      const now = new Date().toISOString();
      
      const query = `
        INSERT INTO password_entries (user_id, site_name, site_url, username, encrypted_password, notes, category, is_favorite, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const result = await this.database.run(query, [
        entry.user_id,
        entry.site_name,
        entry.site_url || null,
        entry.username,
        entry.encrypted_password,
        entry.notes || null,
        entry.category || 'General',
        entry.is_favorite ? 1 : 0,
        now,
        now
      ]);

      const newEntry: PasswordEntry = {
        id: result.changes?.lastId,
        ...entry,
        created_at: now,
        updated_at: now
      };

      return { success: true, data: newEntry, message: 'Contraseña guardada exitosamente' };
    } catch (error: any) {
      console.error('Error creando entrada de contraseña:', error);
      return { success: false, error: error.message };
    }
  }

  async getPasswordsByUserId(userId: number, page: number = 1, limit: number = 20): Promise<PaginatedResponse<PasswordEntry>> {
    try {
      await this.ensureDbReady();
      const offset = (page - 1) * limit;
      
      // Contar total
      const countQuery = 'SELECT COUNT(*) as total FROM password_entries WHERE user_id = ?';
      const countResult = await this.database.query(countQuery, [userId]);
      const total = countResult.values?.[0]?.total || 0;
      
      // Obtener datos paginados
      const query = `
        SELECT * FROM password_entries 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `;
      const result = await this.database.query(query, [userId, limit, offset]);
      
      return {
        data: result.values as PasswordEntry[] || [],
        total,
        page,
        limit,
        hasMore: (page * limit) < total
      };
    } catch (error: any) {
      console.error('Error obteniendo contraseñas:', error);
      return { data: [], total: 0, page, limit, hasMore: false };
    }
  }

  async updatePasswordEntry(id: number, updates: Partial<PasswordEntry>): Promise<DatabaseResponse<PasswordEntry>> {
    try {
      await this.ensureDbReady();
      const now = new Date().toISOString();
      
      const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(updates), now, id];
      
      const query = `UPDATE password_entries SET ${setClause}, updated_at = ? WHERE id = ?`;
      await this.database.run(query, values);
      
      // Obtener la entrada actualizada
      const getQuery = 'SELECT * FROM password_entries WHERE id = ?';
      const result = await this.database.query(getQuery, [id]);
      
      if (result.values && result.values.length > 0) {
        return { success: true, data: result.values[0] as PasswordEntry, message: 'Contraseña actualizada' };
      }
      
      return { success: false, error: 'Entrada no encontrada después de actualizar' };
    } catch (error: any) {
      console.error('Error actualizando entrada de contraseña:', error);
      return { success: false, error: error.message };
    }
  }

  async deletePasswordEntry(id: number): Promise<DatabaseResponse<void>> {
    try {
      await this.ensureDbReady();
      const query = 'DELETE FROM password_entries WHERE id = ?';
      await this.database.run(query, [id]);
      
      return { success: true, message: 'Contraseña eliminada exitosamente' };
    } catch (error: any) {
      console.error('Error eliminando entrada de contraseña:', error);
      return { success: false, error: error.message };
    }
  }

  async searchPasswords(userId: number, searchTerm: string): Promise<DatabaseResponse<PasswordEntry[]>> {
    try {
      await this.ensureDbReady();
      const query = `
        SELECT * FROM password_entries 
        WHERE user_id = ? AND (
          site_name LIKE ? OR 
          username LIKE ? OR 
          notes LIKE ?
        )
        ORDER BY created_at DESC
      `;
      
      const searchPattern = `%${searchTerm}%`;
      const result = await this.database.query(query, [userId, searchPattern, searchPattern, searchPattern]);
      
      return { success: true, data: result.values as PasswordEntry[] || [] };
    } catch (error: any) {
      console.error('Error buscando contraseñas:', error);
      return { success: false, error: error.message };
    }
  }

  // CRUD para CATEGORÍAS
  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseResponse<Category>> {
    try {
      await this.ensureDbReady();
      const now = new Date().toISOString();
      
      const query = `
        INSERT INTO categories (user_id, name, color, icon, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      const result = await this.database.run(query, [
        category.user_id,
        category.name,
        category.color,
        category.icon,
        now,
        now
      ]);

      const newCategory: Category = {
        id: result.changes?.lastId,
        ...category,
        created_at: now,
        updated_at: now
      };

      return { success: true, data: newCategory, message: 'Categoría creada exitosamente' };
    } catch (error: any) {
      console.error('Error creando categoría:', error);
      return { success: false, error: error.message };
    }
  }

  async getCategoriesByUserId(userId: number): Promise<DatabaseResponse<Category[]>> {
    try {
      await this.ensureDbReady();
      const query = 'SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC';
      const result = await this.database.query(query, [userId]);
      
      return { success: true, data: result.values as Category[] || [] };
    } catch (error: any) {
      console.error('Error obteniendo categorías:', error);
      return { success: false, error: error.message };
    }
  }

  // CRUD para LOGS DE SEGURIDAD
  async createSecurityLog(log: Omit<SecurityLog, 'id' | 'created_at'>): Promise<DatabaseResponse<SecurityLog>> {
    try {
      await this.ensureDbReady();
      const now = new Date().toISOString();
      
      const query = `
        INSERT INTO security_logs (user_id, action, details, ip_address, user_agent, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      const result = await this.database.run(query, [
        log.user_id,
        log.action,
        log.details,
        log.ip_address || null,
        log.user_agent || null,
        now
      ]);

      const newLog: SecurityLog = {
        id: result.changes?.lastId,
        ...log,
        created_at: now
      };

      return { success: true, data: newLog };
    } catch (error: any) {
      console.error('Error creando log de seguridad:', error);
      return { success: false, error: error.message };
    }
  }

  // CRUD para CONFIGURACIONES
  async setSetting(userId: number, key: string, value: string): Promise<DatabaseResponse<AppSettings>> {
    try {
      await this.ensureDbReady();
      const now = new Date().toISOString();
      
      const query = `
        INSERT OR REPLACE INTO app_settings (user_id, setting_key, setting_value, created_at, updated_at)
        VALUES (?, ?, ?, COALESCE((SELECT created_at FROM app_settings WHERE user_id = ? AND setting_key = ?), ?), ?)
      `;
      
      await this.database.run(query, [userId, key, value, userId, key, now, now]);
      
      const getSetting = await this.getSetting(userId, key);
      return getSetting;
    } catch (error: any) {
      console.error('Error guardando configuración:', error);
      return { success: false, error: error.message };
    }
  }

  async getSetting(userId: number, key: string): Promise<DatabaseResponse<AppSettings>> {
    try {
      await this.ensureDbReady();
      const query = 'SELECT * FROM app_settings WHERE user_id = ? AND setting_key = ?';
      const result = await this.database.query(query, [userId, key]);
      
      if (result.values && result.values.length > 0) {
        return { success: true, data: result.values[0] as AppSettings };
      }
      
      return { success: false, error: 'Configuración no encontrada' };
    } catch (error: any) {
      console.error('Error obteniendo configuración:', error);
      return { success: false, error: error.message };
    }
  }

  // Utilidades
  async closeDatabase(): Promise<void> {
    try {
      if (this.database) {
        await this.database.close();
      }
    } catch (error) {
      console.error('Error cerrando base de datos:', error);
    }
  }

  async getDatabaseInfo(): Promise<any> {
    try {
      await this.ensureDbReady();
      
      const queries = [
        'SELECT COUNT(*) as users FROM users',
        'SELECT COUNT(*) as passwords FROM password_entries',
        'SELECT COUNT(*) as categories FROM categories',
        'SELECT COUNT(*) as logs FROM security_logs'
      ];

      const results = await Promise.all(
        queries.map(query => this.database.query(query, []))
      );

      return {
        platform: this.isWeb ? 'Web' : 'Mobile',
        database: this.dbName,
        users: results[0].values?.[0]?.users || 0,
        passwords: results[1].values?.[0]?.passwords || 0,
        categories: results[2].values?.[0]?.categories || 0,
        logs: results[3].values?.[0]?.logs || 0
      };
    } catch (error) {
      console.error('Error obteniendo info de DB:', error);
      return null;
    }
  }
}
