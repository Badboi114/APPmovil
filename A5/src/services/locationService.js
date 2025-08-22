import * as Location from 'expo-location';

/**
 * Solicita permisos de ubicación y obtiene la posición actual
 * @returns {Promise<Object>} Coordenadas de ubicación
 */
export const getCurrentLocation = async () => {
  try {
    // Verificar si los servicios de ubicación están habilitados
    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      throw new Error('Los servicios de ubicación están deshabilitados. Por favor habílitalos en la configuración de tu dispositivo.');
    }

    // Solicitar permisos
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permisos de ubicación denegados. Por favor permite el acceso a la ubicación para usar esta función.');
    }

    // Obtener ubicación actual
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      timeout: 15000,
      maximumAge: 300000, // 5 minutos
    });

    return {
      success: true,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error al obtener ubicación:', error);
    throw new Error(error.message || 'Error al obtener tu ubicación actual');
  }
};

/**
 * Verifica si los permisos de ubicación están concedidos
 * @returns {Promise<boolean>} Estado de los permisos
 */
export const checkLocationPermissions = async () => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error al verificar permisos:', error);
    return false;
  }
};
