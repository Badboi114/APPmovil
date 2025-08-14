import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Clipboard } from '@capacitor/clipboard';
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
  IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { keyOutline, copyOutline, refreshOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
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
    IonIcon
  ]
})
export class Tab1Page {
  passwordLength = 12;
  includeNumbers = true;
  includeSymbols = true;
  generatedPassword = "Haz clic en 'Generar'...";

  constructor(private toastController: ToastController) {
    addIcons({ keyOutline, copyOutline, refreshOutline });
  }

  generatePassword() {
    let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    if (this.includeNumbers) {
      charset += '0123456789';
    }
    
    if (this.includeSymbols) {
      charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }
    
    let password = '';
    for (let i = 0; i < this.passwordLength; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    this.generatedPassword = password;
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
}
