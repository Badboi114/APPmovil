import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton,
  IonText,
  IonIcon,
  IonList,
  IonSpinner,
  ToastController
} from '@ionic/angular/standalone';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-email-config',
  templateUrl: './email-config.page.html',
  styleUrls: ['./email-config.page.scss'],
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonButton,
    IonText,
    IonIcon,
    IonList,
    IonSpinner,
    CommonModule, 
    FormsModule
  ]
})
export class EmailConfigPage implements OnInit {
  serviceId: string = '';
  templateId: string = '';
  publicKey: string = '';
  testEmail: string = '';
  isTesting: boolean = false;
  configLoaded: boolean = false;

  constructor(
    private emailService: EmailService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadExistingConfiguration();
  }

  loadExistingConfiguration() {
    const config = this.emailService.getCurrentConfig();
    if (config.isConfigured) {
      this.serviceId = config.serviceId;
      this.templateId = config.templateId;
      this.publicKey = config.publicKey;
      this.configLoaded = true;
    }
  }

  async saveConfiguration() {
    if (!this.serviceId || !this.templateId || !this.publicKey) {
      await this.showToast('Por favor, completa todos los campos', 'warning');
      return;
    }

    try {
      const success = this.emailService.configureEmailJS(this.serviceId, this.templateId, this.publicKey);
      
      if (success) {
        await this.showToast('✅ Configuración guardada exitosamente', 'success');
      } else {
        await this.showToast('❌ Error guardando configuración', 'danger');
      }
    } catch (error) {
      await this.showToast('❌ Error guardando configuración', 'danger');
    }
  }

  async testConfiguration() {
    if (!this.testEmail) {
      await this.showToast('Por favor, ingresa un email para prueba', 'warning');
      return;
    }

    if (!this.serviceId || !this.templateId || !this.publicKey) {
      await this.showToast('Por favor, configura EmailJS primero', 'warning');
      return;
    }

    this.isTesting = true;
    
    try {
      // Guardar configuración primero
      this.emailService.configureEmailJS(this.serviceId, this.templateId, this.publicKey);
      
      // Probar envío
      const success = await this.emailService.testConfiguration(this.testEmail);
      
      if (success) {
        await this.showToast('✅ Email de prueba enviado. Revisa tu bandeja de entrada.', 'success');
      } else {
        await this.showToast('❌ Error enviando email de prueba', 'danger');
      }
    } catch (error) {
      await this.showToast('❌ Error en la prueba', 'danger');
    } finally {
      this.isTesting = false;
    }
  }

  useQuickSetup() {
    // Configuración con credenciales reales que funcionan (puedes cambiar por las tuyas)
    this.serviceId = 'service_4sxvl8j';
    this.templateId = 'template_passvault_pin';
    this.publicKey = 'KhYjYE_ZVL5q8wT2k';
  }

  async resetConfiguration() {
    this.serviceId = '';
    this.templateId = '';
    this.publicKey = '';
    localStorage.removeItem('emailjs_config');
    await this.showToast('Configuración reiniciada', 'success');
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top'
    });
    toast.present();
  }
}
