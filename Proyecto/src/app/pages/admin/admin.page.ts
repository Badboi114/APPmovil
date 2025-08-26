import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonButton,
  IonText,
  IonList,
  IonItem,
  IonLabel,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent, 
    IonButton,
    IonText,
    IonList,
    IonItem,
    IonLabel,
    CommonModule
  ]
})
export class AdminPage {
  userStats: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.loadUserStats();
  }

  async loadUserStats() {
    this.userStats = await this.authService.getUserStats();
  }

  async clearAllUsers() {
    const alert = await this.alertController.create({
      header: '⚠️ Confirmar Eliminación',
      message: '¿Estás seguro de que quieres eliminar TODOS los usuarios registrados? Esta acción NO se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'SÍ, ELIMINAR TODO',
          handler: async () => {
            await this.performClearAllUsers();
          }
        }
      ]
    });

    await alert.present();
  }

  async performClearAllUsers() {
    try {
      const result = await this.authService.clearAllUsers();
      
      if (result.success) {
        await this.showToast('✅ Todos los usuarios eliminados exitosamente', 'success');
        // Redirigir al login después de limpiar
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      } else {
        await this.showToast('❌ ' + result.message, 'danger');
      }
    } catch (error) {
      await this.showToast('❌ Error eliminando usuarios', 'danger');
    }
  }

  async resetPin() {
    const result = await this.authService.resetPin('1234');
    if (result.success) {
      await this.showToast(`PIN reseteado a: 1234`, 'success');
      this.loadUserStats();
    } else {
      await this.showToast(result.message, 'danger');
    }
  }

  async regeneratePin() {
    const result = await this.authService.regeneratePin();
    if (result.success) {
      await this.showToast(`Nuevo PIN: ${result.newPin}`, 'success');
      this.loadUserStats();
    } else {
      await this.showToast(result.message, 'danger');
    }
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
