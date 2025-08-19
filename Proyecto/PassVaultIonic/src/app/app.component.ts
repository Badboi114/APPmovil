import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LockScreenComponent } from './components/lock-screen/lock-screen.component';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, LockScreenComponent, CommonModule],
})
export class AppComponent implements OnInit {
  showLockScreen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar estado inicial
    this.checkAuthState();

    // Escuchar cambios de autenticación
    this.authService.isUserLoggedIn$.subscribe(() => {
      this.checkAuthState();
    });

    this.authService.isAuthenticated$.subscribe(() => {
      this.checkAuthState();
    });
  }

  private checkAuthState() {
    const currentUrl = this.router.url;
    const isUserLoggedIn = this.authService.isUserLoggedIn();
    const isAuthenticated = this.authService.isLoggedIn();

    if (!isUserLoggedIn) {
      // No hay usuario logueado
      this.showLockScreen = false;
      if (currentUrl !== '/login' && currentUrl !== '/register') {
        this.router.navigate(['/login']);
      }
    } else if (isUserLoggedIn && !isAuthenticated) {
      // Usuario logueado pero necesita PIN
      this.showLockScreen = true;
    } else {
      // Usuario autenticado completamente
      this.showLockScreen = false;
      if (currentUrl === '/login' || currentUrl === '/register' || currentUrl === '/') {
        this.router.navigate(['/tabs']);
      }
    }
  }

  onUnlocked() {
    this.showLockScreen = false;
    this.router.navigate(['/tabs']);
  }
}
