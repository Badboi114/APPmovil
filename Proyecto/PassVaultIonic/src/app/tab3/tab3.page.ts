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
  IonButton,
  IonText,
  IonIcon,
  IonList,
  IonInput,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  personOutline, 
  mailOutline, 
  logOutOutline, 
  refreshOutline,
  createOutline,
  checkmarkOutline,
  closeOutline,
  keyOutline,
  calendarOutline,
  personAddOutline,
  logInOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
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
    IonButton,
    IonText,
    IonIcon,
    IonList,
    IonInput,
    CommonModule, 
    FormsModule
  ]
})
export class Tab3Page implements OnInit {
  currentUser: User | null = null;
  isEditingName = false;
  isEditingEmail = false;
  editedUser: { name: string; email: string } = { name: '', email: '' };

  constructor(
    private authService: AuthService,
    public router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({ 
      personOutline, 
      mailOutline, 
      logOutOutline, 
      refreshOutline,
      createOutline,
      checkmarkOutline,
      closeOutline,
      keyOutline,
      calendarOutline,
      personAddOutline,
      logInOutline,
      shieldCheckmarkOutline
    });
  }

  ngOnInit() {
    console.log('Tab3 ngOnInit - Iniciando carga de usuario');
    
    // Cargar usuario actual al inicializar
    this.loadCurrentUser();
    
    // Suscribirse a cambios del usuario
    this.authService.currentUser$.subscribe(user => {
      console.log('Tab3 - Usuario recibido:', user);
      this.currentUser = user;
      if (user) {
        this.editedUser = { name: user.name, email: user.email };
        console.log('Tab3 - Datos del usuario cargados:', this.editedUser);
      }
    });
  }

  loadCurrentUser() {
    console.log('Tab3 - Cargando usuario actual...');
    
    // Forzar recarga del usuario desde localStorage
    const userData = localStorage.getItem('passvault_current_user');
    console.log('Tab3 - Datos en localStorage:', userData);
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('Tab3 - Usuario parseado:', user);
        this.currentUser = user;
        this.editedUser = { name: user.name, email: user.email };
      } catch (error) {
        console.error('Tab3 - Error parseando usuario:', error);
      }
    }
    
    // También intentar obtener del AuthService
    const currentUser = this.authService.getCurrentUser();
    console.log('Tab3 - Usuario del AuthService:', currentUser);
    
    if (currentUser) {
      this.currentUser = currentUser;
      this.editedUser = { name: currentUser.name, email: currentUser.email };
    } else if (!userData) {
      // Si no hay usuario, crear datos de prueba para testing
      console.log('Tab3 - Creando usuario de prueba para testing');
      this.currentUser = {
        id: 'test-id',
        name: 'Usuario de Prueba',
        email: 'test@example.com',
        password: 'test-password',
        pin: '1234',
        createdAt: new Date()
      };
      this.editedUser = { 
        name: this.currentUser.name, 
        email: this.currentUser.email 
      };
    }
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/login']);
            this.showToast('Sesión cerrada exitosamente', 'success');
          }
        }
      ]
    });

    await alert.present();
  }

  async regeneratePin() {
    const alert = await this.alertController.create({
      header: 'Regenerar PIN',
      message: '¿Quieres generar un nuevo PIN? Se enviará a tu correo electrónico.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Regenerar',
          handler: async () => {
            const success = await this.authService.regeneratePin();
            if (success) {
              this.showToast('Nuevo PIN enviado a tu correo', 'success');
            } else {
              this.showToast('Error enviando nuevo PIN', 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // Métodos para editar nombre
  startEditingName() {
    if (this.currentUser) {
      this.editedUser.name = this.currentUser.name;
      this.isEditingName = true;
    }
  }

  cancelNameEdit() {
    this.isEditingName = false;
    this.editedUser.name = '';
  }

  async saveNameEdit() {
    if (!this.editedUser.name.trim()) {
      this.showToast('Por favor, ingresa un nombre válido', 'warning');
      return;
    }

    try {
      const success = await this.authService.updateUserProfile(
        this.editedUser.name,
        this.currentUser!.email
      );

      if (success) {
        this.isEditingName = false;
        this.showToast('Nombre actualizado exitosamente', 'success');
      } else {
        this.showToast('Error al actualizar el nombre', 'danger');
      }
    } catch (error) {
      this.showToast('Error al actualizar el nombre', 'danger');
    }
  }

  // Métodos para editar email
  startEditingEmail() {
    if (this.currentUser) {
      this.editedUser.email = this.currentUser.email;
      this.isEditingEmail = true;
    }
  }

  cancelEmailEdit() {
    this.isEditingEmail = false;
    this.editedUser.email = '';
  }

  async saveEmailEdit() {
    if (!this.editedUser.email.trim()) {
      this.showToast('Por favor, ingresa un email válido', 'warning');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.editedUser.email)) {
      this.showToast('Por favor, ingresa un email válido', 'warning');
      return;
    }

    try {
      const success = await this.authService.updateUserProfile(
        this.currentUser!.name,
        this.editedUser.email
      );

      if (success) {
        this.isEditingEmail = false;
        this.showToast('Email actualizado exitosamente', 'success');
      } else {
        this.showToast('Error al actualizar el email', 'danger');
      }
    } catch (error) {
      this.showToast('Error al actualizar el email', 'danger');
    }
  }

  async changePassword() {
    const alert = await this.alertController.create({
      header: 'Cambiar Contraseña',
      inputs: [
        {
          name: 'currentPassword',
          type: 'password',
          placeholder: 'Contraseña actual'
        },
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'Nueva contraseña'
        },
        {
          name: 'confirmPassword',
          type: 'password',
          placeholder: 'Confirmar nueva contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cambiar',
          handler: async (data) => {
            if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
              this.showToast('Por favor, completa todos los campos', 'warning');
              return false;
            }

            if (data.newPassword !== data.confirmPassword) {
              this.showToast('Las contraseñas no coinciden', 'warning');
              return false;
            }

            if (data.newPassword.length < 6) {
              this.showToast('La nueva contraseña debe tener al menos 6 caracteres', 'warning');
              return false;
            }

            try {
              const success = await this.authService.changePassword(
                data.currentPassword,
                data.newPassword
              );

              if (success) {
                this.showToast('Contraseña cambiada exitosamente', 'success');
                return true;
              } else {
                this.showToast('Contraseña actual incorrecta', 'danger');
                return false;
              }
            } catch (error) {
              this.showToast('Error al cambiar la contraseña', 'danger');
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
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
