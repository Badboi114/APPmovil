const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'passvault_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Función para crear las tablas si no existen
async function createTables() {
  try {
    // Tabla de usuarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        pin_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de contraseñas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_entries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        username VARCHAR(255),
        password_encrypted TEXT NOT NULL,
        url VARCHAR(500),
        notes_encrypted TEXT,
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de datos de bóveda (para otros tipos de datos)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vault_data (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        data_encrypted TEXT NOT NULL,
        data_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Índices para mejor rendimiento
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_password_entries_user_id ON password_entries(user_id);
      CREATE INDEX IF NOT EXISTS idx_vault_data_user_id ON vault_data(user_id);
      CREATE INDEX IF NOT EXISTS idx_vault_data_type ON vault_data(data_type);
    `);

    console.log('✅ Tablas creadas exitosamente');
  } catch (error) {
    console.error('❌ Error creando tablas:', error);
  }
}

// Middleware de autenticación (simplificado)
const authenticateToken = (req, res, next) => {
  // En producción, aquí verificarías el JWT token
  next();
};

// RUTAS

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'PassVault API funcionando correctamente',
    timestamp: new Date().toISOString(),
    database: 'PostgreSQL'
  });
});

// Registro de usuario
app.post('/api/users/register', async (req, res) => {
  try {
    const { email, name, password_hash, pin_hash } = req.body;
    
    const result = await pool.query(
      'INSERT INTO users (email, name, password_hash, pin_hash) VALUES ($1, $2, $3, $4) RETURNING id, email, name, created_at',
      [email, name, password_hash, pin_hash]
    );
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ 
        success: false, 
        message: 'El email ya está registrado' 
      });
    } else {
      console.error('Error registrando usuario:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  }
});

// Login de usuario
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password_hash } = req.body;
    
    const result = await pool.query(
      'SELECT id, email, name, password_hash FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }
    
    const user = result.rows[0];
    
    if (user.password_hash !== password_hash) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }
    
    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// Verificar PIN
app.post('/api/users/verify-pin', async (req, res) => {
  try {
    const { user_id, pin_hash } = req.body;
    
    const result = await pool.query(
      'SELECT pin_hash FROM users WHERE id = $1',
      [user_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }
    
    const user = result.rows[0];
    
    if (user.pin_hash !== pin_hash) {
      return res.status(401).json({ 
        success: false, 
        message: 'PIN incorrecto' 
      });
    }
    
    res.json({
      success: true,
      message: 'PIN verificado correctamente'
    });
  } catch (error) {
    console.error('Error verificando PIN:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// Guardar contraseña
app.post('/api/passwords', authenticateToken, async (req, res) => {
  try {
    const { user_id, title, username, password_encrypted, url, notes_encrypted, category } = req.body;
    
    const result = await pool.query(
      'INSERT INTO password_entries (user_id, title, username, password_encrypted, url, notes_encrypted, category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [user_id, title, username, password_encrypted, url, notes_encrypted, category]
    );
    
    res.status(201).json({
      success: true,
      message: 'Contraseña guardada exitosamente',
      password: result.rows[0]
    });
  } catch (error) {
    console.error('Error guardando contraseña:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// Obtener contraseñas del usuario
app.get('/api/passwords/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM password_entries WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.json({
      success: true,
      passwords: result.rows
    });
  } catch (error) {
    console.error('Error obteniendo contraseñas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// Actualizar contraseña
app.put('/api/passwords/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    
    // Construir la consulta dinámicamente
    const setClause = Object.keys(fields).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [id, ...Object.values(fields)];
    
    const result = await pool.query(
      `UPDATE password_entries SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contraseña no encontrada' 
      });
    }
    
    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente',
      password: result.rows[0]
    });
  } catch (error) {
    console.error('Error actualizando contraseña:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// Eliminar contraseña
app.delete('/api/passwords/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM password_entries WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contraseña no encontrada' 
      });
    }
    
    res.json({
      success: true,
      message: 'Contraseña eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando contraseña:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// Guardar datos de bóveda
app.post('/api/vault', authenticateToken, async (req, res) => {
  try {
    const { user_id, data_encrypted, data_type } = req.body;
    
    const result = await pool.query(
      'INSERT INTO vault_data (user_id, data_encrypted, data_type) VALUES ($1, $2, $3) RETURNING *',
      [user_id, data_encrypted, data_type]
    );
    
    res.status(201).json({
      success: true,
      message: 'Datos guardados en la bóveda',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error guardando en bóveda:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// Obtener datos de bóveda del usuario
app.get('/api/vault/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { type } = req.query;
    
    let query = 'SELECT * FROM vault_data WHERE user_id = $1';
    let params = [userId];
    
    if (type) {
      query += ' AND data_type = $2';
      params.push(type);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error obteniendo datos de bóveda:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
});

// Inicializar base de datos y servidor
async function startServer() {
  try {
    await createTables();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📊 Base de datos: PostgreSQL`);
      console.log(`🔐 API lista para PassVault`);
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await pool.end();
  process.exit(0);
});

startServer();
