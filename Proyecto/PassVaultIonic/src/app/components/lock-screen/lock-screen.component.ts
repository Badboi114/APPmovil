import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonButton, 
  IonText,
  IonSpinner,
  ToastController,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss'],
  imports: [
    CommonModule,
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent, 
    IonButton, 
    IonText,
    IonSpinner,
    IonGrid,
    IonRow,
    IonCol
  ]
})
export class LockScreenComponent implements OnInit {
  @Output() unlocked = new EventEmitter<void>();
  
  pin: string = '';
  currentUser: User | null = null;
  isRegeneratingPin: boolean = false;

  constructor(
    private authService: AuthService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  addDigit(digit: string) {
    if (this.pin.length < 4) {
      this.pin += digit;
      
      if (this.pin.length === 4) {
        this.verifyPin();
      }
    }
  }

  removeDigit() {
    this.pin = this.pin.slice(0, -1);
  }

  clear() {
    this.pin = '';
  }

  verifyPin() {
    if (this.authService.authenticate(this.pin)) {
      this.unlocked.emit();
    } else {
      this.pin = '';
      this.showToast('PIN incorrecto', 'danger');
    }
  }

  async regeneratePin() {
    if (!this.currentUser) return;

    this.isRegeneratingPin = true;
    
    try {
      const success = await this.authService.regeneratePin();
      
      if (success) {
        await this.showToast('Nuevo PIN enviado a tu correo', 'success');
      } else {
        await this.showToast('Error enviando nuevo PIN', 'danger');
      }
    } catch (error) {
      await this.showToast('Error enviando nuevo PIN', 'danger');
    } finally {
      this.isRegeneratingPin = false;
    }
  }

  logout() {
    this.authService.logout();
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
