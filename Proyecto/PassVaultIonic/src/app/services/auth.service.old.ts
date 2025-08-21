import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EmailService } from './email.service';
import { EncryptionService } from './encryption.service';
import { DatabaseService, User as DBUser } from './database.service';
import { HttpClient } from '@angular/common/http';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  pin: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isUserLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public isUserLoggedIn$ = this.isUserLoggedInSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly USERS_KEY = 'passvault_users';
  private readonly CURRENT_USER_KEY = 'passvault_current_user';
  private userPin: string = ''; // PIN desencriptado para uso en sesión

  constructor(
    private emailService: EmailService,
    private encryptionService: EncryptionService,
    private databaseService: DatabaseService,
    private http: HttpClient
  ) {
    console.log('AuthService constructor iniciado');
    this.loadCurrentUser();
  }

  // Cargar usuario actual al inicializar
  private loadCurrentUser() {
    console.log('Cargando usuario actual...');
    const storedUser = localStorage.getItem(this.CURRENT_USER_KEY);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log('Usuario encontrado en localStorage:', user.email);
        this.currentUserSubject.next(user);
        this.isUserLoggedInSubject.next(true);
        // NO autenticar automáticamente - requerir PIN
        this.isAuthenticatedSubject.next(false);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem(this.CURRENT_USER_KEY);
      }
    } else {
      console.log('No hay usuario almacenado');
      this.isUserLoggedInSubject.next(false);
      this.isAuthenticatedSubject.next(false);
    }
  }

  // Generar PIN aleatorio de 4 dígitos
  private generatePin(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // Registro de usuario (SIN verificación por email)
  async register(name: string, email: string, password: string): Promise<{success: boolean, pin?: string}> {
    try {
      const existingUsers = this.getUsers();
      
      // Verificar si el usuario ya existe
      if (existingUsers.find(user => user.email === email)) {
        console.log('Usuario ya existe');
        return { success: false };
      }

      // Crear nuevo usuario
      const pin = this.generatePin();
      const passwordHash = this.encryptionService.hashUserPassword(password);
      const pinHash = this.encryptionService.hashUserPassword(pin);

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password: passwordHash,
        pin: pinHash,
        createdAt: new Date()
      };

      // Intentar registro en base de datos si está disponible
      const isConnected = await this.checkDatabaseConnection();
      
      if (isConnected) {
        console.log('Registrando usuario en base de datos...');
        
        const dbUser: Omit<DBUser, 'id' | 'created_at' | 'updated_at'> = {
          email: newUser.email,
          name: newUser.name,
          password_hash: passwordHash,
          pin_hash: pinHash
        };

        try {
          const response = await this.databaseService.registerUser(dbUser).toPromise();
          
          if (response?.success) {
            newUser.id = response.user.id.toString();
            newUser.createdAt = new Date(response.user.created_at);
          }
        } catch (dbError) {
          console.log('Error en BD, continuando con registro local:', dbError);
        }
      }

      // Guardar usuario localmente
      existingUsers.push(newUser);
      localStorage.setItem(this.USERS_KEY, JSON.stringify(existingUsers));

      // NO autenticar automáticamente - requerir PIN después
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(newUser));

      console.log('✅ Usuario registrado exitosamente, PIN:', pin);
      return { success: true, pin: pin };
    } catch (error) {
      console.error('Error en registro local:', error);
      return { success: false };
    }
  }

  // Login de usuario (SIN verificación por PIN)
  async login(email: string, password: string): Promise<boolean> {
    try {
      // Verificar conexión con la base de datos
      const isConnected = await this.checkDatabaseConnection();
      
      if (isConnected) {
        return this.loginWithDatabase(email, password);
      } else {
        return this.loginLocally(email, password);
      }
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  }

  // Login con base de datos (SIN PIN)
  private async loginWithDatabase(email: string, password: string): Promise<boolean> {
    try {
      const passwordHash = this.encryptionService.hashUserPassword(password);
      
      const response = await this.databaseService.loginUser(email, passwordHash).toPromise();
      
      if (response?.success && response.user) {
        const dbUser = response.user;
        
        // Convertir usuario de BD a formato local
        const user: User = {
          id: dbUser.id.toString(),
          name: dbUser.name,
          email: dbUser.email,
          password: dbUser.password_hash,
          pin: dbUser.pin_hash,
          createdAt: new Date(dbUser.created_at)
        };

        // Solo marcar como logged in, NO como authenticated (requiere PIN)
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isUserLoggedInSubject.next(true);
        this.isAuthenticatedSubject.next(false); // Requiere PIN

        console.log('✅ Login con BD exitoso - PIN requerido');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error en login con BD:', error);
      return false;
    }
  }

  // Login local (localStorage) SIN PIN
  private async loginLocally(email: string, password: string): Promise<boolean> {
    try {
      const users = this.getUsers();
      const passwordHash = this.encryptionService.hashUserPassword(password);
      
      const user = users.find(u => u.email === email && u.password === passwordHash);
      
      if (user) {
        // Solo marcar como logged in, NO como authenticated (requiere PIN)
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isUserLoggedInSubject.next(true);
        this.isAuthenticatedSubject.next(false); // Requiere PIN

        console.log('✅ Login local exitoso - PIN requerido');
        return true;
      }
      
      console.log('❌ Credenciales incorrectas');
      return false;
    } catch (error) {
      console.error('Error en login local:', error);
      return false;
    }
  }

  // Autenticación con PIN (RESTAURADA)
  authenticate(pin: string): boolean {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        console.log('❌ No hay usuario logueado');
        return false;
      }

      const pinHash = this.encryptionService.hashUserPassword(pin);
      
      if (pinHash === currentUser.pin) {
        this.isAuthenticatedSubject.next(true);
        this.userPin = pin;
        console.log('✅ PIN correcto - Autenticado');
        return true;
      } else {
        console.log('❌ PIN incorrecto');
        return false;
      }
    } catch (error) {
      console.error('Error en autenticación PIN:', error);
      return false;
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.currentUserSubject.next(null);
    this.isUserLoggedInSubject.next(false);
    this.isAuthenticatedSubject.next(false);
    this.userPin = '';
  }

  // Verificar si está autenticado
  isLoggedIn(): boolean {
    return this.isUserLoggedInSubject.value;
  }

  // Verificar si el usuario está logueado
  isUserLoggedIn(): boolean {
    return this.isUserLoggedInSubject.value;
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Obtener todos los usuarios
  private getUsers(): User[] {
    try {
      const usersData = localStorage.getItem(this.USERS_KEY);
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      return [];
    }
  }

  // Regenerar PIN (ELIMINADO - ya no se usa)
  async regeneratePin(): Promise<boolean> {
    console.log('✅ Regeneración de PIN eliminada - ya no es necesaria');
    return true;
  }

  // Verificar conexión con la base de datos
  private async checkDatabaseConnection(): Promise<boolean> {
    try {
      const response = await this.http.get('http://localhost:3000/health').toPromise();
      return true;
    } catch (error) {
      console.log('Base de datos no disponible, usando localStorage');
      return false;
    }
  }

  // Guardar usuario localmente
  private saveUserLocally(user: User): void {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // Obtener PIN del usuario (ELIMINADO - ya no se usa)
  getUserPin(): string {
    return ''; // PIN ya no es necesario
  }

  // Establecer PIN del usuario (ELIMINADO - ya no se usa)
  setUserPin(pin: string): void {
    console.log('✅ PIN ya no es necesario');
  }

  // Actualizar perfil de usuario
  async updateUserProfile(name: string, email: string): Promise<boolean> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return false;
      }

      // Verificar si el email ya existe (si cambió)
      if (email !== currentUser.email) {
        const users = this.getUsers();
        const emailExists = users.some(u => u.email === email && u.id !== currentUser.id);
        if (emailExists) {
          throw new Error('Este email ya está registrado');
        }
      }

      // Actualizar usuario
      const updatedUser: User = {
        ...currentUser,
        name: name.trim(),
        email: email.trim().toLowerCase()
      };

      // Actualizar en localStorage
      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      }

      // Actualizar usuario actual
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);

      console.log('✅ Perfil actualizado exitosamente');
      return true;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return false;
    }
  }

  // Cambiar contraseña
  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return false;
      }

      // Verificar contraseña actual
      const currentPasswordHash = this.encryptionService.hashUserPassword(currentPassword);
      if (currentPasswordHash !== currentUser.password) {
        return false;
      }

      // Generar nueva contraseña hasheada
      const newPasswordHash = this.encryptionService.hashUserPassword(newPassword);

      // Actualizar usuario
      const updatedUser: User = {
        ...currentUser,
        password: newPasswordHash
      };

      // Actualizar en localStorage
      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      }

      // Actualizar usuario actual
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);

      console.log('✅ Contraseña cambiada exitosamente');
      return true;
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      return false;
    }
  }
}
