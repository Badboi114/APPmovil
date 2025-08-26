import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordGenerator {

  /**
   * Genera una contraseña segura con opciones personalizables
   */
  generatePassword(options: {
    length: number;
    includeNumbers: boolean;
    includeSymbols: boolean;
    includeUppercase?: boolean;
    includeLowercase?: boolean;
  type?: 'general' | 'wpa' | 'wpa2' | 'personalizada';
  }): string {
    let charset = '';
    
    // Para contraseñas WPA/WPA2, usar caracteres más compatibles
    if (options.type === 'wpa' || options.type === 'wpa2') {
      return this.generateWPAPassword(options.length);
    }
    
    // Contraseña general
    if (options.includeLowercase !== false) {
      charset += 'abcdefghijklmnopqrstuvwxyz';
    }
    
    if (options.includeUppercase !== false) {
      charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    
    if (options.includeNumbers) {
      charset += '0123456789';
    }
    
    if (options.includeSymbols) {
      charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }
    
    return this.generateFromCharset(charset, options.length);
  }

  /**
   * Genera una contraseña específica para WPA/WPA2-Personal
   * Cumple con los estándares de seguridad WiFi
   */
  generateWPAPassword(length: number = 16): string {
    // WPA/WPA2 requiere entre 8-63 caracteres
    const minLength = Math.max(8, Math.min(length, 63));
    
    // Charset compatible con WPA/WPA2 (evita caracteres problemáticos)
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
    
    let password = '';
    
    // Asegurar que tenga al menos un carácter de cada tipo
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()-_=+';
    
    // Agregar al menos un carácter de cada tipo
    password += this.getRandomChar(uppercase);
    password += this.getRandomChar(lowercase);
    password += this.getRandomChar(numbers);
    password += this.getRandomChar(symbols);
    
    // Completar con caracteres aleatorios
    for (let i = password.length; i < minLength; i++) {
      password += this.getRandomChar(charset);
    }
    
    // Mezclar la contraseña para evitar patrones predecibles
    return this.shuffleString(password);
  }

  /**
   * Genera una frase de contraseña usando palabras aleatorias
   */
  generatePassphrase(wordCount: number = 4, separator: string = '-'): string {
    const words = [
      'mountain', 'river', 'ocean', 'forest', 'desert', 'valley', 'island', 'canyon',
      'storm', 'thunder', 'lightning', 'rainbow', 'sunset', 'sunrise', 'moonlight', 'starlight',
      'eagle', 'wolf', 'bear', 'lion', 'tiger', 'dolphin', 'whale', 'shark',
      'fire', 'water', 'earth', 'wind', 'crystal', 'diamond', 'silver', 'golden',
      'brave', 'strong', 'swift', 'wise', 'noble', 'fierce', 'gentle', 'bright',
      'castle', 'tower', 'bridge', 'garden', 'palace', 'temple', 'fortress', 'sanctuary'
    ];
    
    const selectedWords = [];
    for (let i = 0; i < wordCount; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      selectedWords.push(words[randomIndex]);
    }
    
    // Capitalizar primera letra de cada palabra y agregar números aleatorios
    const passphrase = selectedWords
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(separator);
    
    // Agregar algunos números al final para mayor seguridad
    const randomNumbers = Math.floor(Math.random() * 999) + 100;
    return `${passphrase}${separator}${randomNumbers}`;
  }

  /**
   * Evalúa la fortaleza de una contraseña
   */
  evaluatePasswordStrength(password: string): {
    score: number;
    level: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong';
    feedback: string[];
  } {
    let score = 0;
    const feedback = [];
    
    // Longitud
    if (password.length >= 8) score += 25;
    else feedback.push('Usa al menos 8 caracteres');
    
    if (password.length >= 12) score += 25;
    
    // Variedad de caracteres
    if (/[a-z]/.test(password)) score += 10;
    else feedback.push('Incluye letras minúsculas');
    
    if (/[A-Z]/.test(password)) score += 10;
    else feedback.push('Incluye letras mayúsculas');
    
    if (/[0-9]/.test(password)) score += 10;
    else feedback.push('Incluye números');
    
    if (/[^A-Za-z0-9]/.test(password)) score += 20;
    else feedback.push('Incluye símbolos especiales');
    
    // Determinar nivel
    let level: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong';
    if (score < 30) level = 'very-weak';
    else if (score < 50) level = 'weak';
    else if (score < 70) level = 'fair';
    else if (score < 90) level = 'good';
    else level = 'strong';
    
    return { score, level, feedback };
  }

  private generateFromCharset(charset: string, length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

  private getRandomChar(charset: string): string {
    return charset.charAt(Math.floor(Math.random() * charset.length));
  }

  private shuffleString(str: string): string {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  }
}
