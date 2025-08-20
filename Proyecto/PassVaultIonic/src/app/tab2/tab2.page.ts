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
  IonChip,
  IonLabel,
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
  lockClosed,
  wifiOutline,
  shieldOutline,
  eyeOutline,
  eyeOffOutline
} from 'ionicons/icons';
import { Clipboard } from '@capacitor/clipboard';
import { EncryptionService } from '../services/encryption.service';

interface Password {
  id: number;
  siteName: string;
  username: string;
  password: string;
  encryptedPassword?: string;
  createdAt: string;
  category?: 'general' | 'wifi' | 'social' | 'work' | 'other';
  isWPA?: boolean;
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
    IonFabButton,
    IonChip,
    IonLabel
  ]
})
export class Tab2Page implements OnInit {
  passwords: Password[] = [];
  showPasswords: { [key: number]: boolean } = {};

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private encryptionService: EncryptionService
  ) {
    addIcons({ 
      lockClosedOutline, 
      add, 
      keyOutline, 
      copyOutline, 
      trashOutline, 
      lockClosed,
      wifiOutline,
      shieldOutline,
      eyeOutline,
      eyeOffOutline
    });
  }

  ngOnInit() {
    this.loadPasswords();
  }

  loadPasswords() {
    const stored = localStorage.getItem('passvault_passwords');
    if (stored) {
      this.passwords = JSON.parse(stored);
      // Migrar contraseñas existentes si no tienen cifrado
      this.migrateExistingPasswords();
    }
  }

  migrateExistingPasswords() {
    let needsSave = false;
    this.passwords.forEach(password => {
      if (!password.encryptedPassword && password.password) {
        try {
          password.encryptedPassword = this.encryptionService.encryptPassword(password.password);
          needsSave = true;
        } catch (error) {
          console.error('Error al migrar contraseña:', error);
        }
      }
    });
    
    if (needsSave) {
      this.savePasswords();
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
          placeholder: 'Nombre del sitio (ej: Mi Router WiFi)'
        },
        {
          name: 'username',
          type: 'text',
          placeholder: 'Usuario/Email/SSID'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Contraseña'
        },
        {
          name: 'category',
          type: 'text',
          placeholder: 'Categoría (wifi, social, work, etc.)'
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
            this.addPassword(data.siteName, data.username, data.password, data.category);
          }
        }
      ]
    });

    await alert.present();
  }

  addPassword(siteName: string, username: string, password: string, category: string = 'general') {
    if (siteName && username && password) {
      try {
        const encryptedPassword = this.encryptionService.encryptPassword(password);
        const isWiFiPassword = category?.toLowerCase().includes('wifi') || 
                              siteName.toLowerCase().includes('wifi') || 
                              siteName.toLowerCase().includes('router');

        const newPassword: Password = {
          id: Date.now(),
          siteName,
          username,
          password,
          encryptedPassword,
          createdAt: new Date().toISOString(),
          category: category as any || 'general',
          isWPA: isWiFiPassword
        };

        this.passwords.push(newPassword);
        this.savePasswords();
        this.showToast('Contraseña guardada y cifrada exitosamente');
      } catch (error) {
        console.error('Error al cifrar contraseña:', error);
        this.showToast('Error al guardar la contraseña');
      }
    }
  }

  async copyPassword(password: string) {
    try {
      await Clipboard.write({
        string: password
      });
      this.showToast('Contraseña copiada al portapapeles');
    } catch (error) {
      console.error('Error al copiar:', error);
      this.showToast('Error al copiar la contraseña');
    }
  }

  async copyEncryptedPassword(encryptedPassword: string) {
    try {
      await Clipboard.write({
        string: encryptedPassword
      });
      this.showToast('Contraseña cifrada copiada al portapapeles');
    } catch (error) {
      console.error('Error al copiar:', error);
      this.showToast('Error al copiar la contraseña cifrada');
    }
  }

  togglePasswordVisibility(id: number) {
    this.showPasswords[id] = !this.showPasswords[id];
  }

  getDisplayPassword(password: Password): string {
    if (this.showPasswords[password.id]) {
      return password.password;
    }
    return '•'.repeat(password.password.length);
  }

  getDecryptedPassword(password: Password): string {
    if (password.encryptedPassword) {
      try {
        return this.encryptionService.decryptPassword(password.encryptedPassword);
      } catch (error) {
        console.error('Error al descifrar:', error);
        return password.password; // Fallback a la contraseña sin cifrar
      }
    }
    return password.password;
  }

  getCategoryIcon(category?: string): string {
    switch (category) {
      case 'wifi': return 'wifi-outline';
      case 'social': return 'people-outline';
      case 'work': return 'briefcase-outline';
      default: return 'key-outline';
    }
  }

  getCategoryColor(category?: string): string {
    switch (category) {
      case 'wifi': return 'primary';
      case 'social': return 'secondary';
      case 'work': return 'tertiary';
      default: return 'medium';
    }
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
