# Assets

Esta carpeta debe contener los recursos gráficos de la aplicación.

## Archivos requeridos para Expo:

### Iconos principales:
- `icon.png` (1024x1024) - Icono principal de la app
- `adaptive-icon.png` (1024x1024) - Icono adaptativo para Android
- `favicon.png` (48x48) - Favicon para versión web

### Splash screen:
- `splash.png` (1284x2778) - Pantalla de carga

### Notificaciones:
- `notification-icon.png` (96x96) - Icono para notificaciones
- `notification-sound.wav` - Sonido personalizado (opcional)

## Generación de assets:

Puedes usar herramientas como:
- [App Icon Generator](https://appicon.co/)
- [Expo Asset Generator](https://docs.expo.dev/guides/app-icons/)
- Figma o Adobe Illustrator para diseños personalizados

## Configuración actual:

Los archivos están referenciados en `app.json` pero necesitas agregar los archivos físicos aquí.

Para desarrollo rápido, puedes usar iconos temporales o generar automáticamente con:

```bash
expo install expo-app-icon-utils
```

## Colores del tema:
- Primario: #2196F3 (Azul Material)
- Secundario: #03DAC6 (Teal)
- Éxito: #4CAF50 (Verde)
- Error: #f44336 (Rojo)
- Fondo: #F5F5F5 (Gris claro)
