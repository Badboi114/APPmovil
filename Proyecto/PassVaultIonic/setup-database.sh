#!/bin/bash

echo "🔧 Configurando PostgreSQL y pgAdmin 4 para PassVault"
echo "================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar si PostgreSQL está instalado
if command_exists psql; then
    echo -e "${GREEN}✅ PostgreSQL ya está instalado${NC}"
else
    echo -e "${YELLOW}📦 Instalando PostgreSQL...${NC}"
    sudo apt update
    sudo apt install postgresql postgresql-contrib -y
fi

# Verificar si pgAdmin está instalado
if command_exists pgadmin4; then
    echo -e "${GREEN}✅ pgAdmin 4 ya está instalado${NC}"
else
    echo -e "${YELLOW}📦 Instalando pgAdmin 4...${NC}"
    
    # Agregar el repositorio de pgAdmin
    curl https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo apt-key add
    sudo sh -c 'echo "deb https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt update'
    
    # Instalar pgAdmin 4
    sudo apt install pgadmin4-desktop -y
fi

echo -e "${BLUE}🔧 Configurando PostgreSQL...${NC}"

# Iniciar PostgreSQL si no está ejecutándose
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Crear base de datos para PassVault
echo -e "${YELLOW}📊 Creando base de datos passvault_db...${NC}"

sudo -u postgres psql -c "CREATE DATABASE passvault_db;" 2>/dev/null || echo "Base de datos ya existe"
sudo -u postgres psql -c "CREATE USER passvault_user WITH ENCRYPTED PASSWORD 'passvault_pass';" 2>/dev/null || echo "Usuario ya existe"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE passvault_db TO passvault_user;" 2>/dev/null

echo -e "${GREEN}✅ Configuración de PostgreSQL completada${NC}"

echo ""
echo -e "${BLUE}📋 INFORMACIÓN DE CONEXIÓN:${NC}"
echo "================================"
echo "Host: localhost"
echo "Puerto: 5432"
echo "Base de datos: passvault_db"
echo "Usuario: postgres (o passvault_user)"
echo "Contraseña: postgres (o passvault_pass)"
echo ""

echo -e "${BLUE}🚀 PARA USAR pgAdmin 4:${NC}"
echo "========================="
echo "1. Abre pgAdmin 4 desde el menú de aplicaciones"
echo "2. Crea un nuevo servidor con estos datos:"
echo "   - Nombre: PassVault Server"
echo "   - Host: localhost"
echo "   - Puerto: 5432"
echo "   - Base de datos: passvault_db"
echo "   - Usuario: postgres"
echo "   - Contraseña: postgres"
echo ""

echo -e "${BLUE}🔐 PARA CAMBIAR LA CONTRASEÑA DE POSTGRES:${NC}"
echo "=============================================="
echo "sudo -u postgres psql"
echo "\\password postgres"
echo "\\q"
echo ""

echo -e "${GREEN}🎉 ¡Configuración completada!${NC}"
echo "Ahora puedes ejecutar el backend con:"
echo "cd backend && npm start"
