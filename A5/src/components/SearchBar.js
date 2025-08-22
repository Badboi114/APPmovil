import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';

const SearchBar = ({ onSearch, onLocationSearch, loading }) => {
  const [cityName, setCityName] = useState('');

  const handleSearch = () => {
    if (cityName.trim() === '') {
      Alert.alert(
        'Campo requerido',
        'Por favor ingresa el nombre de una ciudad',
        [{ text: 'OK' }]
      );
      return;
    }

    Keyboard.dismiss();
    onSearch(cityName.trim());
  };

  const handleLocationSearch = () => {
    Keyboard.dismiss();
    onLocationSearch();
  };

  const handleSubmit = () => {
    handleSearch();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Buscar ciudad..."
            placeholderTextColor="#999"
            value={cityName}
            onChangeText={setCityName}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            autoCapitalize="words"
            autoCorrect={false}
            editable={!loading}
          />
          {cityName.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setCityName('')}
              disabled={loading}
            >
              <MaterialIcons name="clear" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.searchButton, loading && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={loading || cityName.trim() === ''}
          activeOpacity={0.7}
        >
          {loading ? (
            <MaterialIcons name="autorenew" size={24} color="#FFFFFF" />
          ) : (
            <MaterialIcons name="search" size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>o</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity
        style={[styles.locationButton, loading && styles.locationButtonDisabled]}
        onPress={handleLocationSearch}
        disabled={loading}
        activeOpacity={0.7}
      >
        <MaterialIcons 
          name="my-location" 
          size={20} 
          color={loading ? "#999" : "#4A90E2"} 
        />
        <Text style={[styles.locationButtonText, loading && styles.locationButtonTextDisabled]}>
          Usar mi ubicación actual
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    margin: 16,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  searchButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 48,
  },
  searchButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  locationButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E5E5E5',
  },
  locationButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500',
  },
  locationButtonTextDisabled: {
    color: '#999',
  },
});

export default SearchBar;
