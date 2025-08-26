import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      map(isAuthenticated => {
        if (!isAuthenticated) {
          // Si no hay usuario actual, ir directamente al login (después de logout)
          if (!this.authService.getCurrentUser()) {
            this.router.navigate(['/login']);
            return false;
          }
          
          // Si hay usuario pero no está autenticado, mostrar lock screen
          if (this.authService.isUserLoggedIn()) {
            return false; // Permite que se muestre el lock screen
          }
          
          // Fallback: ir al login
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
