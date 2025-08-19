import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, ExploreContainerComponent, CommonModule],
})
export class Tab1Page {
  
  // Datos modificados para la Actividad 3
  userProfiles = [
    {
      name: 'Ana García',
      role: 'Desarrolladora Frontend',
      description: 'Especialista en Angular e Ionic con 5 años de experiencia en desarrollo móvil.'
    },
    {
      name: 'Carlos López',
      role: 'Diseñador UX/UI',
      description: 'Creativo enfocado en experiencias de usuario intuitivas y diseños modernos.'
    },
    {
      name: 'María Rodriguez',
      role: 'Project Manager',
      description: 'Líder de proyectos con certificación PMP y experiencia en metodologías ágiles.'
    },
    {
      name: 'José Martínez',
      role: 'Backend Developer',
      description: 'Experto en Node.js, Python y arquitecturas de microservicios.'
    }
  ];

  constructor() {}
}
