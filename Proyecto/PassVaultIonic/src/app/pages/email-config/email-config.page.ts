import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-email-config',
  templateUrl: './email-config.page.html',
  styleUrls: ['./email-config.page.scss'],
})
export class EmailConfigPage implements OnInit {

  serviceId: string = '';
  templateId: string = '';
  publicKey: string = '';
  testEmail: string = 'wijanlu@gmail.com'; // Email por defecto
  
  configLoaded: boolean = false;
  testingConfiguration: boolean = false;
  emailLogs: any[] = [];

  constructor(
    private emailService: EmailService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadCurrentConfig();
    this.loadEmailLogs();
  }

  loadCurrentConfig() {
    this.configLoaded = this.emailService.isEmailConfigured();
    if (this.configLoaded) {
      this.showToast('✅ Sistema de email ya configurado y funcional', 'success');
    } else {
      this.showToast('📧 Configure el sistema de email para mayor funcionalidad', 'medium');
    }
  }

  loadEmailLogs() {
    this.emailLogs = this.emailService.getEmailLogs().slice(-5); // Últimos 5
  }

  async saveConfiguration() {
    if (!this.serviceId || !this.templateId || !this.publicKey) {
      await this.showToast('Por favor, completa todos los campos', 'warning');
      return;
    }

    try {
      const success = await this.emailService.configureEmail(
        this.serviceId, 
        this.templateId, 
        this.publicKey
      );
      
      if (success) {
        await this.showToast('✅ Configuración guardada exitosamente', 'success');
        this.configLoaded = true;
        this.loadEmailLogs();
      } else {
        await this.showToast('❌ Error guardando configuración', 'danger');
      }
    } catch (error) {
      await this.showToast('❌ Error guardando configuración', 'danger');
    }
  }

  async testConfiguration() {
    if (!this.testEmail) {
      await this.showToast('Por favor, ingresa un email de prueba', 'warning');
      return;
    }

    try {
      this.testingConfiguration = true;
      await this.showToast('📧 Enviando email de prueba...', 'medium');
      
      const testPin = Math.floor(1000 + Math.random() * 9000).toString();
      const success = await this.emailService.sendPin(
        this.testEmail, 
        testPin, 
        'Usuario de Prueba'
      );
      
      if (success) {
        await this.showToast('✅ Email de prueba enviado correctamente', 'success');
        this.loadEmailLogs(); // Actualizar logs
      } else {
        await this.showToast('❌ Error enviando email de prueba', 'danger');
      }
    } catch (error) {
      await this.showToast('❌ Error en la prueba', 'danger');
    } finally {
      this.testingConfiguration = false;
    }
  }

  useQuickSetup() {
    this.serviceId = 'service_passvault';
    this.templateId = 'template_pin_email';
    this.publicKey = 'pk_functional_2024';
    this.saveConfiguration();
  }

  async resetConfiguration() {
    this.serviceId = '';
    this.templateId = '';
    this.publicKey = '';
    this.configLoaded = false;
    this.emailService.clearEmailLogs();
    this.emailLogs = [];
    await this.showToast('🔄 Configuración reiniciada', 'medium');
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }
}
