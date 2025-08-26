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
  IonIcon,
  ToastController,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';
import { AuthService, AuthUser } from '../../services/auth.service';

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
    IonIcon,
    IonGrid,
    IonRow,
    IonCol
  ]
})
export class LockScreenComponent implements OnInit {
  @Output() unlocked = new EventEmitter<void>();
  
  pin: string = '';
  currentUser: AuthUser | null = null;
  isVerifying: boolean = false;
  isRegeneratingPin: boolean = false;
  errorMessage: string = '';
  showPinHint: boolean = false;

  constructor(
    private authService: AuthService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  /**
   * Método temporal para forzar login de j@gmail.com
   */
  forceJUserLogin() {
    console.log('🔄 Forzando login para j@gmail.com...');
    this.authService.forceLoginJUser();
  }

  getUserPin(): string {
    return this.authService.getUserPin();
  }

  addDigit(digit: string) {
    if (this.pin.length < 4 && !this.isVerifying) {
      this.pin += digit;
      this.errorMessage = '';
      
      // Haptic feedback para dispositivos móviles
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      // Auto-verificar cuando se completen 4 dígitos
      if (this.pin.length === 4) {
        setTimeout(() => this.verifyPin(), 150);
      }
    }
  }

  removeDigit() {
    this.pin = this.pin.slice(0, -1);
  }

  clear() {
    this.pin = '';
    this.errorMessage = '';
  }

  async verifyPin() {
    if (this.pin.length !== 4) {
      this.errorMessage = 'PIN debe tener 4 dígitos';
      return;
    }

    this.isVerifying = true;
    this.errorMessage = '';

    try {
      const result = await this.authService.verifyPin(this.pin);
      
      if (result.success) {
        await this.showToast('¡Acceso concedido! 🎉', 'success');
        this.unlocked.emit();
      } else {
        this.errorMessage = result.message;
        this.pin = '';
        await this.showToast(result.message, 'danger');
      }
    } catch (error) {
      this.errorMessage = 'Error verificando PIN';
      await this.showToast('Error verificando PIN', 'danger');
    } finally {
      this.isVerifying = false;
    }
  }

  async regeneratePin() {
    if (!this.currentUser) return;

    this.isRegeneratingPin = true;
    
    try {
      const result = await this.authService.regeneratePin();
      
      if (result.success) {
        await this.showToast(`Nuevo PIN: ${result.newPin}`, 'success');
        this.showPinHint = true;
        setTimeout(() => this.showPinHint = false, 5000); // Ocultar después de 5 segundos
      } else {
        await this.showToast(result.message, 'danger');
      }
    } catch (error) {
      await this.showToast('Error generando nuevo PIN', 'danger');
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
