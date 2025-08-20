import { EncryptionService } from './services/encryption.service';
import { PasswordGenerator } from './services/password-generator';

// Test básico para verificar el cifrado
export function testEncryption() {
  const encryptionService = new EncryptionService();
  const passwordGenerator = new PasswordGenerator();

  console.log('🔐 Iniciando pruebas de cifrado...');

  // Prueba 1: Cifrado básico
  const testPassword = 'TestPassword123!';
  const encrypted = encryptionService.encryptPassword(testPassword);
  const decrypted = encryptionService.decryptPassword(encrypted);
  
  console.log('✅ Prueba 1 - Cifrado básico:');
  console.log('  Original:', testPassword);
  console.log('  Cifrado:', encrypted);
  console.log('  Descifrado:', decrypted);
  console.log('  ¿Correcto?', testPassword === decrypted);

  // Prueba 2: Generación de contraseña WPA
  const wpaPassword = passwordGenerator.generateWPAPassword(16);
  const encryptedWPA = encryptionService.encryptPassword(wpaPassword);
  const decryptedWPA = encryptionService.decryptPassword(encryptedWPA);
  
  console.log('✅ Prueba 2 - Contraseña WPA/WPA2:');
  console.log('  Generada:', wpaPassword);
  console.log('  Longitud:', wpaPassword.length);
  console.log('  Cifrada:', encryptedWPA);
  console.log('  Descifrada:', decryptedWPA);
  console.log('  ¿Correcto?', wpaPassword === decryptedWPA);

  // Prueba 3: Evaluación de fortaleza
  const strength = passwordGenerator.evaluatePasswordStrength(wpaPassword);
  console.log('✅ Prueba 3 - Evaluación de fortaleza:');
  console.log('  Puntuación:', strength.score);
  console.log('  Nivel:', strength.level);
  console.log('  Sugerencias:', strength.feedback);

  // Prueba 4: Passphrase
  const passphrase = passwordGenerator.generatePassphrase(4, '-');
  console.log('✅ Prueba 4 - Frase de contraseña:');
  console.log('  Generada:', passphrase);

  console.log('🎉 ¡Todas las pruebas completadas!');
}
