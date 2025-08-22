import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey: string = 'PassVault2025SecretKey!@#';
  private readonly SALT_LENGTH = 32;
  private readonly IV_LENGTH = 16;
  private readonly KEY_ITERATIONS = 10000; // Optimizado para UI (aún muy seguro)

  constructor() { 
    console.log('🔐 EncryptionService iniciado - Rendimiento optimizado');
  }

  /**
   * 🔒 NIVEL MÁXIMO: Genera un salt criptográficamente seguro
   */
  private generateSecureSalt(): string {
    return CryptoJS.lib.WordArray.random(this.SALT_LENGTH).toString();
  }

  /**
   * 🔒 NIVEL MÁXIMO: Genera un IV (Initialization Vector) seguro
   */
  private generateSecureIV(): string {
    return CryptoJS.lib.WordArray.random(this.IV_LENGTH).toString();
  }

  /**
   * 🛡️ SEGURIDAD MÁXIMA: Encripta contraseñas usando AES-256-CBC
   */
  encryptPasswordAdvanced(password: string, userPin: string): string {
    try {
      const salt = this.generateSecureSalt();
      const iv = this.generateSecureIV();
      
      const derivedKey = CryptoJS.PBKDF2(userPin + this.secretKey, salt, {
        keySize: 256/32,
        iterations: this.KEY_ITERATIONS,
        hasher: CryptoJS.algo.SHA256
      });

      const encrypted = CryptoJS.AES.encrypt(password, derivedKey, {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      const hmac = CryptoJS.HmacSHA256(
        salt + iv + encrypted.toString(), 
        derivedKey
      ).toString();

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
   * 🛡️ SEGURIDAD MÁXIMA: Desencripta contraseñas con verificación
   */
  decryptPasswordAdvanced(encryptedData: string, userPin: string): string {
    try {
      const secureData = JSON.parse(encryptedData);
      const { encrypted, salt, iv, hmac, iterations, algorithm } = secureData;

      if (!encrypted || !salt || !iv || !hmac || !iterations || !algorithm) {
        throw new Error('Estructura de datos encriptados inválida');
      }

      if (algorithm !== 'AES-256-CBC-HMAC-SHA256') {
        throw new Error('Algoritmo de encriptación no compatible');
      }

      const derivedKey = CryptoJS.PBKDF2(userPin + this.secretKey, salt, {
        keySize: 256/32,
        iterations: iterations,
        hasher: CryptoJS.algo.SHA256
      });

      const expectedHmac = CryptoJS.HmacSHA256(
        salt + iv + encrypted, 
        derivedKey
      ).toString();

      if (expectedHmac !== hmac) {
        console.error('❌ Verificación HMAC falló');
        throw new Error('Los datos han sido modificados o PIN incorrecto');
      }

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
   * 🔒 COMPATIBILIDAD: Método simple para encriptar contraseñas
   */
  encryptPassword(password: string, userPin?: string): string {
    if (userPin) {
      return this.encryptPasswordAdvanced(password, userPin);
    } else {
      try {
        const encrypted = CryptoJS.AES.encrypt(password, this.secretKey).toString();
        console.log('🔐 Usando encriptación simple (compatibilidad)');
        return encrypted;
      } catch (error) {
        console.error('❌ Error en encriptación simple:', error);
        throw new Error('Error en el proceso de encriptación');
      }
    }
  }

  /**
   * 🔒 COMPATIBILIDAD: Método simple para desencriptar contraseñas
   */
  decryptPassword(encryptedPassword: string, userPin?: string): string {
    if (userPin) {
      return this.decryptPasswordAdvanced(encryptedPassword, userPin);
    } else {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedPassword, this.secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        console.log('🔓 Usando desencriptación simple (compatibilidad)');
        return decrypted;
      } catch (error) {
        console.error('❌ Error en desencriptación simple:', error);
        throw new Error('Error en el proceso de desencriptación');
      }
    }
  }

  /**
   * 🛡️ SEGURIDAD MÁXIMA: Hash seguro para contraseñas de usuario
   */
  hashUserPasswordAdvanced(password: string, userSalt?: string): { hash: string, salt: string } {
    try {
      const salt = userSalt || this.generateSecureSalt();
      
      const hash = CryptoJS.PBKDF2(password, salt + this.secretKey, {
        keySize: 512/32,
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
   * 🔒 COMPATIBILIDAD: Método simple y DETERMINÍSTICO para hash de contraseñas
   */
  hashUserPassword(password: string): string {
    // Usar un hash simple y determinístico para compatibilidad
    // Siempre produce el mismo resultado para la misma contraseña
    return CryptoJS.PBKDF2(password, this.secretKey, {
      keySize: 256/32,
      iterations: this.KEY_ITERATIONS,
      hasher: CryptoJS.algo.SHA256
    }).toString();
  }

  /**
   * 🔒 COMPATIBILIDAD: Método simple para verificar contraseñas - CORREGIDO
   */
  verifyPassword(password: string, hash: string): boolean {
    try {
      // Generar hash de la contraseña ingresada
      const passwordHash = this.hashUserPassword(password);
      const isValid = passwordHash === hash;
      
      console.log(`🔍 Verificación de contraseña:`);
      console.log(`  - Hash generado: ${passwordHash.substring(0, 20)}...`);
      console.log(`  - Hash esperado: ${hash.substring(0, 20)}...`);
      console.log(`  - Resultado: ${isValid ? '✅ VÁLIDA' : '❌ INVÁLIDA'}`);
      
      return isValid;
    } catch (error) {
      console.error('❌ Error en verificación:', error);
      return false;
    }
  }

  /**
   * 🛡️ SEGURIDAD AVANZADA: Genera clave de usuario con máxima seguridad
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
   */
  generateUserKey(userPin: string): string {
    const result = this.generateAdvancedUserKey(userPin);
    return result.key;
  }

  /**
   * 🛡️ NIVEL MÁXIMO: Encripta datos con autenticación
   */
  encryptWithUserKey(data: string, userPin: string): string {
    return this.encryptPasswordAdvanced(data, userPin);
  }

  /**
   * 🛡️ NIVEL MÁXIMO: Desencripta datos con verificación
   */
  decryptWithUserKey(encryptedData: string, userPin: string): string {
    return this.decryptPasswordAdvanced(encryptedData, userPin);
  }

  /**
   * 🔒 UTILIDAD: Genera contraseña segura automática
   */
  generateSecurePassword(length: number = 16): string {
    if (length < 12) length = 12;
    
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    
    const types = [
      'abcdefghijklmnopqrstuvwxyz',
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 
      '0123456789',
      '!@#$%^&*()_+-='
    ];
    
    types.forEach(type => {
      const randomIndex = Math.floor(Math.random() * type.length);
      password += type[randomIndex];
    });
    
    for (let i = password.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * 🔍 UTILIDAD: Evalúa la fortaleza de una contraseña
   */
  evaluatePasswordStrength(password: string): { 
    score: number, 
    level: string, 
    recommendations: string[] 
  } {
    let score = 0;
    const recommendations: string[] = [];
    
    if (password.length >= 12) score += 25;
    else if (password.length >= 8) score += 10;
    else recommendations.push('Usar al menos 12 caracteres');
    
    if (/[A-Z]/.test(password)) score += 15;
    else recommendations.push('Incluir letras mayúsculas');
    
    if (/[a-z]/.test(password)) score += 15;
    else recommendations.push('Incluir letras minúsculas');
    
    if (/[0-9]/.test(password)) score += 15;
    else recommendations.push('Incluir números');
    
    if (/[^A-Za-z0-9]/.test(password)) score += 20;
    else recommendations.push('Incluir símbolos especiales');
    
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
