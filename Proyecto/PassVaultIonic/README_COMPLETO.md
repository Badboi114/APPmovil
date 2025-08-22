# 🔐 PassVault - Gestor de Contraseñas Híbrido

> **Aplicación híbrida móvil/web con base de datos SQLite y encriptación AES-256**

## 🚀 **CARACTERÍSTICAS PRINCIPALES**

### ✅ **Base de Datos Híbrida**
- **SQLite nativo** para Android (.apk)
- **SQLite.js + IndexedDB** para navegadores web
- **Funciona 100% offline** en ambas plataformas
- **CRUD completo** para usuarios y contraseñas

### 🔐 **Seguridad Máxima**
- **Encriptación AES-256-CBC** para contraseñas guardadas
- **Hash PBKDF2** para autenticación de usuarios
- **HMAC-SHA256** para verificación de integridad
- **PIN de 6 dígitos** para acceso rápido
- **Base de datos encriptada** en dispositivos móviles

### 📱 **Multiplataforma**
- **Android APK** (Capacitor + SQLite nativo)
- **Progressive Web App** (PWA)
- **Navegador web** (Chrome, Firefox, Safari)
- **Instalación desde navegador** (Add to Home Screen)

## 🛠️ **TECNOLOGÍAS UTILIZADAS**

```json
{
  "frontend": "Ionic 8 + Angular 18 + TypeScript",
  "database": "SQLite + @capacitor-community/sqlite",
  "encryption": "Crypto-JS (AES-256-CBC + PBKDF2)",
  "mobile": "Capacitor 6 + Android SDK",
  "web": "jeep-sqlite + IndexedDB fallback",
  "styling": "Ionic Components + Custom CSS"
}
```

## 📦 **INSTALACIÓN Y CONFIGURACIÓN**

### **Requisitos Previos:**
```bash
# Node.js 18+ y npm
node --version
npm --version

# Ionic CLI
npm install -g @ionic/cli

# Para Android APK (opcional)
# - Android Studio
# - Java JDK 11+
# - Android SDK
```

### **Instalación:**
```bash
# 1. Clonar repositorio
git clone https://github.com/Badboi114/APPmovil.git
cd APPmovil/Proyecto/PassVaultIonic

# 2. Instalar dependencias
npm install

# 3. Ejecutar en desarrollo
ionic serve

# 4. Para generar APK (Android)
ionic build --prod
ionic capacitor add android
ionic capacitor sync android
ionic capacitor open android
```

## 🎯 **FUNCIONALIDADES IMPLEMENTADAS**

### **👤 Gestión de Usuarios**
- ✅ Registro con email, nombre y contraseña
- ✅ Login con email/contraseña o PIN
- ✅ Generación automática de PIN seguro
- ✅ Actualización de perfil
- ✅ Cambio de contraseña con verificación

### **🔑 Gestión de Contraseñas**
- ✅ Guardar contraseñas con título, usuario, URL y notas
- ✅ Encriptación automática AES-256-CBC
- ✅ Búsqueda por título, URL o usuario
- ✅ Categorización por sitios web
- ✅ Edición y eliminación segura
- ✅ Copia al portapapeles

### **🔒 Seguridad Avanzada**
- ✅ Lock screen con PIN tras inactividad
- ✅ Logout automático por seguridad
- ✅ Logs de seguridad para auditoría
- ✅ Verificación de integridad de datos
- ✅ Protección contra ataques de fuerza bruta

## 📱 **CÓMO INSTALAR EN EL CELULAR**

### **Opción 1: PWA (Más Rápido)**
1. Abrir `http://localhost:8100` en el navegador del móvil
2. Toque en "⋯" (menú) → "Agregar a pantalla de inicio"
3. Confirmar instalación
4. ¡Listo! Funciona como app nativa

### **Opción 2: APK Android**
1. Construir proyecto: `ionic build --prod`
2. Agregar Android: `ionic capacitor add android`
3. Sincronizar: `ionic capacitor sync android`
4. Abrir Android Studio: `ionic capacitor open android`
5. Build → Generate Signed Bundle/APK
6. Instalar APK en el dispositivo

## 🗃️ **ESTRUCTURA DE LA BASE DE DATOS**

### **Tabla Users:**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  pin_hash TEXT NOT NULL,
  registration_date TEXT NOT NULL,
  last_login TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### **Tabla Password_Entries:**
```sql
CREATE TABLE password_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  site_name TEXT NOT NULL,
  site_url TEXT,
  username TEXT NOT NULL,
  encrypted_password TEXT NOT NULL,
  notes TEXT,
  category TEXT,
  is_favorite BOOLEAN DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## 🔐 **ESQUEMA DE ENCRIPTACIÓN**

### **Flujo de Seguridad:**
```
Usuario ingresa contraseña
    ↓
PBKDF2(password + salt, 10000 iterations)
    ↓
Hash almacenado en BD
    ↓
Contraseñas de sitios: AES-256-CBC(data, derived_key)
    ↓
HMAC-SHA256 para verificar integridad
```

### **Niveles de Protección:**
1. **🔒 Nivel 1**: Autenticación de usuario (PBKDF2)
2. **🔒 Nivel 2**: PIN de acceso rápido (PBKDF2)
3. **🔒 Nivel 3**: Encriptación de contraseñas (AES-256-CBC)
4. **🔒 Nivel 4**: Verificación de integridad (HMAC-SHA256)

## 🌐 **ENLACES IMPORTANTES**

- **🔗 Repositorio**: `https://github.com/Badboi114/APPmovil`
- **📱 Demo Web**: `http://localhost:8100` (después de ionic serve)
- **📖 Documentación**: Archivos `.md` en el proyecto
- **🐛 Issues**: GitHub Issues para reportar bugs

## 🤝 **CONTRIBUCIÓN**

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## 📄 **LICENCIA**

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 **DESARROLLADO POR**

- **GitHub**: [@Badboi114](https://github.com/Badboi114)
- **Tecnologías**: Ionic, Angular, SQLite, Capacitor, TypeScript
- **Año**: 2024-2025

---

### 🎉 **¡Gracias por usar PassVault!**

> *"Tu seguridad digital, nuestra prioridad"*
