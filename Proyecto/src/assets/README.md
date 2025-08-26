# PassVault - Tu Compañero Seguro de Contraseñas

Una aplicación web progresiva (PWA) para generar y administrar contraseñas de forma segura, diseñada con un elegante interfaz azul que replica exactamente el diseño mostrado en las imágenes de referencia.

## 🔐 Características

- **Pantalla de Bloqueo Segura**: PIN inicial predeterminado `1234`
- **Generador de Contraseñas**: Crea contraseñas fuertes y personalizables
- **Bóveda de Contraseñas**: Almacena y gestiona tus contraseñas localmente
- **Diseño Responsivo**: Se adapta perfectamente a cualquier dispositivo
- **PWA**: Instalable en dispositivos móviles y escritorio
- **Interfaz Elegante**: Diseño moderno con gradientes azules

## 🚀 Instalación

1. **Clonar o descargar los archivos** en tu servidor web o abrir localmente
2. **Abrir `index.html`** en tu navegador web
3. **Instalar como PWA** (opcional):
   - En Chrome/Edge: Clic en el ícono de instalación en la barra de direcciones
   - En Safari iOS: Compartir > Añadir a pantalla de inicio
   - En Android: Menú > Instalar aplicación

## 🔧 Uso

### Desbloqueo Inicial
- PIN predeterminado: **1234**
- Usa el teclado numérico en pantalla o tu teclado físico
- Presiona "Desbloquear" o Enter

### Generador de Contraseñas
- Ajusta la longitud con el deslizador (4-50 caracteres)
- Activa/desactiva números y símbolos
- Clic en "Generar Contraseña"
- Copia la contraseña con el botón de copiar

### Bóveda de Contraseñas
- Clic en "Añadir Nueva" para guardar una contraseña
- Rellena nombre del sitio, usuario/email y contraseña
- Administra tus contraseñas guardadas
- Copia o elimina contraseñas existentes

### Bloqueo de Seguridad
- Clic en el botón de candado flotante
- Atajo de teclado: `Ctrl + L`

## 📱 Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge (últimas versiones)
- **Dispositivos**: Móviles, tablets, escritorio
- **PWA**: Compatible con instalación en todos los dispositivos modernos

## 🔒 Seguridad

- Las contraseñas se almacenan **localmente** en tu dispositivo
- No se envían datos a servidores externos
- Acceso protegido por PIN personalizable
- Funciona completamente offline

## 🎨 Personalización

El PIN puede cambiarse modificando la variable `correctPin` en `script.js`:

```javascript
const correctPin = '1234'; // Cambia por tu PIN preferido
```

## 📁 Estructura de Archivos

```
PassVault/
├── index.html          # Estructura principal HTML
├── styles.css          # Estilos CSS responsivos
├── script.js           # Funcionalidad JavaScript
├── manifest.json       # Configuración PWA
└── README.md          # Documentación
```

## 🆘 Atajos de Teclado

- **0-9**: Introducir dígitos del PIN
- **Backspace**: Borrar último dígito
- **Enter**: Desbloquear aplicación
- **Ctrl + L**: Bloquear aplicación
- **Escape**: Cerrar modal (cuando esté abierto)

## 🔄 Funcionalidades Técnicas

- **Almacenamiento local** con localStorage
- **Diseño responsivo** con CSS Grid y Flexbox
- **Animaciones suaves** y transiciones
- **Feedback háptico** en dispositivos compatibles
- **Notificaciones toast** para confirmaciones
- **Gestión de estado** completa en JavaScript vanilla

## 📋 Notas Importantes

- Las contraseñas se guardan en el almacenamiento local del navegador
- Al limpiar datos del navegador se perderán las contraseñas guardadas
- La aplicación funciona completamente offline después de la primera carga
- Recomendado hacer respaldos periódicos de contraseñas importantes

## 🌟 Características del Diseño

- **Gradiente azul** exacto (#667eea a #764ba2)
- **Efectos glassmorphism** con blur y transparencias
- **Iconografía Font Awesome** para consistencia visual
- **Tipografía Inter** para legibilidad óptima
- **Animaciones fluidas** para mejor experiencia de usuario

---

**¡Disfruta de PassVault y mantén tus contraseñas seguras!** 🔐✨
