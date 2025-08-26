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
  IonSpinner,
  ToastController
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
    IonSpinner,
    CommonModule, 
    FormsModule
  ]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  showPinVerification: boolean = false;
  pin: string = '';
  loginCredentials: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // Solo verificar si ya está completamente autenticado (login + PIN)
    // El app.component se encarga de mostrar el lock screen si es necesario
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/tabs']);
    }
  }

  async login() {
    if (!this.email || !this.password) {
      await this.showToast('Por favor, completa todos los campos', 'warning');
      return;
    }

    this.isLoading = true;
    
    try {
      console.log('🚀 Iniciando login optimizado...');
      const startTime = performance.now();
      
      const result = await this.authService.login(this.email, this.password);
      
      const endTime = performance.now();
      console.log(`⚡ Login completado en ${(endTime - startTime).toFixed(0)}ms`);
      
      if (result.success) {
        // Guardar credenciales y mostrar verificación de PIN
        this.loginCredentials = result;
        this.showPinVerification = true;
        this.pin = '';
        await this.showToast('Ingresa tu PIN de 4 dígitos para continuar', 'primary');
      } else {
        await this.showToast(result.message || 'Credenciales inválidas', 'danger');
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      await this.showToast('Error en el servidor', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  async verifyPin() {
    if (!this.pin || this.pin.length !== 4) {
      await this.showToast('El PIN debe tener exactamente 4 dígitos', 'warning');
      return;
    }

    this.isLoading = true;
    
    try {
      const result = await this.authService.verifyPin(this.pin);
      
      if (result.success) {
        await this.showToast('¡Bienvenido! 🎉', 'success');
        this.router.navigate(['/tabs']);
      } else {
        await this.showToast(result.message || 'PIN incorrecto. Intenta nuevamente.', 'danger');
        this.pin = '';
      }
    } catch (error) {
      console.error('❌ Error verificando PIN:', error);
      await this.showToast('Error verificando PIN', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  cancelPinVerification() {
    this.showPinVerification = false;
    this.pin = '';
    this.loginCredentials = null;
  }

  onPinInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 4) {
      value = value.substring(0, 4);
    }
    this.pin = value;
    event.target.value = value;
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    toast.present();
  }
}
