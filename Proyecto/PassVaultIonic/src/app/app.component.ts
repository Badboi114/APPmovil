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
    console.log('AppComponent iniciado');
    
    // Verificar estado inicial
    this.checkAuthState();

    // Escuchar cambios de autenticación
    this.authService.isUserLoggedIn$.subscribe((loggedIn) => {
      console.log('User logged in changed:', loggedIn);
      this.checkAuthState();
    });

    this.authService.isAuthenticated$.subscribe((authenticated) => {
      console.log('User authenticated changed:', authenticated);
      this.checkAuthState();
    });
  }

  private checkAuthState() {
    const currentUrl = this.router.url;
    const isUserLoggedIn = this.authService.isUserLoggedIn();
    const isAuthenticated = this.authService.isLoggedIn();

    console.log('Auth State Check:', {
      currentUrl,
      isUserLoggedIn,
      isAuthenticated,
      showLockScreen: this.showLockScreen
    });

    // Si no hay usuario logueado, ir a login
    if (!isUserLoggedIn) {
      this.showLockScreen = false;
      if (currentUrl !== '/login' && currentUrl !== '/register') {
        console.log('Redirigiendo a login');
        this.router.navigate(['/login']);
      }
      return;
    }

    // Si hay usuario pero no está autenticado (necesita PIN)
    if (isUserLoggedIn && !isAuthenticated) {
      console.log('Mostrando lock screen');
      this.showLockScreen = true;
      return;
    }

    // Si está completamente autenticado
    if (isUserLoggedIn && isAuthenticated) {
      this.showLockScreen = false;
      if (currentUrl === '/login' || currentUrl === '/register' || currentUrl === '/' || currentUrl === '') {
        console.log('Redirigiendo a tabs');
        this.router.navigate(['/tabs']);
      }
    }
  }

  onUnlocked() {
    console.log('PIN desbloqueado');
    this.showLockScreen = false;
    this.router.navigate(['/tabs']);
  }
}
