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
import { AuthService, AuthUser } from '../services/auth.service';

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
  currentUser: AuthUser | null = null;
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
        id: 1,
        name: 'Usuario de Prueba',
        email: 'test@example.com',
        pin: '123456',
        createdAt: new Date().toISOString()
      };
      this.editedUser = { 
        name: this.currentUser.name, 
        email: this.currentUser.email 
      };
    }
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
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
          handler: async () => {
            console.log('🚪 Iniciando logout desde Tab3...');
            
            // Hacer logout inmediato
            this.authService.logout();
            
            // Navegación inmediata sin delays
            this.router.navigate(['/login'], { replaceUrl: true });
            
            console.log('🚪 Logout y navegación completados');
            this.showToast('Sesión cerrada exitosamente', 'success');
          }
        }
      ]
    });

    await alert.present();
  }

  // Método para personalizar PIN
  async customizePin() {
    const alert = await this.alertController.create({
      header: 'Personalizar PIN',
      message: 'Ingresa tu nuevo PIN de 4 dígitos:',
      inputs: [
        {
          name: 'newPin',
          type: 'number',
          placeholder: 'Ej: 1234',
          attributes: {
            maxlength: 4,
            minlength: 4
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar PIN',
          handler: async (data) => {
            const newPin = data.newPin;
            
            // Validar que el PIN tenga exactamente 4 dígitos
            if (!newPin || newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
              this.showToast('El PIN debe tener exactamente 4 dígitos', 'warning');
              return false; // Mantener el alert abierto
            }

            try {
              // Usar resetPin para cambio directo por admin
              const result = await this.authService.resetPin(newPin);
              if (result.success) {
                this.showToast('PIN personalizado guardado exitosamente', 'success');
                this.loadCurrentUser(); // Recargar datos del usuario
                return true;
              } else {
                this.showToast(result.message, 'danger');
                return false;
              }
            } catch (error) {
              console.error('Error al personalizar PIN:', error);
              this.showToast('Error al personalizar PIN', 'danger');
              return false;
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
      const success = await this.authService.updateUserProfile({
        name: this.editedUser.name
      });

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
      const success = await this.authService.updateUserProfile({
        email: this.editedUser.email
      });

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
