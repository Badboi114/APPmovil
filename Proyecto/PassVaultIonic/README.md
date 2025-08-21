# 🔐 PassVault - Gestor de Contraseñas Seguro

## 📱 **Aplicación Ionic/Angular para Gestión Segura de Contraseñas**

### ✅ **Características Principales:**
- 🔐 **Registro e inicio de sesión** directo y seguro
- 🔑 **Gestión completa de contraseñas** (crear, editar, eliminar)
- 🛡️ **Encriptación avanzada** con CryptoJS
- 💾 **Almacenamiento local** seguro
- 📱 **Interfaz moderna** con Ionic UI
- ⚡ **Sin dependencias externas** - funciona inmediatamente

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
