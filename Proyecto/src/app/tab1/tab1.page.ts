import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Clipboard } from '@capacitor/clipboard';
import { PasswordGenerator } from '../services/password-generator';
import { EncryptionService } from '../services/encryption.service';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonItem, 
  IonLabel, 
  IonRange, 
  IonCheckbox, 
  IonButton, 
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonProgressBar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { keyOutline, copyOutline, refreshOutline, wifiOutline, shieldOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonCard, 
    IonCardContent, 
    IonItem, 
    IonLabel, 
    IonRange, 
    IonCheckbox, 
    IonButton, 
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonProgressBar
  ]
})
export class Tab1Page {
  passwordLength = 16;
  includeNumbers = true;
  includeSymbols = true;
  includeUppercase = true;
  includeLowercase = true;
  passwordType: 'muy-segura' | 'personalizada' | 'wpa' | 'wpa2' | 'passphrase' = 'muy-segura';
  generatedPassword = "Haz clic en 'Generar'...";
  encryptedPassword = '';
  passwordStrength: any = null;

  constructor(
    private toastController: ToastController,
    private passwordGenerator: PasswordGenerator,
    private encryptionService: EncryptionService
  ) {
    addIcons({ keyOutline, copyOutline, refreshOutline, wifiOutline, shieldOutline });
  }

  generatePassword() {
    let password = '';

    if (this.passwordType === 'muy-segura') {
      // Contraseña muy segura: longitud fija de 50 caracteres con máxima seguridad
      this.passwordLength = 50;
      password = this.passwordGenerator.generatePassword({
        length: 50,
        includeNumbers: true,
        includeSymbols: true,
        includeUppercase: true,
        includeLowercase: true,
        type: 'personalizada'
      });
    } else if (this.passwordType === 'passphrase') {
      password = this.passwordGenerator.generatePassphrase(4, '-');
    } else if (this.passwordType === 'wpa' || this.passwordType === 'wpa2') {
      // Para WPA/WPA2, usar longitud mínima de 16 caracteres para mayor seguridad
      const wpaLength = Math.max(16, this.passwordLength);
      password = this.passwordGenerator.generateWPAPassword(wpaLength);
    } else {
      // Tipo personalizada (antes era general)
      password = this.passwordGenerator.generatePassword({
        length: this.passwordLength,
        includeNumbers: this.includeNumbers,
        includeSymbols: this.includeSymbols,
        includeUppercase: this.includeUppercase,
        includeLowercase: this.includeLowercase,
        type: 'personalizada'
      });
    }

    this.generatedPassword = password;
    
    // Cifrar la contraseña generada
    try {
      this.encryptedPassword = this.encryptionService.encryptPassword(password);
    } catch (error) {
      console.error('Error al cifrar la contraseña:', error);
    }

    // Evaluar fortaleza
    this.passwordStrength = this.passwordGenerator.evaluatePasswordStrength(password);
  }

  async copyPassword() {
    if (this.generatedPassword && this.generatedPassword !== "Haz clic en 'Generar'...") {
      try {
        await Clipboard.write({
          string: this.generatedPassword
        });
        
        const toast = await this.toastController.create({
          message: 'Contraseña copiada al portapapeles',
          duration: 2000,
          color: 'success'
        });
        toast.present();
      } catch (error) {
        // Fallback para navegadores que no soportan Capacitor
        navigator.clipboard.writeText(this.generatedPassword);
        const toast = await this.toastController.create({
          message: 'Contraseña copiada al portapapeles',
          duration: 2000,
          color: 'success'
        });
        toast.present();
      }
    }
  }

  async copyEncryptedPassword() {
    if (this.encryptedPassword) {
      try {
        await Clipboard.write({
          string: this.encryptedPassword
        });
        
        const toast = await this.toastController.create({
          message: 'Contraseña cifrada copiada al portapapeles',
          duration: 2000,
          color: 'success'
        });
        toast.present();
      } catch (error) {
        navigator.clipboard.writeText(this.encryptedPassword);
        const toast = await this.toastController.create({
          message: 'Contraseña cifrada copiada al portapapeles',
          duration: 2000,
          color: 'success'
        });
        toast.present();
      }
    }
  }

  onPasswordTypeChange() {
    // Ajustar configuraciones según el tipo de contraseña
    if (this.passwordType === 'muy-segura') {
      this.passwordLength = 50;
      this.includeNumbers = true;
      this.includeSymbols = true;
      this.includeUppercase = true;
      this.includeLowercase = true;
    } else if (this.passwordType === 'wpa' || this.passwordType === 'wpa2') {
      this.passwordLength = Math.max(16, this.passwordLength);
      this.includeNumbers = true;
      this.includeSymbols = true;
      this.includeUppercase = true;
      this.includeLowercase = true;
    } else if (this.passwordType === 'passphrase') {
      this.passwordLength = 4; // Número de palabras
    }
  }

  getStrengthColor(): string {
    if (!this.passwordStrength) return 'medium';
    
    switch (this.passwordStrength.level) {
      case 'very-weak': return 'danger';
      case 'weak': return 'warning';
      case 'fair': return 'medium';
      case 'good': return 'success';
      case 'strong': return 'primary';
      default: return 'medium';
    }
  }

  getStrengthValue(): number {
    return this.passwordStrength ? this.passwordStrength.score / 100 : 0;
  }
}
