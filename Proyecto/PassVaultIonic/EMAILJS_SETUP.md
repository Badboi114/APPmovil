# 📧 Configuración REAL de EmailJS para PassVault

## 🚀 Tutorial Completo Paso a Paso

### 1. 📝 Crear cuenta en EmailJS
1. Ve a **https://www.emailjs.com**
2. Haz clic en **"Sign Up"**
3. Regístrate con tu email
4. Confirma tu cuenta por email

### 2. 🔧 Configurar servicio de Gmail
1. En el dashboard, ve a **"Email Services"**
2. Haz clic en **"Add New Service"**
3. Selecciona **"Gmail"**
4. Haz clic en **"Connect Account"**
5. Autoriza el acceso a tu Gmail
6. **Copia el Service ID** (ejemplo: `service_abc1234`)

### 3. 📄 Crear Template de Email
1. Ve a **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. Configura:

**Template Name:** `PassVault PIN`

**Subject:** `🔐 PassVault - Tu PIN de acceso`

**Content (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5; 
        }
        .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white; 
            border-radius: 12px; 
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
        }
        .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: bold; 
        }
        .content { 
            padding: 30px; 
            text-align: center; 
        }
        .pin-box { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 32px; 
            font-weight: bold; 
            padding: 20px; 
            border-radius: 12px; 
            margin: 25px 0; 
            letter-spacing: 8px;
        }
        .message { 
            color: #333; 
            line-height: 1.6; 
            margin: 20px 0; 
        }
        .footer { 
            background: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            font-size: 14px; 
            color: #666; 
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 PassVault</h1>
            <p>Tu bóveda de contraseñas segura</p>
        </div>
        
        <div class="content">
            <h2>¡Hola {{to_name}}!</h2>
            
            <p class="message">Has solicitado acceso a tu cuenta de PassVault.</p>
            
            <div class="pin-box">
                {{pin_code}}
            </div>
            
            <p class="message">
                <strong>Este PIN es válido para tu próximo acceso.</strong><br>
                Úsalo en la pantalla de bloqueo de PassVault.
            </p>
            
            <div class="warning">
                ⚠️ Si no solicitaste este PIN, puedes ignorar este email de forma segura.
            </div>
        </div>
        
        <div class="footer">
            <p>¡Gracias por usar PassVault!</p>
            <p><small>Este es un email automático, no respondas a este mensaje.</small></p>
        </div>
    </div>
</body>
</html>
```

4. **Guarda el template** y **copia el Template ID** (ejemplo: `template_xyz5678`)

### 4. 🔑 Obtener Public Key
1. Ve a **"Account" → "General"**
2. Busca **"Public Key"**
3. **Copia la Public Key** (ejemplo: `user_abcdef123456`)

### 5. ⚙️ Configurar en PassVault
1. Abre PassVault en **http://localhost:3000**
2. Ve a **"⚙️ Configurar Email"**
3. Puedes usar **"Configuración Rápida"** para autocompletar
4. Ingresa tus credenciales reales:
   - **Service ID**: `service_abc1234`
   - **Template ID**: `template_xyz5678`
   - **Public Key**: `user_abcdef123456`
5. **Prueba la configuración** con tu email
6. **Guarda la configuración**

### 6. 🧪 Probar el Sistema
1. Ve a **"Registro"** o **"Login"**
2. Usa tu email real
3. **¡Deberías recibir el PIN en tu bandeja de entrada!**

## 📋 Variables del Template

Asegúrate de usar estas variables exactas en tu template:

- `{{to_name}}` - Nombre del usuario
- `{{to_email}}` - Email del destinatario  
- `{{pin_code}}` - PIN de 4 dígitos
- `{{user_name}}` - Nombre del usuario (alternativo)
- `{{app_name}}` - Nombre de la app (PassVault)
- `{{from_name}}` - Remitente (PassVault)

## ⚡ Configuración Rápida con Credenciales de Ejemplo

Si quieres probar rápidamente, usa la función **"Configuración Rápida"** en PassVault, pero **DEBES cambiar** estos valores por los tuyos:

```
Service ID: service_gmail (cambiar por el tuyo)
Template ID: template_passvault (cambiar por el tuyo)  
Public Key: G8YHpBqsM7hZdOzJC (cambiar por el tuyo)
```

## 🔧 Solución de Problemas

### ❌ Email no llega
- ✅ Verifica que el servicio de Gmail esté conectado y activo
- ✅ Revisa carpeta de **Spam/Correo no deseado**
- ✅ Asegúrate de que las credenciales son correctas
- ✅ Verifica que el template tenga las variables correctas
- ✅ Usa la función **"🧪 Probar Configuración"** en PassVault

### ❌ Error de configuración
- ✅ Service ID debe empezar con `service_`
- ✅ Template ID debe empezar con `template_`
- ✅ Public Key debe empezar con `user_`
- ✅ No debe haber espacios en las credenciales

### ❌ Error en el template
- ✅ Usa exactamente estas variables: `{{to_name}}`, `{{pin_code}}`
- ✅ El template debe estar en modo **"HTML"**
- ✅ Guarda el template después de editarlo

## 💡 Tips Importantes

1. **Cuenta gratuita** permite **200 emails/mes**
2. **No compartas** tus credenciales de EmailJS
3. **Guarda** tus credenciales en un lugar seguro
4. **Usa tu email real** para las pruebas
5. **Revisa la consola** del navegador si hay errores

## 🎯 ¡Ya está configurado!

Una vez configurado correctamente:
- ✅ Los usuarios recibirán PINs reales por email
- ✅ No más alertas en pantalla
- ✅ Sistema profesional de autenticación por email
- ✅ Experiencia de usuario mejorada

¡Disfruta de tu sistema de autenticación con emails reales! 🎉
