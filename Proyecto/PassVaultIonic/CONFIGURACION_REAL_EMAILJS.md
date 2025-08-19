# 🚀 CONFIGURACIÓN REAL DE EMAILJS - PASO A PASO

## ✅ OPCIÓN 1: Usar Configuración Preestablecida (FUNCIONA INMEDIATAMENTE)

**PassVault ya incluye credenciales funcionales para pruebas. Solo necesitas:**

1. **Abre PassVault** en http://localhost:3000
2. **Ve a "⚙️ Configurar Email"**
3. **Haz clic en "⚡ Configuración Rápida"**
4. **Ingresa tu email** en "Email de Prueba"
5. **Haz clic en "🧪 Probar Configuración"**
6. **¡Revisa tu bandeja de entrada!** 📧

> **Nota:** Esta configuración usa mi cuenta de EmailJS para pruebas. Para producción, crea tu propia cuenta.

---

## 🔧 OPCIÓN 2: Crear Tu Propia Cuenta de EmailJS

### Paso 1: Crear Cuenta
1. Ve a **https://www.emailjs.com**
2. Haz clic en **"Sign Up"**
3. Regístrate con tu email
4. **Confirma tu cuenta** por email

### Paso 2: Configurar Gmail
1. En el dashboard, haz clic en **"Add New Service"**
2. Selecciona **"Gmail"**
3. Haz clic en **"Connect Account"**
4. **Autoriza el acceso** a tu Gmail
5. **Copia el Service ID** (ejemplo: `service_abc1234`)

### Paso 3: Crear Template
1. Ve a **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. **Configura así:**

**Template Name:** `PassVault PIN`
**Subject:** `🔐 PassVault - Tu PIN: {{pin_code}}`

**HTML Content:** (Copia y pega exactamente)
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

4. **Guarda** y **copia el Template ID** (ejemplo: `template_xyz5678`)

### Paso 4: Obtener Public Key
1. Ve a **"Account" → "General"**
2. Busca **"Public Key"**
3. **Copia la Public Key** (ejemplo: `user_abcdef123456`)

### Paso 5: Configurar en PassVault
1. Ve a **"⚙️ Configurar Email"** en PassVault
2. Ingresa **TUS credenciales reales**:
   - Service ID: `tu_service_id`
   - Template ID: `tu_template_id`
   - Public Key: `tu_public_key`
3. **Prueba con tu email**
4. **Guarda la configuración**

---

## 🧪 CÓMO PROBAR QUE FUNCIONA

### Con Configuración Preestablecida:
1. ✅ Ve a **"⚙️ Configurar Email"**
2. ✅ Haz clic en **"⚡ Configuración Rápida"**
3. ✅ Ingresa tu email real en **"Email de Prueba"**
4. ✅ Haz clic en **"🧪 Probar Configuración"**
5. ✅ **¡Deberías recibir el email en 10-30 segundos!**

### Registro/Login Real:
1. ✅ Ve a **"Registro"**
2. ✅ Usa tu **email real**
3. ✅ Completa el formulario
4. ✅ **¡Recibirás un PIN por email!**
5. ✅ Usa el PIN en la pantalla de bloqueo

---

## 🔍 SOLUCIÓN DE PROBLEMAS

### ❌ No llega el email
- ✅ **Revisa SPAM/Correo no deseado**
- ✅ Espera 1-2 minutos (a veces tarda)
- ✅ Verifica que el email esté escrito correctamente
- ✅ Usa Gmail/Outlook (más confiables)

### ❌ Error en configuración
- ✅ Asegúrate de copiar las credenciales completas
- ✅ No debe haber espacios al inicio/final
- ✅ Service ID debe empezar con `service_`
- ✅ Template ID debe empezar con `template_`
- ✅ Public Key debe empezar con `user_`

### ❌ Error de template
- ✅ Usa exactamente estas variables: `{{to_name}}`, `{{pin_code}}`
- ✅ El template debe estar en formato **HTML**
- ✅ Guarda el template después de editarlo

---

## 📧 VARIABLES IMPORTANTES

**En tu template de EmailJS, DEBES usar exactamente estas variables:**

- `{{to_name}}` - Nombre del usuario
- `{{to_email}}` - Email del destinatario
- `{{pin_code}}` - PIN de 4 dígitos
- `{{user_name}}` - Nombre del usuario (alternativo)
- `{{app_name}}` - PassVault
- `{{from_name}}` - PassVault

---

## 🎯 RESUMEN RÁPIDO

### Para Pruebas Inmediatas:
1. **Configuración Rápida** en PassVault ✅
2. **Probar** con tu email ✅
3. **¡Listo!** ✅

### Para Producción:
1. **Crear cuenta** en EmailJS ✅
2. **Conectar Gmail** ✅
3. **Crear template** con el HTML proporcionado ✅
4. **Configurar** en PassVault ✅

¡Con esto tendrás emails reales funcionando en menos de 5 minutos! 🚀
