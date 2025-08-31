
# 🔐 PassVault - Gestor de Contraseñas Móvil

PassVault es una aplicación móvil avanzada para Android, diseñada para proteger, organizar y generar todas tus contraseñas de forma sencilla y ultra segura.

![PassVault](https://img.shields.io/badge/Ionic-Angular-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-4.0+-blue) ![Mobile](https://img.shields.io/badge/Platform-Mobile-green)

---

## 🚀 Características Principales

- Guarda **contraseñas ilimitadas** cifradas localmente
- Organiza tus claves por categorías y tipos
- Genera contraseñas seguras y personalizadas (alfanuméricas, solo números, solo letras, con símbolos, WPA/WPA2, etc.)
- Cambia tu PIN de acceso en cualquier momento
- Acceso con doble autenticación: contraseña y PIN
- Bloqueo rápido de la app
- Interfaz moderna, intuitiva y accesible

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** Ionic 8+ con Angular 18+
- **Lenguaje:** TypeScript
- **Cifrado:** CryptoJS (AES-256, PBKDF2)
- **Base de datos:** SQLite local cifrada
- **Plugins:** Capacitor, @capacitor-community/sqlite, Clipboard
- **Estilos:** SCSS y CSS variables

---

## 🔒 Seguridad y Cifrado

Tus contraseñas se cifran usando **AES-256** con saltos y vectores de inicialización únicos para cada clave. Además, se utiliza **PBKDF2** para derivar claves seguras y proteger contra ataques de fuerza bruta.

**Tipos de cifrado:**
- **AES-256:** Algoritmo simétrico de nivel bancario
- **PBKDF2:** Derivación de clave con miles de iteraciones

---

## �️ Tipos de Contraseñas que Puedes Crear

- Contraseñas alfanuméricas personalizadas
- Solo números o solo letras
- Con símbolos especiales
- Claves WPA/WPA2 para WiFi
- Contraseñas largas para bancos o servicios críticos

Cada tipo puede ser generado automáticamente o personalizado según tus necesidades.

---

## �️ Base de Datos y Privacidad

Tus datos se almacenan localmente en tu dispositivo, en una base de datos **SQLite cifrada**. Nunca subimos tus contraseñas a la nube. ¡Tú tienes el control total de tu información!

---

## 📲 Instalación y Configuración

### Prerrequisitos
```bash
npm install -g @ionic/cli
npm install -g @angular/cli
```

### Instalación del Proyecto
```bash
# Clonar el repositorio
git clone https://github.com/Badboi114/APPmovil.git
cd APPmovil/PassVaultIonic

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
ionic serve

# Compilar para producción
ionic build

# Generar APK (Android)
ionic capacitor add android
ionic capacitor run android
```

## 🔧 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   └── lock-screen/          # Componente de pantalla de bloqueo PIN
│   ├── pages/
│   │   ├── login/                # Página de inicio de sesión
│   │   ├── register/             # Página de registro
│   │   └── tabs/                 # Navegación principal por pestañas
│   ├── services/
│   │   ├── auth.service.ts       # Servicio de autenticación
│   │   └── encryption.service.ts # Servicio de encriptación
│   └── tab3/                     # Página de perfil de usuario
├── assets/                       # Recursos estáticos
└── global.scss                   # Estilos globales
```

## � Flujo de Autenticación

1. **Registro**: Email + Contraseña → **PIN generado automáticamente**
2. **Login**: Email + Contraseña → **Estado: Logueado pero no autenticado**
3. **PIN Entry**: Usuario ingresa PIN → **Estado: Completamente autenticado**
4. **Acceso a App**: Usuario puede acceder a todas las funcionalidades

## 🔐 Características de Seguridad

- ✅ **Hashing de contraseñas** con salt
- ✅ **PIN encriptado** con algoritmos seguros
- ✅ **Sesiones seguras** con validación por PIN
- ✅ **Almacenamiento local encriptado**
- ✅ **Validación de formularios** en frontend
- ✅ **Pantalla de bloqueo** con teclado numérico

## 📱 Capturas de Pantalla

### Pantalla de Login
- Formulario de email y contraseña
- Validación en tiempo real
- Diseño moderno con gradientes

### Pantalla de Registro
- Formulario completo de registro
- **Mensaje claro con PIN generado**
- Validación de campos obligatorios

### Pantalla de PIN
- **Teclado numérico personalizado**
- Indicadores visuales de dígitos ingresados
- Autenticación segura

### Perfil de Usuario
- **Edición individual de campos**
- Actualización en tiempo real
- Interfaz intuitiva

## 🎯 Funcionalidades Implementadas

### ✅ Completadas
- [x] Sistema de registro con email/contraseña
- [x] Generación automática de PIN de 4 dígitos
- [x] Pantalla de login con validación
- [x] Componente lock-screen con teclado numérico
- [x] Perfil de usuario editable
- [x] Encriptación de datos sensibles
- [x] Navegación por pestañas
- [x] Diseño responsive optimizado

### 🔄 En Desarrollo
- [ ] Gestión completa de contraseñas
- [ ] Búsqueda y filtrado de credenciales
- [ ] Exportación/importación de datos
- [ ] Sincronización en la nube (opcional)

## 🚀 Comenzar Ahora

```bash
# Clonar y ejecutar
git clone https://github.com/Badboi114/APPmovil.git
cd APPmovil/PassVaultIonic
npm install
ionic serve
```

¡Visita http://localhost:8100 y comienza a usar PassVault! 🔐

---

## 🚀 **Inicio Rápido:**

### **1. Instalar Dependencias:**
```bash
npm install
```

### **2. Ejecutar la Aplicación:**
```bash
ionic serve --port 4200
```

### **3. Usar PassVault:**
- Abre http://localhost:4200
- **Registro:** Nombre + Email + Contraseña → Acceso inmediato
- **Login:** Email + Contraseña → Acceso inmediato
- **Gestionar:** Crear, editar y organizar tus contraseñas

---

## 🏗️ **Arquitectura:**

### **Frontend (Ionic/Angular):**
```
src/app/
├── pages/
│   ├── login/           ← Inicio de sesión
│   ├── register/        ← Registro de usuario
│   └── email-config/    ← (Deshabilitado)
├── services/
│   ├── auth.service.ts       ← Autenticación
│   ├── encryption.service.ts ← Encriptación
│   ├── database.service.ts   ← Almacenamiento
│   └── email.service.ts      ← (Simplificado)
└── tabs/
    ├── tab1/            ← Lista de contraseñas
    ├── tab2/            ← Añadir contraseña
    └── tab3/            ← Configuración
```

### **Funcionalidades:**
- ✅ **Autenticación:** Login/registro sin verificación por email
- ✅ **Seguridad:** Encriptación local de todas las contraseñas
- ✅ **Gestión:** CRUD completo de contraseñas
- ✅ **UI/UX:** Interfaz moderna con Ionic components

---

## 🔧 **Tecnologías:**

### **Core:**
- **Ionic Framework** - UI/UX móvil
- **Angular** - Framework frontend
- **TypeScript** - Lenguaje principal
- **CryptoJS** - Encriptación de datos

### **Dependencias:**
- **@ionic/angular** - Components UI
- **crypto-js** - Seguridad y encriptación
- **rxjs** - Programación reactiva

---

## 📋 **Scripts Disponibles:**

```bash
# Desarrollo
npm start              # Servidor de desarrollo
ionic serve           # Servidor Ionic
npm run build         # Compilar para producción

# Capacitor (Móvil)
ionic cap add ios     # Añadir plataforma iOS
ionic cap add android # Añadir plataforma Android
ionic cap run ios     # Ejecutar en iOS
ionic cap run android # Ejecutar en Android
```

---

## 🛡️ **Seguridad:**

### **Encriptación:**
- Todas las contraseñas se encriptan con **AES-256**
- Las credenciales de usuario usan **hash SHA-256**
- Almacenamiento seguro en **localStorage**

### **Autenticación:**
- Validación de formularios
- Gestión de sesiones
- Logout seguro

---

## 📱 **Funcionalidades de Usuario:**

### **Registro/Login:**
1. **Registro:** Nombre, email, contraseña → Acceso inmediato
2. **Login:** Email, contraseña → Acceso inmediato
3. **Logout:** Limpieza segura de sesión

### **Gestión de Contraseñas:**
1. **Ver:** Lista de todas las contraseñas guardadas
2. **Crear:** Nuevas entradas con título, usuario, contraseña, URL
3. **Editar:** Modificar contraseñas existentes
4. **Eliminar:** Borrar contraseñas de forma segura
5. **Buscar:** Filtrar por título o servicio

---

## 🎯 **Estado Actual:**

### ✅ **Completamente Funcional:**
- Registro e inicio de sesión directo
- Gestión completa de contraseñas
- Interfaz responsive y moderna
- Encriptación segura implementada

### ✅ **Optimizado:**
- Sin dependencias externas innecesarias
- Código limpio y mantenible
- Compilación rápida
- Tamaño optimizado

---

## 📞 **Soporte:**

Si encuentras algún problema:
1. Verifica que todas las dependencias estén instaladas
2. Comprueba que el puerto 4200 esté disponible
3. Revisa la consola del navegador para errores

---

## 🏆 **Conclusión:**

**PassVault** es un gestor de contraseñas completo, seguro y fácil de usar, desarrollado con tecnologías modernas. Funciona completamente offline y no requiere configuraciones complejas.

**¡Listo para proteger tus contraseñas de forma segura!** 🔐
