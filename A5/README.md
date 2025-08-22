# 🌤️ Visor de Clima por Ciudad

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap-FF6C00?style=for-the-badge&logo=openweathermap&logoColor=white)

**Una aplicación móvil híbrida profesional para consultar el clima mundial**

[📱 Demo en Web](http://localhost:8081) • [📖 Documentación](#-documentación) • [🚀 Instalación](#-instalación-y-configuración)

</div>

## 📱 Acerca del Proyecto

**Visor de Clima** es una aplicación móvil híbrida desarrollada con **React Native** y **Expo** que permite consultar información meteorológica detallada de cualquier ciudad del mundo. Utiliza la API de **OpenWeatherMap** para proporcionar datos precisos y actualizados del clima.

### ✨ Características Principales

- 🔍 **Búsqueda por ciudad**: Consulta el clima de cualquier ciudad del mundo
- 📍 **Geolocalización**: Obtén el clima de tu ubicación actual automáticamente
- 🌡️ **Información completa**: Temperatura, sensación térmica, humedad, presión, viento, visibilidad
- 🌅 **Datos solares**: Horarios de amanecer y atardecer
- ❌ **Manejo profesional de errores**: Mensajes informativos para diferentes tipos de error
- 📱 **Multiplataforma**: Compatible con iOS, Android y Web
- 🎨 **Diseño moderno**: Interfaz limpia y responsive con iconos meteorológicos
- 🔄 **Estados de carga**: Indicadores visuales durante las peticiones
- 🔐 **Seguridad**: Variables de entorno para proteger API Keys

## 🛠️ Tecnologías y Herramientas

### 📱 Frontend y Framework
- **React Native**: Framework principal para desarrollo móvil
- **Expo**: Plataforma de desarrollo que simplifica el proceso
- **React Hooks**: Gestión de estado moderno con hooks personalizados

### 🌐 API y Datos
- **OpenWeatherMap API**: Servicio de datos meteorológicos en tiempo real
- **Axios**: Cliente HTTP robusto para peticiones a la API
- **Expo Location**: Acceso a geolocalización del dispositivo

### 🎨 UI/UX y Diseño
- **Expo Vector Icons**: Librería completa de iconos (MaterialIcons, Feather)
- **React Native StyleSheet**: Estilos nativos optimizados
- **Responsive Design**: Adaptable a diferentes tamaños de pantalla

### ⚙️ Configuración y Herramientas
- **React Native Dotenv**: Gestión segura de variables de entorno
- **Expo Constants**: Acceso a configuraciones del dispositivo
- **Metro Bundler**: Bundler optimizado para React Native
- **Git**: Control de versiones
- **npm**: Gestión de dependencias

## 🏗️ Arquitectura del Proyecto

### 📁 Estructura de Directorios
```
A5/
├── 📱 src/                          # Código fuente principal
│   ├── 🧩 components/               # Componentes reutilizables
│   │   ├── SearchBar.js            # Barra de búsqueda y geolocalización
│   │   ├── WeatherDisplay.js       # Visualización de datos del clima
│   │   └── ErrorDisplay.js         # Manejo y visualización de errores
│   ├── 🎣 hooks/                   # Hooks personalizados
│   │   └── useWeather.js           # Hook para gestión del estado del clima
│   └── 🌐 services/                # Servicios y lógica de negocio
│       ├── weatherService.js       # Servicio de API del clima
│       └── locationService.js      # Servicio de geolocalización
├── 🎨 assets/                      # Recursos gráficos
│   ├── icon.png                   # Icono de la aplicación
│   ├── splash-icon.png            # Imagen de splash screen
│   ├── adaptive-icon.png          # Icono adaptativo Android
│   └── favicon.png                # Favicon para web
├── ⚙️ Configuración
│   ├── App.js                     # Componente principal
│   ├── app.json                   # Configuración de Expo
│   ├── babel.config.js            # Configuración de Babel
│   ├── package.json               # Dependencias y scripts
│   ├── .env.example               # Ejemplo de variables de entorno
│   └── .gitignore                 # Archivos ignorados por Git
└── 📖 README.md                   # Documentación del proyecto
```

### 🏛️ Patrón de Arquitectura

**Separación de Responsabilidades**:
- **Components**: Lógica de presentación y UI
- **Hooks**: Lógica de estado y efectos
- **Services**: Lógica de negocio y comunicación con APIs
- **Assets**: Recursos estáticos

**Flujo de Datos**:
```
Usuario → SearchBar → useWeather Hook → weatherService → API → WeatherDisplay
```

## 🚀 Instalación y Configuración

### 📋 Prerrequisitos
```bash
# Herramientas necesarias
Node.js 16+ 
npm o yarn
Expo CLI: npm install -g @expo/cli
```

### 1️⃣ Clonar el Repositorio
```bash
git clone https://github.com/Badboi114/APPmovil.git
cd APPmovil/A5
```

### 2️⃣ Instalar Dependencias
```bash
npm install
```

### 3️⃣ Configurar Variables de Entorno

**Obtener API Key de OpenWeatherMap:**
1. Ve a [OpenWeatherMap](https://openweathermap.org/api)
2. Crea una cuenta gratuita
3. Genera tu API Key en "API Keys"

**Configurar archivo `.env`:**
```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con tu API Key
OPENWEATHER_API_KEY=tu_api_key_aqui
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
```

### 4️⃣ Ejecutar la Aplicación

**Web (Desarrollo):**
```bash
npm start
# Presiona 'w' para abrir en navegador
```

**Móvil (con Expo Go):**
```bash
npm start
# Escanea el QR con Expo Go
```

**Emuladores:**
```bash
# Android
npm run android

# iOS (solo Mac)
npm run ios
```

## 💡 Implementación Técnica

### 🔧 Gestión de Estado
```javascript
// Hook personalizado para manejo del clima
const {
  weatherData,
  loading,
  error,
  searchWeatherByCity,
  searchWeatherByLocation,
  clearError
} = useWeather();
```

### 🌐 Consumo de API
```javascript
// Servicio robusto con manejo de errores
const response = await getCurrentWeatherByCity(cityName);
const formattedData = formatWeatherData(response.data);
```

### 🔐 Seguridad
- Variables de entorno con `react-native-dotenv`
- API Keys protegidas y no expuestas en el código
- Validación de datos de entrada
- Manejo seguro de permisos de ubicación

### 📱 Responsive Design
- Componentes adaptativos con `Dimensions`
- Estilos optimizados para diferentes tamaños
- Iconos escalables con Vector Icons

## 🧪 Funcionalidades Implementadas

### ✅ Requisitos Cumplidos (100%)

| Criterio | Implementación | Estado |
|----------|----------------|--------|
| **Conexión API Externa** | OpenWeatherMap API con Axios | ✅ Completo |
| **Petición HTTP** | GET requests con manejo de errores | ✅ Completo |
| **Manejo JSON** | Parsing y formateo de respuestas | ✅ Completo |
| **Visualización UI** | Componentes React Native modernos | ✅ Completo |
| **Manejo de Errores** | Múltiples tipos de error cubiertos | ✅ Completo |

### 🌟 Características Avanzadas

- **Búsqueda inteligente** con validación
- **Geolocalización automática** 
- **Iconos meteorológicos dinámicos**
- **Información detallada del clima**
- **Estados de carga profesionales**
- **Diseño moderno y accesible**

## 🔍 Manejo de Errores

La aplicación maneja profesionalmente diferentes tipos de errores:

- 🔑 **API Key inválida**: Mensaje claro de configuración
- 🌍 **Ciudad no encontrada**: Sugerencias para el usuario
- 🌐 **Error de conexión**: Indicación de problemas de red
- ⏱️ **Timeout**: Manejo de peticiones lentas
- 📍 **Permisos de ubicación**: Explicación de permisos necesarios
- 🚫 **Límite de peticiones**: Información sobre límites de API

## 📸 Capturas de Pantalla

### 🖥️ Versión Web
- Interfaz moderna y limpia
- Búsqueda rápida por ciudad
- Información meteorológica completa

### 📱 Versión Móvil
- Experiencia nativa optimizada
- Geolocalización automática
- Iconos adaptativos

## 🚀 Despliegue

### 🌐 Web
```bash
npm run web
```

### 📱 Build para Producción
```bash
# Android APK
expo build:android

# iOS App Store
expo build:ios
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Desarrollado con ❤️ por**: [Badboi114](https://github.com/Badboi114)

**Repositorio**: [https://github.com/Badboi114/APPmovil](https://github.com/Badboi114/APPmovil)

## 🆘 Soporte

### 🐛 Problemas Comunes

**API Key no funciona:**
- Verifica que esté correctamente configurada en `.env`
- Las API Keys pueden tardar hasta 2 horas en activarse

**Error de ubicación en web:**
- Permite permisos de ubicación en el navegador
- Usa búsqueda por ciudad como alternativa

**La app no se actualiza:**
```bash
expo start --clear  # Limpia la caché
```

### 📞 Contacto

- 🐛 **Reportar bugs**: [Issues](https://github.com/Badboi114/APPmovil/issues)
- 💡 **Sugerencias**: [Discussions](https://github.com/Badboi114/APPmovil/discussions)
- 📧 **Email**: [tu-email@ejemplo.com]

---

<div align="center">

**🌟 ¡Gracias por usar Visor de Clima! 🌟**

Hecho con 💙 usando React Native y Expo

</div>
