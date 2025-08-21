import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  
  constructor() {}

  // EmailService simplificado - ya no se usa verificación por email
  async sendPin(email: string, pin: string, userName: string): Promise<boolean> {
    console.log('� EmailService: Verificación por email eliminada');
    console.log(`✅ Usuario ${userName} (${email}) autenticado directamente`);
    return true;
  }

  async checkEmailService(): Promise<boolean> {
    return true;
  }

  async configureEmail(serviceId: string, templateId: string, publicKey: string): Promise<boolean> {
    console.log('🔄 Configuración de email ya no es necesaria');
    return true;
  }

  getEmailLogs(): any[] {
    return [];
  }

  clearEmailLogs() {
    // Ya no hay logs de email
  }

  isEmailConfigured(): boolean {
    return true; // Siempre configurado porque no se usa
  }
}
