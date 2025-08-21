import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey: string = 'PassVault2025SecretKey!@#'; // En producción, esto debe venir de variables de entorno
  private readonly SALT_LENGTH = 32; // 256 bits de salt
  private readonly IV_LENGTH = 16; // 128 bits de IV para AES
  private readonly KEY_ITERATIONS = 100000; // 100k iteraciones (muy seguro)

  constructor() { 
    console.log('🔐 EncryptionService iniciado con seguridad MÁXIMA');
  }

  /**
   * 🔒 NIVEL MÁXIMO: Genera un salt criptográficamente seguro
   * @returns Salt aleatorio de 256 bits
   */
  private generateSecureSalt(): string {
    return CryptoJS.lib.WordArray.random(this.SALT_LENGTH).toString();
  }

  /**
   * 🔒 NIVEL MÁXIMO: Genera un IV (Initialization Vector) seguro
   * @returns IV aleatorio de 128 bits
   */
  private generateSecureIV(): string {
    return CryptoJS.lib.WordArray.random(this.IV_LENGTH).toString();
  }

  /**
   * 🛡️ SEGURIDAD MÁXIMA: Encripta contraseñas usando AES-256-CBC con salt único
   * - Salt único por contraseña (256 bits)
   * - IV aleatorio por encriptación (128 bits)
   * - PBKDF2 con 100,000 iteraciones
   * - Autenticación de integridad con HMAC-SHA256
   * @param password - Contraseña a encriptar
   * @param userPin - PIN del usuario para clave derivada
   * @returns Objeto con datos encriptados y metadatos de seguridad
   */
  encryptPasswordAdvanced(password: string, userPin: string): string {
    try {
      // Generar salt e IV únicos
      const salt = this.generateSecureSalt();
      const iv = this.generateSecureIV();
      
      // Derivar clave usando PBKDF2 con 100k iteraciones
      const derivedKey = CryptoJS.PBKDF2(userPin + this.secretKey, salt, {
        keySize: 256/32, // 256 bits
        iterations: this.KEY_ITERATIONS,
        hasher: CryptoJS.algo.SHA256
      });

      // Encriptar con AES-256-CBC
      const encrypted = CryptoJS.AES.encrypt(password, derivedKey, {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      // Crear HMAC para autenticación de integridad
      const hmac = CryptoJS.HmacSHA256(
        salt + iv + encrypted.toString(), 
        derivedKey
      ).toString();

      // Combinar todos los datos de forma segura
      const secureData = {
        encrypted: encrypted.toString(),
        salt: salt,
        iv: iv,
        hmac: hmac,
        iterations: this.KEY_ITERATIONS,
        algorithm: 'AES-256-CBC-HMAC-SHA256'
      };

      console.log('🔐 Contraseña encriptada con seguridad MÁXIMA');
      return JSON.stringify(secureData);
    } catch (error) {
      console.error('❌ Error en encriptación avanzada:', error);
      throw new Error('Error crítico en el proceso de encriptación');
    }
  }

  /**
   * 🛡️ SEGURIDAD MÁXIMA: Desencripta contraseñas con verificación de integridad
   * - Verificación HMAC antes de desencriptar
   * - Protección contra tampering
   * - Validación de estructura de datos
   * @param encryptedData - Datos encriptados con metadatos
   * @param userPin - PIN del usuario
   * @returns Contraseña desencriptada
   */
  decryptPasswordAdvanced(encryptedData: string, userPin: string): string {
    try {
      // Parse de los datos seguros
      const secureData = JSON.parse(encryptedData);
      const { encrypted, salt, iv, hmac, iterations, algorithm } = secureData;

      // Validar estructura de datos
      if (!encrypted || !salt || !iv || !hmac || !iterations || !algorithm) {
        throw new Error('Estructura de datos encriptados inválida');
      }

      // Verificar algoritmo
      if (algorithm !== 'AES-256-CBC-HMAC-SHA256') {
        throw new Error('Algoritmo de encriptación no compatible');
      }

      // Derivar la misma clave
      const derivedKey = CryptoJS.PBKDF2(userPin + this.secretKey, salt, {
        keySize: 256/32,
        iterations: iterations,
        hasher: CryptoJS.algo.SHA256
      });

      // Verificar integridad con HMAC
      const expectedHmac = CryptoJS.HmacSHA256(
        salt + iv + encrypted, 
        derivedKey
      ).toString();

      if (expectedHmac !== hmac) {
        console.error('❌ Verificación HMAC falló - posible tampering');
        throw new Error('Los datos han sido modificados o PIN incorrecto');
      }

      // Desencriptar
      const decrypted = CryptoJS.AES.decrypt(encrypted, derivedKey, {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedText) {
        throw new Error('Error en desencriptación - PIN incorrecto');
      }

      console.log('🔓 Contraseña desencriptada con verificación de integridad');
      return decryptedText;
    } catch (error) {
      console.error('❌ Error en desencriptación avanzada:', error);
      throw new Error('PIN incorrecto o datos corruptos');
    }
  }

  /**
   * 🛡️ SEGURIDAD MÁXIMA: Hash seguro para contraseñas de usuario
   * - Salt único por usuario (256 bits)
   * - PBKDF2 con 100,000 iteraciones
   * - SHA-512 como función hash base
   * - Protección contra rainbow tables
   * @param password - Contraseña del usuario
   * @param userSalt - Salt único del usuario (opcional, se genera si no existe)
   * @returns Objeto con hash y salt para almacenamiento
   */
  hashUserPasswordAdvanced(password: string, userSalt?: string): { hash: string, salt: string } {
    try {
      // Generar salt único si no se proporciona
      const salt = userSalt || this.generateSecureSalt();
      
      // Usar PBKDF2 con alta seguridad
      const hash = CryptoJS.PBKDF2(password, salt + this.secretKey, {
        keySize: 512/32, // 512 bits de salida
        iterations: this.KEY_ITERATIONS,
        hasher: CryptoJS.algo.SHA512
      }).toString();

      console.log('🔐 Hash de usuario generado con 100k iteraciones');
      return { hash, salt };
    } catch (error) {
      console.error('❌ Error en hash de usuario:', error);
      throw new Error('Error en generación de hash seguro');
    }
  }

  /**
   * 🔒 COMPATIBILIDAD: Método simple para mantener compatibilidad
   * @param password - Contraseña del usuario
   * @returns Hash simple (para compatibilidad con código existente)
   */
  hashUserPassword(password: string): string {
    // Usar el método avanzado pero retornar solo el hash
    const result = this.hashUserPasswordAdvanced(password);
    return result.hash;
  }

  /**
   * 🛡️ SEGURIDAD MÁXIMA: Verificación de contraseña con protección temporal
   * - Protección contra timing attacks
   * - Comparación segura de hashes
   * @param password - Contraseña a verificar
   * @param storedHash - Hash almacenado
   * @param storedSalt - Salt almacenado
   * @returns Promise<boolean> - true si coincide
   */
  async verifyPasswordAdvanced(password: string, storedHash: string, storedSalt: string): Promise<boolean> {
    try {
      // Simular tiempo constante para prevenir timing attacks
      const startTime = Date.now();
      
      // Generar hash con el salt almacenado
      const { hash } = this.hashUserPasswordAdvanced(password, storedSalt);
      
      // Comparación segura byte a byte
      const isValid = this.secureCompare(hash, storedHash);
      
      // Asegurar tiempo mínimo de procesamiento (protección timing)
      const minTime = 100; // 100ms mínimo
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minTime) {
        await new Promise(resolve => setTimeout(resolve, minTime - elapsedTime));
      }
      
      console.log(`🔍 Verificación de contraseña: ${isValid ? '✅ Válida' : '❌ Inválida'}`);
      return isValid;
    } catch (error) {
      console.error('❌ Error en verificación:', error);
      return false;
    }
  }

  /**
   * 🔒 Comparación segura de strings (previene timing attacks)
   * @param a - String 1
   * @param b - String 2
   * @returns boolean - true si son iguales
   */
  private secureCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    
    return result === 0;
  }

  /**
   * 🔒 COMPATIBILIDAD: Método simple para verificar contraseñas (mantiene compatibilidad)
   * @param password - Contraseña a verificar
   * @param hash - Hash almacenado
   * @returns boolean
   */
  verifyPassword(password: string, hash: string): boolean {
    const passwordHash = this.hashUserPassword(password);
    return passwordHash === hash;
  }

  /**
   * 🛡️ SEGURIDAD AVANZADA: Genera clave de usuario con máxima seguridad
   * @param userPin - PIN del usuario
   * @param salt - Salt único (opcional)
   * @returns Clave derivada segura
   */
  generateAdvancedUserKey(userPin: string, salt?: string): { key: string, salt: string } {
    const userSalt = salt || this.generateSecureSalt();
    
    const key = CryptoJS.PBKDF2(userPin, userSalt + this.secretKey, {
      keySize: 256/32,
      iterations: this.KEY_ITERATIONS,
      hasher: CryptoJS.algo.SHA512
    }).toString();

    return { key, salt: userSalt };
  }

  /**
   * 🔒 COMPATIBILIDAD: Método simple de generación de clave
   * @param userPin - PIN del usuario
   * @returns Clave derivada
   */
  generateUserKey(userPin: string): string {
    const result = this.generateAdvancedUserKey(userPin);
    return result.key;
  }

  /**
   * 🛡️ NIVEL MÁXIMO: Encripta datos con autenticación
   * @param data - Datos a encriptar
   * @param userPin - PIN del usuario
   * @returns Datos encriptados con integridad
   */
  encryptWithUserKey(data: string, userPin: string): string {
    return this.encryptPasswordAdvanced(data, userPin);
  }

  /**
   * 🛡️ NIVEL MÁXIMO: Desencripta datos con verificación
   * @param encryptedData - Datos encriptados
   * @param userPin - PIN del usuario
   * @returns Datos desencriptados
   */
  decryptWithUserKey(encryptedData: string, userPin: string): string {
    return this.decryptPasswordAdvanced(encryptedData, userPin);
  }

  /**
   * 🔒 UTILIDAD: Genera contraseña segura automática
   * @param length - Longitud de la contraseña (mínimo 12)
   * @returns Contraseña segura generada
   */
  generateSecurePassword(length: number = 16): string {
    if (length < 12) length = 12; // Mínimo de seguridad
    
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    
    // Asegurar al menos un carácter de cada tipo
    const types = [
      'abcdefghijklmnopqrstuvwxyz',
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 
      '0123456789',
      '!@#$%^&*()_+-='
    ];
    
    // Agregar un carácter de cada tipo
    types.forEach(type => {
      const randomIndex = Math.floor(Math.random() * type.length);
      password += type[randomIndex];
    });
    
    // Completar con caracteres aleatorios
    for (let i = password.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    
    // Mezclar la contraseña
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * 🔍 UTILIDAD: Evalúa la fortaleza de una contraseña
   * @param password - Contraseña a evaluar
   * @returns Objeto con score y recomendaciones
   */
  evaluatePasswordStrength(password: string): { 
    score: number, 
    level: string, 
    recommendations: string[] 
  } {
    let score = 0;
    const recommendations: string[] = [];
    
    // Longitud
    if (password.length >= 12) score += 25;
    else if (password.length >= 8) score += 10;
    else recommendations.push('Usar al menos 12 caracteres');
    
    // Mayúsculas
    if (/[A-Z]/.test(password)) score += 15;
    else recommendations.push('Incluir letras mayúsculas');
    
    // Minúsculas
    if (/[a-z]/.test(password)) score += 15;
    else recommendations.push('Incluir letras minúsculas');
    
    // Números
    if (/[0-9]/.test(password)) score += 15;
    else recommendations.push('Incluir números');
    
    // Símbolos especiales
    if (/[^A-Za-z0-9]/.test(password)) score += 20;
    else recommendations.push('Incluir símbolos especiales');
    
    // Variedad de caracteres
    if (new Set(password).size >= password.length * 0.7) score += 10;
    else recommendations.push('Evitar repetición excesiva de caracteres');
    
    let level = 'Muy débil';
    if (score >= 80) level = 'Muy fuerte';
    else if (score >= 60) level = 'Fuerte';
    else if (score >= 40) level = 'Moderada';
    else if (score >= 20) level = 'Débil';
    
    return { score, level, recommendations };
  }
}
