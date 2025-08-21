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
  private userPin: string = '';

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

  // Registro de usuario
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

  // Login de usuario
  async login(email: string, password: string): Promise<boolean> {
    try {
      const users = this.getUsers();
      const passwordHash = this.encryptionService.hashUserPassword(password);
      
      const user = users.find(u => u.email === email && u.password === passwordHash);
      
      if (user) {
        // Usuario encontrado - logueado pero necesita PIN
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isUserLoggedInSubject.next(true);
        this.isAuthenticatedSubject.next(false); // Requiere PIN

        console.log('✅ Login exitoso - PIN requerido');
        return true;
      }
      
      console.log('❌ Credenciales incorrectas');
      return false;
    } catch (error) {
      console.error('Error en login local:', error);
      return false;
    }
  }

  // Autenticación con PIN
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
    return this.isAuthenticatedSubject.value;
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

  // Actualizar usuario
  updateUser(updatedUser: Partial<User>): boolean {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return false;
      }

      // Actualizar usuario actual
      const updatedUserData = { ...currentUser, ...updatedUser };
      
      // Actualizar en la lista de usuarios
      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      
      if (userIndex !== -1) {
        users[userIndex] = updatedUserData;
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        
        // Actualizar usuario actual
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUserData));
        this.currentUserSubject.next(updatedUserData);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      return false;
    }
  }
}
