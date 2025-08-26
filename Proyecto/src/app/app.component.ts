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
    this.checkAuthState();

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
    const isAuthenticated = this.authService.isAuthenticated();

    if (!isUserLoggedIn) {
      this.showLockScreen = false;
      if (currentUrl !== '/login' && currentUrl !== '/register') {
        this.router.navigate(['/login']);
      }
      return;
    }

    if (isUserLoggedIn && !isAuthenticated) {
      this.showLockScreen = true;
      return;
    }

    if (isUserLoggedIn && isAuthenticated) {
      this.showLockScreen = false;
      if (currentUrl === '/login' || currentUrl === '/register' || currentUrl === '/' || currentUrl === '') {
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
