import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, NoPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Configuración ultra-optimizada para máxima velocidad de carga
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({
      mode: 'ios', // Modo iOS para mejor rendimiento
      animated: false, // Desactivar animaciones para carga más rápida
      rippleEffect: false, // Sin ripple effects
      hardwareBackButton: false // Desactivar para web
    }),
    // NoPreloading para cargar solo lo necesario inicialmente
    provideRouter(routes, withPreloading(NoPreloading)),
    provideHttpClient(),
  ],
}).then(() => {
  console.log('🚀 App iniciada con configuración ultra-rápida');
}).catch(err => console.error('Error starting app:', err));
