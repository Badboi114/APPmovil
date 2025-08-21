import { Injectable } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/angular';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  imageUrl: string;
  authentication: {
    idToken: string;
    accessToken: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  constructor() {
    this.initializeGoogleAuth();
  }

  private async initializeGoogleAuth() {
    try {
      if (!isPlatform('capacitor')) {
        // Para web/desarrollo, usar configuración temporal
        await GoogleAuth.initialize({
          clientId: 'YOUR_GOOGLE_CLIENT_ID_HERE', // Necesitas crear tu propio Client ID
          scopes: ['profile', 'email'],
          grantOfflineAccess: true,
        });
        console.log('✅ Google Auth inicializado para web (requiere Client ID válido)');
      } else {
        console.log('✅ Google Auth configurado para dispositivo móvil');
      }
    } catch (error) {
      console.error('❌ Error inicializando Google Auth:', error);
      console.log('💡 Necesitas configurar un Client ID válido de Google Cloud Console');
    }
  }

  async signInWithGoogle(): Promise<GoogleUser | null> {
    try {
      console.log('🔍 Iniciando autenticación con Google...');
      
      // Verificar si Google Auth está configurado correctamente
      if (!isPlatform('capacitor')) {
        // En web, verificar si tenemos Client ID válido
        const hasValidClientId = await this.checkGoogleConfig();
        if (!hasValidClientId) {
          console.error('❌ Google Auth no configurado correctamente');
          alert(`🔧 Google Auth requiere configuración:

1. Crear proyecto en Google Cloud Console
2. Configurar OAuth 2.0  
3. Actualizar Client ID en la aplicación

📋 Guía completa en: CONFIGURACION_GOOGLE_AUTH.md

⚡ Por ahora usa el registro manual que funciona perfectamente.`);
          return null;
        }
      }
      
      const result = await GoogleAuth.signIn();
      
      if (result) {
        console.log('✅ Autenticación con Google exitosa:', result);
        
        const googleUser: GoogleUser = {
          id: result.id,
          email: result.email,
          name: result.name,
          imageUrl: result.imageUrl || '',
          authentication: {
            idToken: result.authentication.idToken,
            accessToken: result.authentication.accessToken
          }
        };
        
        return googleUser;
      }
      
      return null;
    } catch (error: any) {
      console.error('❌ Error en autenticación con Google:', error);
      
      // Manejar errores específicos
      if (error?.message) {
        if (error.message.includes('popup_closed_by_user')) {
          console.log('Usuario canceló la autenticación');
        } else if (error.message.includes('access_denied')) {
          console.log('Usuario denegó el acceso');
        } else if (error.message.includes('invalid_client') || error.message.includes('401')) {
          console.error('Client ID inválido o no configurado');
          alert(`❌ Error de configuración de Google Auth

🔧 Necesitas:
1. Crear proyecto en Google Cloud Console
2. Obtener Client ID válido
3. Actualizar configuración

📋 Ver: CONFIGURACION_GOOGLE_AUTH.md para detalles completos`);
        } else {
          console.error('Error desconocido:', error.message);
        }
      }
      
      return null;
    }
  }

  private async checkGoogleConfig(): Promise<boolean> {
    // Verificar si el Client ID está configurado correctamente
    // En un entorno real, aquí verificarías la configuración
    return false; // Por defecto false hasta que se configure correctamente
  }

  async signOut(): Promise<void> {
    try {
      await GoogleAuth.signOut();
      console.log('✅ Sesión de Google cerrada');
    } catch (error) {
      console.error('❌ Error cerrando sesión de Google:', error);
    }
  }

  async refreshToken(): Promise<any> {
    try {
      const result = await GoogleAuth.refresh();
      console.log('✅ Token de Google renovado');
      return result;
    } catch (error) {
      console.error('❌ Error renovando token de Google:', error);
      return null;
    }
  }

  // Verificar si el usuario está autenticado con Google
  async isAuthenticated(): Promise<boolean> {
    try {
      const result = await GoogleAuth.signIn();
      return !!result;
    } catch (error) {
      return false;
    }
  }
}
