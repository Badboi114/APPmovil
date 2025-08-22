import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

// Componentes
import SearchBar from './src/components/SearchBar';
import WeatherDisplay from './src/components/WeatherDisplay';
import ErrorDisplay from './src/components/ErrorDisplay';

// Hooks
import { useWeather } from './src/hooks/useWeather';

export default function App() {
  const {
    weatherData,
    loading,
    error,
    searchWeatherByCity,
    searchWeatherByLocation,
    clearError,
    retryLastSearch,
  } = useWeather();

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="dark" backgroundColor="#F8F9FA" />
      
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : StatusBar.currentHeight}
      >
        <View style={styles.content}>
          {/* Barra de búsqueda */}
          <SearchBar
            onSearch={searchWeatherByCity}
            onLocationSearch={searchWeatherByLocation}
            loading={loading}
          />

          {/* Mostrar error si existe */}
          {error && (
            <ErrorDisplay
              error={error}
              onRetry={retryLastSearch}
              onDismiss={clearError}
            />
          )}

          {/* Mostrar datos del clima */}
          <WeatherDisplay
            weatherData={weatherData}
            loading={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
