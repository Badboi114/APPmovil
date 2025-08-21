# 🔑 GUÍA PARA CONFIGURAR GMAIL APP PASSWORD

## PASOS PARA OBTENER APP PASSWORD DE GMAIL:

### 1. **Habilitar 2FA en tu cuenta Gmail:**
   - Ve a: https://myaccount.google.com/security
   - En "Iniciar sesión en Google", habilita "Verificación en 2 pasos"
   - Sigue las instrucciones para configurar 2FA

### 2. **Generar App Password:**
   - Ve a: https://myaccount.google.com/apppasswords
   - Selecciona "Correo" como aplicación
   - Selecciona "Otro (nombre personalizado)" como dispositivo
   - Escribe: "PassVault Email Service"
   - Google generará una contraseña de 16 caracteres como: `abcd efgh ijkl mnop`

### 3. **Copia esa contraseña** (sin espacios): `abcdefghijklmnop`

### 4. **Configurar en PassVault:**
   - Editar el archivo: `backend/.env`
   - Cambiar líneas:
     ```
     GMAIL_USER=tu_email@gmail.com
     GMAIL_PASSWORD=abcdefghijklmnop
     ```

## ⚠️ IMPORTANTE:
- **NO uses tu contraseña normal de Gmail**
- **USA SOLO la App Password** de 16 caracteres
- La App Password se ve así: `abcdefghijklmnop` (sin espacios)

## 🔗 ENLACES DIRECTOS:
- Seguridad: https://myaccount.google.com/security
- App Passwords: https://myaccount.google.com/apppasswords
