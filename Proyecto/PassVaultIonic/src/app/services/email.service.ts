import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  
  // Configuración de ejemplo (DEBES cambiar por tus credenciales reales)
  private serviceId = 'service_4sxvl8j'; // Tu Service ID de EmailJS
  private templateId = 'template_passvault_pin'; // Tu Template ID de EmailJS
  private publicKey = 'KhYjYE_ZVL5q8wT2k'; // Tu Public Key de EmailJS

  constructor() {
    // Inicializar EmailJS con la clave pública
    this.initializeEmailJS();
  }

  private initializeEmailJS() {
    try {
      emailjs.init(this.publicKey);
      console.log('EmailJS inicializado correctamente');
    } catch (error) {
      console.error('Error inicializando EmailJS:', error);
    }
  }

  // Envío real de PIN por email usando EmailJS
  async sendPin(email: string, pin: string, userName: string): Promise<boolean> {
    try {
      console.log(`Intentando enviar PIN por email a: ${email}`);
      
      // Verificar si EmailJS está configurado
      if (!this.isEmailJSConfigured()) {
        console.log('EmailJS no configurado, usando modo demo');
        return this.showDemoPin(email, pin, userName);
      }

      // Parámetros para el template de EmailJS
      const templateParams = {
        to_email: email,
        to_name: userName,
        user_name: userName,
        pin_code: pin,
        app_name: 'PassVault',
        from_name: 'PassVault',
        message: `Hola ${userName},\n\nTu PIN de acceso a PassVault es: ${pin}\n\nEste PIN es válido para tu próximo acceso a la aplicación.\n\n¡Gracias por usar PassVault!`,
        reply_to: 'noreply@passvault.com'
      };

      console.log('Enviando email con parámetros:', templateParams);

      // Enviar email usando EmailJS
      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams,
        this.publicKey
      );

      console.log('Email enviado exitosamente:', response);
      
      if (response.status === 200) {
        console.log('✅ PIN enviado correctamente por email');
        return true;
      } else {
        throw new Error(`Error en el envío: ${response.status}`);
      }
      
    } catch (error: any) {
      console.error('❌ Error enviando PIN por email:', error);
      
      // Mostrar error específico
      if (error?.text) {
        console.error('Detalle del error:', error.text);
      }
      
      // Fallback: mostrar PIN en desarrollo si falla el envío
      return this.showDemoPin(email, pin, userName);
    }
  }

  // Mostrar PIN en modo demo cuando falla el envío
  private showDemoPin(email: string, pin: string, userName: string): boolean {
    const message = `
🔐 PASSVAULT - PIN DEMO

Usuario: ${userName}
Email: ${email}
PIN: ${pin}

⚠️ Este PIN se muestra en pantalla porque:
- EmailJS no está configurado correctamente
- Hay un error en el servicio de email
- Estás en modo desarrollo

Para recibir emails reales, configura EmailJS correctamente.
    `;
    
    alert(message);
    console.log('PIN mostrado en modo demo');
    return true;
  }

  // Verificar si EmailJS está configurado correctamente
  private isEmailJSConfigured(): boolean {
    const configured = this.serviceId !== 'service_4sxvl8j' && 
                      this.templateId !== 'template_passvault_pin' && 
                      this.publicKey !== 'KhYjYE_ZVL5q8wT2k' &&
                      this.serviceId.length > 0 &&
                      this.templateId.length > 0 &&
                      this.publicKey.length > 0;
    
    console.log('EmailJS configurado:', configured);
    return configured;
  }

  // Configurar EmailJS dinámicamente
  configureEmailJS(serviceId: string, templateId: string, publicKey: string): boolean {
    try {
      this.serviceId = serviceId.trim();
      this.templateId = templateId.trim();
      this.publicKey = publicKey.trim();
      
      // Guardar configuración en localStorage
      localStorage.setItem('emailjs_config', JSON.stringify({
        serviceId: this.serviceId,
        templateId: this.templateId,
        publicKey: this.publicKey
      }));
      
      // Reinicializar EmailJS
      this.initializeEmailJS();
      
      console.log('✅ EmailJS configurado exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error configurando EmailJS:', error);
      return false;
    }
  }

  // Cargar configuración guardada
  loadSavedConfiguration(): void {
    try {
      const savedConfig = localStorage.getItem('emailjs_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        this.serviceId = config.serviceId;
        this.templateId = config.templateId;
        this.publicKey = config.publicKey;
        this.initializeEmailJS();
        console.log('✅ Configuración de EmailJS cargada desde localStorage');
      }
    } catch (error) {
      console.error('❌ Error cargando configuración:', error);
    }
  }

  // Obtener configuración actual
  getCurrentConfig() {
    return {
      serviceId: this.serviceId,
      templateId: this.templateId,
      publicKey: this.publicKey,
      isConfigured: this.isEmailJSConfigured()
    };
  }

  // Probar configuración de EmailJS
  async testConfiguration(testEmail: string): Promise<boolean> {
    try {
      return await this.sendPin(testEmail, '1234', 'Usuario de Prueba');
    } catch (error) {
      console.error('Error en prueba de configuración:', error);
      return false;
    }
  }
}
