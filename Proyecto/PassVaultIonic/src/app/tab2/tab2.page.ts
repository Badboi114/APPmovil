import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle,
  IonCardContent, 
  IonButton,
  IonIcon,
  IonButtons,
  IonFab,
  IonFabButton,
  ModalController, 
  AlertController, 
  ToastController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  lockClosedOutline, 
  add, 
  keyOutline, 
  copyOutline, 
  trashOutline, 
  lockClosed 
} from 'ionicons/icons';
import { Clipboard } from '@capacitor/clipboard';

interface Password {
  id: number;
  siteName: string;
  username: string;
  password: string;
  createdAt: string;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardSubtitle,
    IonCardContent, 
    IonButton,
    IonIcon,
    IonButtons,
    IonFab,
    IonFabButton
  ]
})
export class Tab2Page implements OnInit {
  passwords: Password[] = [];

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({ 
      lockClosedOutline, 
      add, 
      keyOutline, 
      copyOutline, 
      trashOutline, 
      lockClosed 
    });
  }

  ngOnInit() {
    this.loadPasswords();
  }

  loadPasswords() {
    const stored = localStorage.getItem('passvault_passwords');
    if (stored) {
      this.passwords = JSON.parse(stored);
    }
  }

  savePasswords() {
    localStorage.setItem('passvault_passwords', JSON.stringify(this.passwords));
  }

  async openAddModal() {
    const alert = await this.alertController.create({
      header: 'Añadir Nueva Contraseña',
      inputs: [
        {
          name: 'siteName',
          type: 'text',
          placeholder: 'Nombre del sitio'
        },
        {
          name: 'username',
          type: 'text',
          placeholder: 'Usuario/Email'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            this.addPassword(data.siteName, data.username, data.password);
          }
        }
      ]
    });

    await alert.present();
  }

  addPassword(siteName: string, username: string, password: string) {
    if (siteName && username && password) {
      const newPassword: Password = {
        id: Date.now(),
        siteName,
        username,
        password,
        createdAt: new Date().toISOString()
      };

      this.passwords.push(newPassword);
      this.savePasswords();
      this.showToast('Contraseña guardada exitosamente');
    }
  }

  async copyPassword(password: string) {
    await Clipboard.write({
      string: password
    });
    this.showToast('Contraseña copiada al portapapeles');
  }

  async deletePassword(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres eliminar esta contraseña?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.passwords = this.passwords.filter(p => p.id !== id);
            this.savePasswords();
            this.showToast('Contraseña eliminada');
          }
        }
      ]
    });

    await alert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  lockApp() {
    // Implementar lógica de bloqueo
    window.location.reload();
  }
}
