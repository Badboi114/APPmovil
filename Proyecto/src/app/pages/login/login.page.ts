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
        // Login exitoso - navegar a tabs y dejar que AppComponent maneje el PIN
        console.log('✅ Login exitoso - navegando a tabs para mostrar lock screen');
        await this.showToast('Login exitoso', 'success');
        this.router.navigate(['/tabs'], { replaceUrl: true });
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
