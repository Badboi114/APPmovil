import axios from 'axios';
import Constants from 'expo-constants';

// Obtener variables de entorno con fallback
const getEnvVar = (key, fallback = null) => {
  // Intentar obtener de process.env (web)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  
  // Intentar obtener de Expo Constants
  if (Constants.expoConfig?.extra?.[key]) {
    return Constants.expoConfig.extra[key];
  }
  
  // Valores actualizados para desarrollo
  const devValues = {
    OPENWEATHER_API_KEY: '8d2de98e089f1c28e1a22fc19a24ef04',
    OPENWEATHER_BASE_URL: 'https://api.openweathermap.org/data/2.5'
  };
  
  return devValues[key] || fallback;
};

const OPENWEATHER_API_KEY = getEnvVar('OPENWEATHER_API_KEY');
const OPENWEATHER_BASE_URL = getEnvVar('OPENWEATHER_BASE_URL');

// Configuración de la instancia de axios
const weatherAPI = axios.create({
  baseURL: OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5',
  timeout: 10000,
});

/**
 * Obtiene datos del clima actual por nombre de ciudad
 * @param {string} cityName - Nombre de la ciudad
 * @returns {Promise<Object>} Datos del clima
 */
export const getCurrentWeatherByCity = async (cityName) => {
  try {
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your_api_key_here') {
      throw new Error('API Key no configurada. Por favor configura tu API Key de OpenWeatherMap en el archivo .env');
    }

    if (!cityName || cityName.trim() === '') {
      throw new Error('Por favor ingresa el nombre de una ciudad');
    }

    const response = await weatherAPI.get('/weather', {
      params: {
        q: cityName.trim(),
        appid: OPENWEATHER_API_KEY,
        units: 'metric', // Celsius
        lang: 'es', // Español
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error al obtener datos del clima:', error);
    
    if (error.response) {
      // Error de respuesta del servidor
      switch (error.response.status) {
        case 401:
          throw new Error('API Key inválida. Verifica tu configuración.');
        case 404:
          throw new Error('Ciudad no encontrada. Verifica el nombre e inténtalo de nuevo.');
        case 429:
          throw new Error('Límite de peticiones excedido. Intenta más tarde.');
        default:
          throw new Error(`Error del servidor: ${error.response.status}`);
      }
    } else if (error.request) {
      // Error de red
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    } else {
      // Error de configuración
      throw new Error(error.message || 'Error inesperado al consultar el clima');
    }
  }
};

/**
 * Obtiene datos del clima por coordenadas geográficas
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @returns {Promise<Object>} Datos del clima
 */
export const getCurrentWeatherByCoords = async (lat, lon) => {
  try {
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your_api_key_here') {
      throw new Error('API Key no configurada. Por favor configura tu API Key de OpenWeatherMap en el archivo .env');
    }

    const response = await weatherAPI.get('/weather', {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
        lang: 'es',
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error al obtener datos del clima por coordenadas:', error);
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('API Key inválida. Verifica tu configuración.');
        case 400:
          throw new Error('Coordenadas inválidas.');
        case 429:
          throw new Error('Límite de peticiones excedido. Intenta más tarde.');
        default:
          throw new Error(`Error del servidor: ${error.response.status}`);
      }
    } else if (error.request) {
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    } else {
      throw new Error(error.message || 'Error inesperado al consultar el clima');
    }
  }
};

/**
 * Formatea los datos del clima para mostrar en la UI
 * @param {Object} weatherData - Datos crudos de la API
 * @returns {Object} Datos formateados
 */
export const formatWeatherData = (weatherData) => {
  return {
    city: weatherData.name,
    country: weatherData.sys.country,
    temperature: Math.round(weatherData.main.temp),
    description: weatherData.weather[0].description,
    icon: weatherData.weather[0].icon,
    feelsLike: Math.round(weatherData.main.feels_like),
    humidity: weatherData.main.humidity,
    pressure: weatherData.main.pressure,
    windSpeed: weatherData.wind.speed,
    visibility: weatherData.visibility / 1000, // Convertir a km
    sunrise: new Date(weatherData.sys.sunrise * 1000),
    sunset: new Date(weatherData.sys.sunset * 1000),
  };
};
