import { useState, useCallback } from 'react';
import {
  getCurrentWeatherByCity,
  getCurrentWeatherByCoords,
  formatWeatherData,
} from '../services/weatherService';
import { getCurrentLocation } from '../services/locationService';

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Busca el clima por nombre de ciudad
   */
  const searchWeatherByCity = useCallback(async (cityName) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCurrentWeatherByCity(cityName);
      const formattedData = formatWeatherData(response.data);
      setWeatherData(formattedData);
    } catch (err) {
      console.error('Error searching weather by city:', err);
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca el clima por ubicación actual del usuario
   */
  const searchWeatherByLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Obtener ubicación actual
      const location = await getCurrentLocation();
      
      // Obtener datos del clima
      const response = await getCurrentWeatherByCoords(
        location.latitude,
        location.longitude
      );
      
      const formattedData = formatWeatherData(response.data);
      setWeatherData(formattedData);
    } catch (err) {
      console.error('Error searching weather by location:', err);
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpia el error actual
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Reinicia el estado del clima
   */
  const resetWeatherData = useCallback(() => {
    setWeatherData(null);
    setError(null);
    setLoading(false);
  }, []);

  /**
   * Reintenta la última búsqueda realizada
   */
  const retryLastSearch = useCallback(() => {
    if (weatherData?.city) {
      searchWeatherByCity(weatherData.city);
    } else {
      searchWeatherByLocation();
    }
  }, [weatherData, searchWeatherByCity, searchWeatherByLocation]);

  return {
    weatherData,
    loading,
    error,
    searchWeatherByCity,
    searchWeatherByLocation,
    clearError,
    resetWeatherData,
    retryLastSearch,
  };
};
