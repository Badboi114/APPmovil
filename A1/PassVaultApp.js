import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Switch, Slider } from 'react-native';

export default function PassVaultApp() {
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [tab, setTab] = useState('generator');
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [numbers, setNumbers] = useState(false);
  const [symbols, setSymbols] = useState(false);
  const [vault, setVault] = useState([]);

  const unlock = () => {
    // Simulación de PIN correcto
    if (pin.length === 5) setUnlocked(true);
  };

  const generatePassword = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-={}[]|:;<>,.?/';
    let pass = '';
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  return (
    <SafeAreaView style={styles.container}>
      {!unlocked ? (
        <View style={styles.lockedBox}>
          <Text style={styles.lockedTitle}>PassVault Bloqueado</Text>
          <Text style={styles.lockedSubtitle}>Ingresa tu PIN para desbloquear tu bóveda.</Text>
          <TextInput
            style={styles.pinInput}
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            secureTextEntry
            maxLength={5}
            placeholder="* * * * *"
            placeholderTextColor="#b3b3e6"
            textAlign="center"
          />
          <TouchableOpacity
            style={[styles.unlockBtn, pin.length !== 5 && styles.disabledBtn]}
            onPress={unlock}
            disabled={pin.length !== 5}
          >
            <Text style={styles.unlockBtnText}>Desbloquear</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.mainContent}>
          <Text style={styles.title}>PassVault</Text>
          <Text style={styles.subtitle}>Tu Compañero Seguro de Contraseñas</Text>
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tab, tab === 'generator' && styles.tabActive]}
              onPress={() => setTab('generator')}
            >
              <Text style={styles.tabText}>🔑 Generador</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, tab === 'vault' && styles.tabActive]}
              onPress={() => setTab('vault')}
            >
              <Text style={styles.tabText}>🛡️ Bóveda</Text>
            </TouchableOpacity>
          </View>
          {tab === 'generator' ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Generador de Contraseñas</Text>
              <Text style={styles.cardSubtitle}>Crea una contraseña fuerte y segura.</Text>
              <View style={styles.passwordBox}>
                <Text style={styles.passwordText}>{password || "Haz clic en 'Generar'..."}</Text>
              </View>
              <Text style={styles.sliderLabel}>Longitud de Contraseña</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={6}
                maximumValue={32}
                step={1}
                value={length}
                onValueChange={setLength}
                minimumTrackTintColor="#b3b3e6"
                maximumTrackTintColor="#3d4091"
                thumbTintColor="#b3b3e6"
              />
              <Text style={styles.lengthValue}>{length}</Text>
              <View style={styles.switchRow}>
                <View style={styles.switchBox}>
                  <Text style={styles.switchLabel}>Incluir Números</Text>
                  <Switch value={numbers} onValueChange={setNumbers} trackColor={{ true: '#b3b3e6', false: '#3d4091' }} />
                </View>
                <View style={styles.switchBox}>
                  <Text style={styles.switchLabel}>Incluir Símbolos</Text>
                  <Switch value={symbols} onValueChange={setSymbols} trackColor={{ true: '#b3b3e6', false: '#3d4091' }} />
                </View>
              </View>
              <TouchableOpacity style={styles.generateBtn} onPress={generatePassword}>
                <Text style={styles.generateBtnText}>⟳ Generar Contraseña</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Bóveda de Contraseñas</Text>
              <Text style={styles.cardSubtitle}>Tus contraseñas guardadas.</Text>
              {vault.length === 0 ? (
                <View style={styles.emptyVault}>
                  <Text style={styles.emptyIcon}>🔑</Text>
                  <Text style={styles.emptyText}>Tu bóveda está vacía.\nAñade una contraseña para empezar.</Text>
                </View>
              ) : (
                // Aquí iría el listado de contraseñas
                <Text>Contraseñas aquí...</Text>
              )}
              <TouchableOpacity style={styles.addBtn}>
                <Text style={styles.addBtnText}>+ Añadir Nueva</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.fab}>
            <Text style={styles.fabIcon}>🔑</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3d4091',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedBox: {
    backgroundColor: '#4548a6',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '85%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginTop: 80,
  },
  lockedTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  lockedSubtitle: {
    color: '#b3b3e6',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  pinInput: {
    backgroundColor: '#3d4091',
    color: '#fff',
    borderRadius: 8,
    fontSize: 24,
    letterSpacing: 16,
    padding: 12,
    marginBottom: 24,
    width: '100%',
    textAlign: 'center',
  },
  unlockBtn: {
    backgroundColor: '#6d70d6',
    borderRadius: 8,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  unlockBtnText: {
    color: '#b3b3e6',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  mainContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 80,
    backgroundColor: '#3d4091',
  },
  title: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: '#b3b3e6',
    fontSize: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#4548a6',
    borderRadius: 8,
    marginBottom: 24,
    width: '90%',
    alignSelf: 'center',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#3d4091',
  },
  tabText: {
    color: '#b3b3e6',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#4548a6',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    marginBottom: 24,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#b3b3e6',
    fontSize: 16,
    marginBottom: 16,
  },
  passwordBox: {
    backgroundColor: '#3d4091',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  passwordText: {
    color: '#b3b3e6',
    fontSize: 18,
    letterSpacing: 1,
  },
  sliderLabel: {
    color: '#b3b3e6',
    fontSize: 16,
    marginBottom: 4,
  },
  lengthValue: {
    color: '#b3b3e6',
    fontSize: 16,
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    backgroundColor: '#3d4091',
    borderRadius: 8,
    padding: 8,
  },
  switchLabel: {
    color: '#b3b3e6',
    fontSize: 16,
  },
  generateBtn: {
    backgroundColor: '#6d70d6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  generateBtnText: {
    color: '#b3b3e6',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyVault: {
    alignItems: 'center',
    marginVertical: 32,
  },
  emptyIcon: {
    fontSize: 48,
    color: '#b3b3e6',
    marginBottom: 8,
  },
  emptyText: {
    color: '#b3b3e6',
    fontSize: 16,
    textAlign: 'center',
  },
  addBtn: {
    backgroundColor: '#6d70d6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addBtnText: {
    color: '#b3b3e6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#8a6ed6',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  fabIcon: {
    fontSize: 28,
    color: '#fff',
  },
});
