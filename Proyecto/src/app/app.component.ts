import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LockScreenComponent } from './components/lock-screen/lock-screen.component';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, LockScreenComponent, CommonModule],
})
export class AppComponent implements OnInit {
  showLockScreen = false;
  isLoggingOut = false; // Flag para bloquear lock screen durante logout

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('AppComponent iniciado');
    this.checkAuthState();

    this.authService.isUserLoggedIn$.subscribe((loggedIn) => {
      console.log('User logged in changed:', loggedIn);
      if (!loggedIn) {
        // Si el usuario no está logueado, inmediatamente ocultar lock screen
        console.log('Usuario no logueado - ocultando lock screen inmediatamente');
        this.forceHideLockScreen();
      }
      this.checkAuthState();
    });

    this.authService.isAuthenticated$.subscribe((authenticated) => {
      console.log('User authenticated changed:', authenticated);
      this.checkAuthState();
    });

    // Escuchar estado de logout para bloquear lock screen
    this.authService.isLoggingOut$.subscribe((loggingOut) => {
      console.log('🚪 Logging out state changed:', loggingOut);
      this.isLoggingOut = loggingOut;
      if (loggingOut) {
        console.log('🚪 Bloqueando lock screen durante logout');
        this.forceHideLockScreen();
      }
    });

    // Escuchar cambios de ruta para manejar navegación a login
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url === '/login' || event.url === '/register') {
        console.log('Navegación a login/register completada - forzando ocultación de lock screen');
        this.forceHideLockScreen();
      }
    });
  }

  isOnAuthPage(): boolean {
    const currentUrl = this.router.url;
    const isAuthPage = currentUrl === '/login' || currentUrl === '/register' || currentUrl === '/';
    console.log('🔍 isOnAuthPage:', { currentUrl, isAuthPage });
    return isAuthPage;
  }

  private forceHideLockScreen() {
    console.log('🔒 FORZANDO ocultación del lock screen');
    this.showLockScreen = false;
    // Doble verificación para asegurar que se oculte
    setTimeout(() => {
      this.showLockScreen = false;
      console.log('🔒 Segunda verificación - lock screen oculto');
    }, 50);
  }

  private checkAuthState() {
    // Usar setTimeout para asegurar que todos los cambios de estado se propaguen
    setTimeout(() => {
      const currentUrl = this.router.url;
      const isUserLoggedIn = this.authService.isUserLoggedIn();
      const isAuthenticated = this.authService.isAuthenticated();
      const currentUser = this.authService.getCurrentUser();

      console.log('checkAuthState:', { currentUrl, isUserLoggedIn, isAuthenticated, hasUser: !!currentUser });

      // FORZAR ocultación en páginas de autenticación
      if (currentUrl === '/login' || currentUrl === '/register') {
        console.log('En página de autenticación - forzando showLockScreen = false');
        this.forceHideLockScreen();
        return;
      }

      // Si no hay usuario actual o no está logueado, ocultar lock screen y ir al login
      if (!isUserLoggedIn || !currentUser) {
        console.log('No hay usuario o no está logueado - ocultando lock screen');
        this.forceHideLockScreen();
        if (currentUrl !== '/login' && currentUrl !== '/register') {
          console.log('Navegando al login');
          this.router.navigate(['/login']);
        }
        return;
      }

      // Solo mostrar lock screen si está logueado, hay usuario actual y no está autenticado
      if (isUserLoggedIn && currentUser && !isAuthenticated) {
        // VERIFICAR que no estemos en páginas de autenticación antes de mostrar lock screen
        if (currentUrl !== '/login' && currentUrl !== '/register') {
          console.log('Mostrando lock screen - usuario logueado pero no autenticado');
          this.showLockScreen = true;
        } else {
          console.log('En página de autenticación - manteniendo lock screen oculto');
          this.forceHideLockScreen();
        }
        return;
      }

      if (isUserLoggedIn && isAuthenticated) {
        console.log('Usuario completamente autenticado - ocultando lock screen');
        this.showLockScreen = false;
        if (currentUrl === '/login' || currentUrl === '/register' || currentUrl === '/' || currentUrl === '') {
          this.router.navigate(['/tabs']);
        }
      }
    }, 0);
  }

  onUnlocked() {
    console.log('PIN desbloqueado');
    this.showLockScreen = false;
    this.router.navigate(['/tabs']);
  }
}
