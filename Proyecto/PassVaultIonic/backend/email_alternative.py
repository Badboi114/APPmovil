#!/usr/bin/env python3
"""
Sistema de Email Alternativo para PassVault
Funciona sin necesidad de configurar Gmail App Password
"""

import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

logger = logging.getLogger(__name__)

class SimpleEmailSender:
    """Servicio de email simplificado con múltiples opciones"""
    
    def __init__(self):
        self.methods = {
            'outlook': self.send_outlook,
            'yahoo': self.send_yahoo,
            'console': self.send_console,
            'file': self.send_file
        }
    
    def send_outlook(self, email, pin, user_name):
        """Envío usando Outlook (más fácil que Gmail)"""
        try:
            # Outlook es más permisivo que Gmail
            smtp_server = "smtp.live.com"
            port = 587
            
            # Usar email y contraseña normal de Outlook/Hotmail
            sender_email = "tu_email@outlook.com"  # Cambiar por tu Outlook
            password = "tu_password"  # Contraseña normal de Outlook
            
            # Crear mensaje
            message = MIMEMultipart("alternative")
            message["Subject"] = "PassVault - Tu PIN de acceso"
            message["From"] = sender_email
            message["To"] = email
            
            # Contenido del email
            html = f"""
            <html>
                <body style="font-family: Arial, sans-serif;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #333;">🔐 PassVault PIN</h2>
                        <p>Hola <strong>{user_name}</strong>,</p>
                        <p>Tu PIN de acceso es:</p>
                        <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #333; border-radius: 5px;">
                            {pin}
                        </div>
                        <p style="color: #666; font-size: 12px;">Este PIN es válido por 5 minutos.</p>
                    </div>
                </body>
            </html>
            """
            
            part = MIMEText(html, "html")
            message.attach(part)
            
            # Enviar
            context = ssl.create_default_context()
            with smtplib.SMTP(smtp_server, port) as server:
                server.starttls(context=context)
                server.login(sender_email, password)
                server.sendmail(sender_email, email, message.as_string())
            
            logger.info(f"Email enviado exitosamente a {email} via Outlook")
            return True
            
        except Exception as e:
            logger.error(f"Error enviando email via Outlook: {e}")
            return False
    
    def send_yahoo(self, email, pin, user_name):
        """Envío usando Yahoo (también más fácil que Gmail)"""
        try:
            smtp_server = "smtp.mail.yahoo.com"
            port = 587
            
            sender_email = "tu_email@yahoo.com"  # Cambiar por tu Yahoo
            password = "tu_password"  # Contraseña normal de Yahoo
            
            message = MIMEMultipart()
            message["Subject"] = "PassVault PIN"
            message["From"] = sender_email
            message["To"] = email
            
            body = f"""
            Hola {user_name},
            
            Tu PIN de PassVault es: {pin}
            
            Este PIN es válido por 5 minutos.
            
            Saludos,
            PassVault Team
            """
            
            message.attach(MIMEText(body, "plain"))
            
            context = ssl.create_default_context()
            with smtplib.SMTP(smtp_server, port) as server:
                server.starttls(context=context)
                server.login(sender_email, password)
                server.sendmail(sender_email, email, message.as_string())
            
            logger.info(f"Email enviado exitosamente a {email} via Yahoo")
            return True
            
        except Exception as e:
            logger.error(f"Error enviando email via Yahoo: {e}")
            return False
    
    def send_console(self, email, pin, user_name):
        """Mostrar email en consola (para desarrollo)"""
        print("\n" + "="*50)
        print("📧 EMAIL ENVIADO (MODO CONSOLA)")
        print("="*50)
        print(f"Para: {email}")
        print(f"Usuario: {user_name}")
        print(f"PIN: {pin}")
        print("="*50 + "\n")
        logger.info(f"PIN {pin} mostrado en consola para {email}")
        return True
    
    def send_file(self, email, pin, user_name):
        """Guardar email en archivo (para desarrollo)"""
        try:
            with open("emails_enviados.txt", "a", encoding="utf-8") as f:
                f.write(f"\n--- EMAIL {email} ---\n")
                f.write(f"Usuario: {user_name}\n")
                f.write(f"PIN: {pin}\n")
                f.write(f"Fecha: {__import__('datetime').datetime.now()}\n")
                f.write("-" * 30 + "\n")
            
            logger.info(f"Email guardado en archivo para {email}")
            return True
        except Exception as e:
            logger.error(f"Error guardando email en archivo: {e}")
            return False
    
    def send_pin_email(self, email, pin, user_name, method='console'):
        """Enviar PIN usando el método especificado"""
        if method in self.methods:
            return self.methods[method](email, pin, user_name)
        else:
            logger.error(f"Método {method} no disponible")
            return False

# Función principal para usar desde el API
def send_email_alternative(email, pin, user_name):
    """Función principal que prueba múltiples métodos"""
    sender = SimpleEmailSender()
    
    # Probar métodos en orden de preferencia
    methods = ['outlook', 'yahoo', 'console', 'file']
    
    for method in methods:
        try:
            if sender.send_pin_email(email, pin, user_name, method):
                return True
        except Exception as e:
            logger.warning(f"Método {method} falló: {e}")
            continue
    
    return False
