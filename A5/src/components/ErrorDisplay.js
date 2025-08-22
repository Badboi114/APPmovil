import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ErrorDisplay = ({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  const getErrorIcon = () => {
    if (error.includes('conexión') || error.includes('internet')) {
      return 'wifi-off';
    } else if (error.includes('no encontrada') || error.includes('404')) {
      return 'location-off';
    } else if (error.includes('API Key') || error.includes('401')) {
      return 'key';
    } else if (error.includes('límite') || error.includes('429')) {
      return 'timer';
    } else {
      return 'error-outline';
    }
  };

  const getErrorColor = () => {
    if (error.includes('conexión') || error.includes('internet')) {
      return '#FF6B6B';
    } else if (error.includes('no encontrada') || error.includes('404')) {
      return '#FFB74D';
    } else if (error.includes('API Key') || error.includes('401')) {
      return '#9C27B0';
    } else if (error.includes('límite') || error.includes('429')) {
      return '#FF9800';
    } else {
      return '#F44336';
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.errorCard, { borderLeftColor: getErrorColor() }]}>
        <View style={styles.errorHeader}>
          <MaterialIcons 
            name={getErrorIcon()} 
            size={24} 
            color={getErrorColor()} 
          />
          <Text style={styles.errorTitle}>Error</Text>
          <TouchableOpacity 
            style={styles.dismissButton}
            onPress={onDismiss}
          >
            <MaterialIcons name="close" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.errorMessage}>{error}</Text>
        
        {onRetry && (
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: getErrorColor() }]}
            onPress={onRetry}
            activeOpacity={0.7}
          >
            <MaterialIcons name="refresh" size={18} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  dismissButton: {
    padding: 4,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
});

export default ErrorDisplay;
