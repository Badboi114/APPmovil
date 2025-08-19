import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { EncryptionService } from './encryption.service';

export interface User {
  id?: number;
  email: string;
  name: string;
  password_hash: string;
  pin_hash: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PasswordEntry {
  id?: number;
  user_id: number;
  title: string;
  username: string;
  password_encrypted: string;
  url?: string;
  notes_encrypted?: string;
  category?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface VaultData {
  id?: number;
  user_id: number;
  data_encrypted: string;
  data_type: 'password' | 'note' | 'card' | 'identity';
  created_at?: Date;
  updated_at?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private apiUrl = 'http://localhost:3001/api'; // URL del backend
  private isConnected = new BehaviorSubject<boolean>(false);
  public connectionStatus$ = this.isConnected.asObservable();

  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionService
  ) {
    this.checkConnection();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * Verifica la conexión con la base de datos
   */
  checkConnection(): Observable<any> {
    return new Observable(observer => {
      this.http.get(`${this.apiUrl}/health`).subscribe({
        next: (response) => {
          this.isConnected.next(true);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          this.isConnected.next(false);
          observer.error(error);
        }
      });
    });
  }

  /**
   * Registra un nuevo usuario en la base de datos
   */
  registerUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, user, { 
      headers: this.getAuthHeaders() 
    });
  }

  /**
   * Autentica un usuario
   */
  loginUser(email: string, password: string): Observable<any> {
    const passwordHash = this.encryptionService.hashUserPassword(password);
    return this.http.post(`${this.apiUrl}/users/login`, { 
      email, 
      password_hash: passwordHash 
    }, { 
      headers: this.getAuthHeaders() 
    });
  }

  /**
   * Verifica el PIN del usuario
   */
  verifyUserPin(userId: number, pin: string): Observable<any> {
    const pinHash = this.encryptionService.hashUserPassword(pin);
    return this.http.post(`${this.apiUrl}/users/verify-pin`, { 
      user_id: userId, 
      pin_hash: pinHash 
    }, { 
      headers: this.getAuthHeaders() 
    });
  }

  /**
   * Guarda una contraseña encriptada
   */
  savePassword(passwordEntry: Omit<PasswordEntry, 'id' | 'created_at' | 'updated_at'>, userPin: string): Observable<any> {
    // Encriptar la contraseña con la clave del usuario
    const encryptedPassword = this.encryptionService.encryptWithUserKey(passwordEntry.password_encrypted, userPin);
    const encryptedNotes = passwordEntry.notes_encrypted ? 
      this.encryptionService.encryptWithUserKey(passwordEntry.notes_encrypted, userPin) : '';

    const encryptedEntry = {
      ...passwordEntry,
      password_encrypted: encryptedPassword,
      notes_encrypted: encryptedNotes
    };

    return this.http.post(`${this.apiUrl}/passwords`, encryptedEntry, { 
      headers: this.getAuthHeaders() 
    });
  }

  /**
   * Obtiene todas las contraseñas del usuario
   */
  getUserPasswords(userId: number): Observable<PasswordEntry[]> {
    return this.http.get<PasswordEntry[]>(`${this.apiUrl}/passwords/user/${userId}`, { 
      headers: this.getAuthHeaders() 
    });
  }

  /**
   * Desencripta las contraseñas del usuario
   */
  decryptUserPasswords(passwords: PasswordEntry[], userPin: string): PasswordEntry[] {
    return passwords.map(password => ({
      ...password,
      password_encrypted: this.encryptionService.decryptWithUserKey(password.password_encrypted, userPin),
      notes_encrypted: password.notes_encrypted ? 
        this.encryptionService.decryptWithUserKey(password.notes_encrypted, userPin) : ''
    }));
  }

  /**
   * Actualiza una contraseña
   */
  updatePassword(passwordId: number, updatedData: Partial<PasswordEntry>, userPin: string): Observable<any> {
    if (updatedData.password_encrypted) {
      updatedData.password_encrypted = this.encryptionService.encryptWithUserKey(updatedData.password_encrypted, userPin);
    }
    if (updatedData.notes_encrypted) {
      updatedData.notes_encrypted = this.encryptionService.encryptWithUserKey(updatedData.notes_encrypted, userPin);
    }

    return this.http.put(`${this.apiUrl}/passwords/${passwordId}`, updatedData, { 
      headers: this.getAuthHeaders() 
    });
  }

  /**
   * Elimina una contraseña
   */
  deletePassword(passwordId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/passwords/${passwordId}`, { 
      headers: this.getAuthHeaders() 
    });
  }

  /**
   * Guarda datos genéricos en la bóveda
   */
  saveVaultData(vaultData: Omit<VaultData, 'id' | 'created_at' | 'updated_at'>, userPin: string): Observable<any> {
    const encryptedData = this.encryptionService.encryptWithUserKey(vaultData.data_encrypted, userPin);
    
    const encryptedVaultData = {
      ...vaultData,
      data_encrypted: encryptedData
    };

    return this.http.post(`${this.apiUrl}/vault`, encryptedVaultData, { 
      headers: this.getAuthHeaders() 
    });
  }

  /**
   * Obtiene datos de la bóveda del usuario
   */
  getUserVaultData(userId: number, dataType?: string): Observable<VaultData[]> {
    const url = dataType ? 
      `${this.apiUrl}/vault/user/${userId}?type=${dataType}` : 
      `${this.apiUrl}/vault/user/${userId}`;
    
    return this.http.get<VaultData[]>(url, { 
      headers: this.getAuthHeaders() 
    });
  }

  /**
   * Desencripta datos de la bóveda
   */
  decryptVaultData(vaultData: VaultData[], userPin: string): VaultData[] {
    return vaultData.map(data => ({
      ...data,
      data_encrypted: this.encryptionService.decryptWithUserKey(data.data_encrypted, userPin)
    }));
  }
}
