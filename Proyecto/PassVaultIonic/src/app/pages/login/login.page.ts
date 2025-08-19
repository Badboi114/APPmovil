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
    IonIcon,
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
    // Verificar si ya está logueado
    if (this.authService.isUserLoggedIn()) {
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
      const success = await this.authService.login(this.email, this.password);
      
      if (success) {
        await this.showToast('Login exitoso', 'success');
        this.router.navigate(['/tabs']);
      } else {
        await this.showToast('Credenciales inválidas', 'danger');
      }
    } catch (error) {
      await this.showToast('Error en el login', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToEmailConfig() {
    this.router.navigate(['/email-config']);
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
