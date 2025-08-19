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
  IonIcon,
  ToastController
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
    IonIcon,
    CommonModule, 
    FormsModule
  ]
})
export class RegisterPage implements OnInit {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  async register() {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      await this.showToast('Por favor, completa todos los campos', 'warning');
      return;
    }

    if (this.password !== this.confirmPassword) {
      await this.showToast('Las contraseñas no coinciden', 'warning');
      return;
    }

    if (this.password.length < 6) {
      await this.showToast('La contraseña debe tener al menos 6 caracteres', 'warning');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      await this.showToast('Por favor, ingresa un email válido', 'warning');
      return;
    }

    this.isLoading = true;
    
    try {
      const success = await this.authService.register(this.name, this.email, this.password);
      
      if (success) {
        await this.showToast('Registro exitoso. Se ha enviado un PIN a tu correo.', 'success');
        this.router.navigate(['/login']);
      } else {
        await this.showToast('Error en el registro. El email ya está en uso.', 'danger');
      }
    } catch (error) {
      await this.showToast('Error en el registro', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToEmailConfig() {
    this.router.navigate(['/email-config']);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
