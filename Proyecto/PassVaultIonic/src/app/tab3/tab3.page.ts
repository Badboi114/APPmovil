import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  currentPin = '';
  correctPin = '1234';
  numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  constructor(
    private navController: NavController,
    private toastController: ToastController
  ) {}

  async enterPin(digit: string) {
    if (this.currentPin.length < 4) {
      this.currentPin += digit;
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  }

  async deletePin() {
    if (this.currentPin.length > 0) {
      this.currentPin = this.currentPin.slice(0, -1);
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  }

  async unlockVault() {
    if (this.currentPin === this.correctPin) {
      await Haptics.impact({ style: ImpactStyle.Heavy });
      // Navegar a la primera tab (Generador)
      this.navController.navigateRoot('/tabs/tab1');
      this.currentPin = '';
    } else {
      await Haptics.impact({ style: ImpactStyle.Heavy });
      const toast = await this.toastController.create({
        message: 'PIN incorrecto',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      this.currentPin = '';
    }
  }
}
