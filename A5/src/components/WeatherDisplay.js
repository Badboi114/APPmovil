import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const WeatherDisplay = ({ weatherData, loading }) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIcons name="autorenew" size={50} color="#4A90E2" />
        <Text style={styles.loadingText}>Obteniendo datos del clima...</Text>
      </View>
    );
  }

  if (!weatherData) {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="cloud" size={80} color="#BDC3C7" />
        <Text style={styles.emptyText}>Busca una ciudad para ver el clima</Text>
        <Text style={styles.emptySubtext}>
          Ingresa el nombre de una ciudad y presiona "Buscar Clima"
        </Text>
      </View>
    );
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Información principal */}
      <View style={styles.mainInfo}>
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={20} color="#666" />
          <Text style={styles.cityName}>
            {weatherData.city}, {weatherData.country}
          </Text>
        </View>
        
        <View style={styles.temperatureContainer}>
          <Image
            source={{
              uri: `https://openweathermap.org/img/wn/${weatherData.icon}@4x.png`,
            }}
            style={styles.weatherIcon}
          />
          <Text style={styles.temperature}>{weatherData.temperature}°C</Text>
        </View>
        
        <Text style={styles.description}>
          {weatherData.description.charAt(0).toUpperCase() + weatherData.description.slice(1)}
        </Text>
        
        <Text style={styles.feelsLike}>
          Sensación térmica: {weatherData.feelsLike}°C
        </Text>
      </View>

      {/* Detalles del clima */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Detalles del Clima</Text>
        
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Feather name="droplets" size={24} color="#4A90E2" />
            <Text style={styles.detailLabel}>Humedad</Text>
            <Text style={styles.detailValue}>{weatherData.humidity}%</Text>
          </View>
          
          <View style={styles.detailItem}>
            <MaterialIcons name="compress" size={24} color="#4A90E2" />
            <Text style={styles.detailLabel}>Presión</Text>
            <Text style={styles.detailValue}>{weatherData.pressure} hPa</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Feather name="wind" size={24} color="#4A90E2" />
            <Text style={styles.detailLabel}>Viento</Text>
            <Text style={styles.detailValue}>{weatherData.windSpeed} m/s</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Feather name="eye" size={24} color="#4A90E2" />
            <Text style={styles.detailLabel}>Visibilidad</Text>
            <Text style={styles.detailValue}>{weatherData.visibility} km</Text>
          </View>
        </View>
      </View>

      {/* Información del sol */}
      <View style={styles.sunContainer}>
        <Text style={styles.sunTitle}>Sol</Text>
        <View style={styles.sunGrid}>
          <View style={styles.sunItem}>
            <Feather name="sunrise" size={24} color="#F39C12" />
            <Text style={styles.sunLabel}>Amanecer</Text>
            <Text style={styles.sunValue}>{formatTime(weatherData.sunrise)}</Text>
          </View>
          
          <View style={styles.sunItem}>
            <Feather name="sunset" size={24} color="#E67E22" />
            <Text style={styles.sunLabel}>Atardecer</Text>
            <Text style={styles.sunValue}>{formatTime(weatherData.sunset)}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  mainInfo: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '300',
    color: '#333',
    marginLeft: 8,
  },
  description: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  feelsLike: {
    fontSize: 14,
    color: '#999',
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: (width - 72) / 2,
    alignItems: 'center',
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sunContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sunTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  sunGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sunItem: {
    alignItems: 'center',
  },
  sunLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  sunValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default WeatherDisplay;
