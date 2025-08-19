import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey: string = 'PassVault2025SecretKey!@#'; // En producción, esto debe venir de variables de entorno

  constructor() { }

  /**
   * Encripta una contraseña usando AES-256
   * @param password - Contraseña a encriptar
   * @returns Contraseña encriptada
   */
  encryptPassword(password: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(password, this.secretKey).toString();
      return encrypted;
    } catch (error) {
      console.error('Error al encriptar contraseña:', error);
      throw new Error('Error en el proceso de encriptación');
    }
  }

  /**
   * Desencripta una contraseña
   * @param encryptedPassword - Contraseña encriptada
   * @returns Contraseña desencriptada
   */
  decryptPassword(encryptedPassword: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedPassword, this.secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted;
    } catch (error) {
      console.error('Error al desencriptar contraseña:', error);
      throw new Error('Error en el proceso de desencriptación');
    }
  }

  /**
   * Genera un hash seguro para contraseñas de usuario (usando SHA-256)
   * @param password - Contraseña del usuario
   * @returns Hash de la contraseña
   */
  hashUserPassword(password: string): string {
    return CryptoJS.SHA256(password + this.secretKey).toString();
  }

  /**
   * Verifica si una contraseña coincide con su hash
   * @param password - Contraseña a verificar
   * @param hash - Hash almacenado
   * @returns true si coincide, false si no
   */
  verifyPassword(password: string, hash: string): boolean {
    const passwordHash = this.hashUserPassword(password);
    return passwordHash === hash;
  }

  /**
   * Genera una clave de encriptación basada en el PIN del usuario
   * @param userPin - PIN del usuario
   * @returns Clave derivada
   */
  generateUserKey(userPin: string): string {
    return CryptoJS.PBKDF2(userPin, this.secretKey, {
      keySize: 256/32,
      iterations: 1000
    }).toString();
  }

  /**
   * Encripta datos con la clave del usuario
   * @param data - Datos a encriptar
   * @param userPin - PIN del usuario
   * @returns Datos encriptados
   */
  encryptWithUserKey(data: string, userPin: string): string {
    const userKey = this.generateUserKey(userPin);
    return CryptoJS.AES.encrypt(data, userKey).toString();
  }

  /**
   * Desencripta datos con la clave del usuario
   * @param encryptedData - Datos encriptados
   * @param userPin - PIN del usuario
   * @returns Datos desencriptados
   */
  decryptWithUserKey(encryptedData: string, userPin: string): string {
    try {
      const userKey = this.generateUserKey(userPin);
      const bytes = CryptoJS.AES.decrypt(encryptedData, userKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Error al desencriptar con clave de usuario:', error);
      throw new Error('PIN incorrecto o datos corruptos');
    }
  }
}
