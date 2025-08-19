# ACTIVIDAD 3 - COMMIT DE PROYECTO ESTRUCTURADO EN GITHUB

## Objetivo
Interactuar con las bondades y los trabajos que nos brinda la red en el mundo mediante la modificación de un proyecto existente.

## Descripción de la Actividad
Se ha tomado como base el proyecto **visor-perfiles** de la carpeta A2 y se han realizado las siguientes modificaciones significativas:

## Modificaciones Realizadas

### 1. Estructura del Proyecto
- **Proyecto original**: `A2/visor-perfiles`
- **Proyecto modificado**: `A3/visor-perfiles-modificado`

### 2. Cambios en Configuración
- **package.json**: Modificado el nombre del proyecto de "ionic-app-base" a "visor-perfiles-modificado-a3"
- **Version**: Actualizada de "0.0.0" a "1.0.0"
- **Author**: Cambiado de "Ionic Framework" a "Estudiante APPmoviles - Actividad 3"
- **Homepage**: Actualizado para referenciar el repositorio GitHub del proyecto

### 3. Modificaciones en la Interfaz

#### app.component.html
- Agregado header personalizado con toolbar de color primario
- Incluida sección de bienvenida con título y descripción personalizados
- Estructura HTML completamente modificada

#### app.component.scss
- Agregados estilos personalizados con gradientes
- Diseño responsivo con sombras y efectos visuales
- Colores y tipografía personalizados

#### tab1.page.html
- Transformado de una página simple a un visor de perfiles completo
- Implementación de cards dinámicas para mostrar perfiles de usuario
- Toolbar con color personalizado (success)
- Estructura completamente nueva con datos dinámicos

#### tab1.page.ts
- Agregada lógica para manejar array de perfiles de usuario
- Implementados imports adicionales para nuevos componentes Ionic
- Datos de ejemplo con perfiles profesionales

#### tab1.page.scss
- Estilos completamente nuevos para las cards de perfiles
- Efectos hover y transiciones
- Diseño moderno con sombras y colores personalizados

## Evidencias de Funcionamiento

### Antes (Proyecto Original - A2)
- Aplicación básica de Ionic con estructura de tabs simple
- Sin personalización visual
- Contenido genérico

### Después (Proyecto Modificado - A3)
- Header personalizado con branding de la actividad
- Sección de bienvenida con diseño atractivo
- Tab1 transformado en visor de perfiles profesionales
- Estilos CSS personalizados con gradientes y efectos
- Datos dinámicos con información de perfiles reales

## Estructura de Archivos Modificados
```
A3/visor-perfiles-modificado/
├── package.json (MODIFICADO)
├── src/
│   └── app/
│       ├── app.component.html (MODIFICADO)
│       ├── app.component.scss (MODIFICADO)
│       └── tab1/
│           ├── tab1.page.html (MODIFICADO)
│           ├── tab1.page.ts (MODIFICADO)
│           └── tab1.page.scss (MODIFICADO)
```

## Tecnologías Utilizadas
- **Ionic Framework**: Para el desarrollo de la aplicación móvil
- **Angular**: Framework base para la lógica de la aplicación
- **TypeScript**: Lenguaje de programación principal
- **SCSS**: Para los estilos personalizados
- **Git**: Para el control de versiones

## Fecha de Realización
19 de agosto de 2025

## Repositorio
- **Nombre**: APPmovil
- **Owner**: Badboi114
- **Rama**: main
