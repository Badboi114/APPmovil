# 🏥 Sistema de Reservas de Citas Médicas

Una aplicación móvil completa para gestionar citas médicas, desarrollada con React Native y Expo.

## ✨ Características

- **🔐 Autenticación de usuarios**
- **📅 Gestión completa de citas médicas**
- **👩‍⚕️ 8 especialidades médicas disponibles**
- **🩺 8 médicos especialistas**
- **📱 Interfaz intuitiva y fácil de usar**
- **🏠 Panel de inicio con estadísticas**
- **⚡ Acciones rápidas**
- **📋 Historial de citas**
- **👤 Perfil de usuario**
- **⚙️ Gestión personalizable de doctores** ✨ NUEVA FUNCIÓN

## 🏥 Especialidades Médicas

1. **Cardiología** - Dr. Carlos García
2. **Dermatología** - Dra. María López
3. **Neurología** - Dr. Juan Pérez
4. **Pediatría** - Dra. Ana Martín
5. **Medicina General** - Dr. Luis Rodríguez
6. **Ginecología** - Dra. Carmen Silva
7. **Ortopedia** - Dr. Miguel Torres
8. **Psiquiatría** - Dra. Elena Vega

## 📱 Funcionalidades

### Autenticación
- Inicio de sesión con email y contraseña
- Validación de formularios
- Estado de carga y manejo de errores

### Gestión de Citas
- **Proceso paso a paso:** Especialidad → Médico → Fecha/Hora → Datos del paciente
- **Horarios disponibles** por cada médico
- **Información del paciente** completa
- **Confirmación inmediata** de la cita

### Panel de Inicio
- **Estadísticas:** Total de citas, próximas y completadas
- **Próximas citas:** Las 3 citas más cercanas
- **Acciones rápidas** de navegación

### Mis Citas
- **Filtros:** Todas, próximas, pasadas
- **Detalles completos** de cada cita
- **Cancelación** de citas
- **Contacto** con el médico

### Perfil
- **Información personal** del usuario
- **Configuraciones** de la aplicación
- **Gestión de doctores:** Personalizar nombres y especialidades ✨
- **Cerrar sesión** seguro

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+
- Expo CLI
- Expo Go (para dispositivos móviles)

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/Badboi114/APPmovil.git

# Navegar al directorio del proyecto
cd APPmovil
git checkout A7-sistema-citas

# Instalar dependencias
npm install

# Iniciar la aplicación
npx expo start
```

### Ejecutar en diferentes plataformas
```bash
# Web
npx expo start --web

# Android
npx expo start --android

# iOS
npx expo start --ios
```

## 🛠️ Tecnologías Utilizadas

- **React Native** - Framework de desarrollo móvil
- **Expo SDK 50** - Plataforma de desarrollo
- **React Navigation** - Navegación entre pantallas
- **Bottom Tabs Navigator** - Navegación por pestañas
- **JavaScript ES6+** - Lenguaje de programación
- **StyleSheet** - Estilos nativos de React Native

## 📁 Estructura del Proyecto

```
A7/
├── App.js                    # Aplicación principal completa (42KB)
├── package.json              # Dependencias del proyecto
├── app.json                  # Configuración de Expo
├── babel.config.js           # Configuración de Babel
├── assets/                   # Imágenes y recursos
├── GITHUB_INSTRUCTIONS.md    # Instrucciones de GitHub
└── README.md                # Esta documentación
```

## 🔧 Configuración

### Dependencias principales
```json
{
  "@react-navigation/bottom-tabs": "^6.5.8",
  "@react-navigation/native": "^6.1.7",
  "expo": "~50.0.0",
  "react": "18.2.0",
  "react-native": "0.73.6"
}
```

## 📋 Uso de la Aplicación

### 1. Iniciar Sesión
- Ingresa cualquier email y contraseña
- Pulsa "Iniciar Sesión"
- Espera la confirmación (1 segundo)

### 2. Agendar Nueva Cita
1. Ve a la pestaña "Nueva Cita"
2. Selecciona la especialidad médica
3. Elige el médico de tu preferencia
4. Selecciona fecha y hora disponible
5. Completa la información del paciente
6. Confirma la cita

### 3. Ver Mis Citas
- Navega a "Mis Citas"
- Filtra por: Todas, Próximas o Pasadas
- Cancela o contacta según necesites

### 4. Panel de Inicio
- Visualiza estadísticas de tus citas
- Revisa próximas citas programadas
- Usa acciones rápidas para navegación

### 5. Gestión de Doctores ✨
- Ve a "Perfil" → "Gestionar Doctores"
- Personaliza nombres de médicos
- Edita especialidades
- Restaura configuración original

## 🎨 Características de Diseño

- **Material Design** inspirado
- **Colores:** Azul principal (#2196F3)
- **Iconos:** Emojis para mejor UX
- **Sombras** y efectos de elevación
- **Responsive** para diferentes tamaños
- **Navegación intuitiva** por pestañas

## 🔒 Seguridad

- Validación de formularios en el cliente
- Manejo seguro del estado de autenticación
- Datos locales simulados (sin persistencia externa)

## 📝 Notas de Desarrollo

- **Base de datos simulada** en memoria
- **Sin conexión externa** requerida
- **Datos de prueba** incluidos
- **Personalización completa** de doctores
- **Listo para producción** con backend real

## 🆕 Funciones Añadidas

### Gestión de Doctores
- **Editar nombres** de médicos existentes
- **Cambiar especialidades** médicas
- **Restaurar configuración** original
- **Persistencia** durante la sesión
- **Interfaz intuitiva** para gestión

## 📊 Estadísticas del Proyecto

- **Líneas de código:** 1,500+ líneas
- **Componentes:** 6 pantallas principales
- **Navegación:** 4 pestañas + gestión de doctores
- **Médicos:** 8 especialistas configurables
- **Especialidades:** 8 áreas médicas
- **Funcionalidades:** 20+ características

## 🤝 Contribución

Este es un proyecto educativo/demo. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto para fines educativos.

## 👨‍💻 Desarrollado por

**wlujan** - Sistema de Reservas de Citas Médicas  
Aplicación móvil completa con React Native + Expo

## 🔗 Enlaces

- **Repositorio:** https://github.com/Badboi114/APPmovil/tree/A7-sistema-citas
- **Documentación Expo:** https://docs.expo.dev/
- **React Navigation:** https://reactnavigation.org/

---

### 🚀 ¡Listo para usar!

La aplicación está completamente funcional y optimizada. Solo ejecuta `npx expo start` y comienza a gestionar citas médicas con personalización completa de doctores.