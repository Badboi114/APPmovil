// App.js - Sistema Completo de Reservas de Citas Médicas
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  TextInput, 
  TouchableOpacity, 
  Platform
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

// Base de datos local simulada
class AppointmentDB {
  static appointments = [];
  static doctors = [
    { id: 1, name: 'Dr. Carlos García', specialty: 'Cardiología', schedule: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
    { id: 2, name: 'Dra. María López', specialty: 'Dermatología', schedule: ['08:30', '09:30', '10:30', '15:30', '16:30'] },
    { id: 3, name: 'Dr. Juan Pérez', specialty: 'Neurología', schedule: ['09:00', '10:30', '14:00', '15:30'] },
    { id: 4, name: 'Dra. Ana Martín', specialty: 'Pediatría', schedule: ['08:00', '09:00', '10:00', '16:00', '17:00'] },
    { id: 5, name: 'Dr. Luis Rodríguez', specialty: 'Medicina General', schedule: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
    { id: 6, name: 'Dra. Carmen Silva', specialty: 'Ginecología', schedule: ['09:30', '10:30', '14:30', '15:30'] },
    { id: 7, name: 'Dr. Miguel Torres', specialty: 'Ortopedia', schedule: ['08:30', '10:00', '11:30', '15:00'] },
    { id: 8, name: 'Dra. Elena Vega', specialty: 'Psiquiatría', schedule: ['14:00', '15:00', '16:00', '17:00'] }
  ];

  static addAppointment(appointment) {
    const newAppointment = {
      id: Date.now(),
      ...appointment,
      status: 'confirmada',
      createdAt: new Date().toISOString()
    };
    this.appointments.push(newAppointment);
    return newAppointment;
  }

  static getAppointments() {
    return this.appointments;
  }

  static cancelAppointment(id) {
    this.appointments = this.appointments.filter(apt => apt.id !== id);
  }

  static getDoctorsBySpecialty(specialty) {
    return this.doctors.filter(doc => doc.specialty === specialty);
  }

  static getAllSpecialties() {
    return [...new Set(this.doctors.map(doc => doc.specialty))];
  }

  static updateDoctorName(doctorId, newName) {
    const doctorIndex = this.doctors.findIndex(doc => doc.id === doctorId);
    if (doctorIndex !== -1) {
      this.doctors[doctorIndex].name = newName;
      return true;
    }
    return false;
  }

  static getAllDoctors() {
    return this.doctors;
  }

  static updateDoctorName(doctorId, newName) {
    const doctorIndex = this.doctors.findIndex(doc => doc.id === doctorId);
    if (doctorIndex !== -1) {
      this.doctors[doctorIndex].name = newName;
      return true;
    }
    return false;
  }

  static getAllDoctors() {
    return this.doctors;
  }
}

// Pantalla de Login
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa email y contraseña');
      return;
    }

    setLoading(true);
    
    // Simular autenticación con timeout
    setTimeout(() => {
      setLoading(false);
      onLogin(email); // Llamar directamente a onLogin
    }, 1000);
  };

  const handleRegister = () => {
    Alert.alert('Registro', 'Función de registro disponible próximamente');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.loginTitle}>🏥 Sistema de Citas Médicas</Text>
        <Text style={styles.loginSubtitle}>Inicia sesión para continuar</Text>
        
        <View style={styles.loginForm}>
          <Text style={styles.inputLabel}>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="usuario@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Text style={styles.inputLabel}>Contraseña:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkButton} onPress={handleRegister}>
            <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// Pantalla de Inicio
function HomeScreen({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0 });

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    const allAppointments = AppointmentDB.getAppointments();
    const userAppointments = allAppointments.filter(apt => apt.patientEmail === user);
    setAppointments(userAppointments);
    
    const now = new Date();
    const upcoming = userAppointments.filter(apt => new Date(apt.date) > now).length;
    const completed = userAppointments.filter(apt => apt.status === 'completada').length;
    
    setStats({
      total: userAppointments.length,
      upcoming,
      completed
    });
  };

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🏥 Bienvenido</Text>
      <Text style={styles.subtitle}>Sistema de Citas Médicas</Text>
      
      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Citas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.upcoming}</Text>
          <Text style={styles.statLabel}>Próximas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completadas</Text>
        </View>
      </View>

      {/* Próximas citas */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 Próximas Citas</Text>
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map(appointment => (
            <View key={appointment.id} style={styles.appointmentItem}>
              <Text style={styles.appointmentSpecialty}>{appointment.specialty}</Text>
              <Text style={styles.appointmentDoctor}>{appointment.doctor}</Text>
              <Text style={styles.appointmentDate}>
                {new Date(appointment.date).toLocaleDateString()} - {appointment.time}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No tienes citas próximas</Text>
        )}
      </View>

      {/* Acciones rápidas */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚡ Acciones Rápidas</Text>
        <TouchableOpacity style={styles.quickAction}>
          <Text style={styles.quickActionText}>🆕 Agendar Nueva Cita</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Text style={styles.quickActionText}>👩‍⚕️ Ver Médicos Disponibles</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Text style={styles.quickActionText}>📋 Mi Historial Médico</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Pantalla Nueva Cita
function NewAppointmentScreen({ user }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    specialty: '',
    doctor: '',
    date: '',
    time: '',
    patientName: '',
    patientPhone: '',
    reason: ''
  });
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  const specialties = AppointmentDB.getAllSpecialties();

  const selectSpecialty = (specialty) => {
    setFormData({ ...formData, specialty, doctor: '', time: '' });
    setAvailableDoctors(AppointmentDB.getDoctorsBySpecialty(specialty));
    setStep(2);
  };

  const selectDoctor = (doctor) => {
    setFormData({ ...formData, doctor: doctor.name });
    setAvailableTimes(doctor.schedule);
    setStep(3);
  };

  const selectDateTime = () => {
    if (formData.time && formData.date) setStep(4);
  };

  const createAppointment = () => {
    if (!formData.patientName || !formData.patientPhone) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const appointment = {
      ...formData,
      patientEmail: user,
      date: formData.date || new Date().toISOString(),
    };

    const newAppointment = AppointmentDB.addAppointment(appointment);

    Alert.alert(
      '✅ ¡Cita Agendada!',
      `Tu cita de ${formData.specialty} ha sido agendada para el ${formData.date} a las ${formData.time}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setStep(1);
            setFormData({
              specialty: '',
              doctor: '',
              date: '',
              time: '',
              patientName: '',
              patientPhone: '',
              reason: ''
            });
          }
        }
      ]
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={styles.stepTitle}>Paso 1: Selecciona Especialidad</Text>
            {specialties.map(specialty => (
              <TouchableOpacity
                key={specialty}
                style={styles.optionButton}
                onPress={() => selectSpecialty(specialty)}
              >
                <Text style={styles.optionText}>{specialty}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 2:
        return (
          <View>
            <Text style={styles.stepTitle}>Paso 2: Selecciona Médico</Text>
            <Text style={styles.selectedInfo}>Especialidad: {formData.specialty}</Text>
            {availableDoctors.map(doctor => (
              <TouchableOpacity
                key={doctor.id}
                style={styles.doctorCard}
                onPress={() => selectDoctor(doctor)}
              >
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
              <Text style={styles.backButtonText}>← Volver</Text>
            </TouchableOpacity>
          </View>
        );

      case 3:
        return (
          <View>
            <Text style={styles.stepTitle}>Paso 3: Fecha y Hora</Text>
            <Text style={styles.selectedInfo}>Médico: {formData.doctor}</Text>
            
            <Text style={styles.inputLabel}>Fecha (DD/MM/AAAA):</Text>
            <TextInput
              style={styles.input}
              value={formData.date}
              onChangeText={(text) => setFormData({ ...formData, date: text })}
              placeholder="15/09/2025"
            />

            <Text style={styles.timeLabel}>Horarios disponibles:</Text>
            <View style={styles.timeGrid}>
              {availableTimes.map(time => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeButton,
                    formData.time === time && styles.timeButtonSelected
                  ]}
                  onPress={() => setFormData({ ...formData, time })}
                >
                  <Text style={[
                    styles.timeButtonText,
                    formData.time === time && styles.timeButtonTextSelected
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.nextButton, (!formData.time || !formData.date) && styles.nextButtonDisabled]} 
              onPress={selectDateTime}
              disabled={!formData.time || !formData.date}
            >
              <Text style={styles.nextButtonText}>Siguiente →</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => setStep(2)}>
              <Text style={styles.backButtonText}>← Volver</Text>
            </TouchableOpacity>
          </View>
        );

      case 4:
        return (
          <View>
            <Text style={styles.stepTitle}>Paso 4: Información del Paciente</Text>
            
            <Text style={styles.summaryTitle}>Resumen de la cita:</Text>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryText}>🏥 {formData.specialty}</Text>
              <Text style={styles.summaryText}>👨‍⚕️ {formData.doctor}</Text>
              <Text style={styles.summaryText}>📅 {formData.date}</Text>
              <Text style={styles.summaryText}>⏰ {formData.time}</Text>
            </View>

            <Text style={styles.inputLabel}>Nombre del paciente:</Text>
            <TextInput
              style={styles.input}
              value={formData.patientName}
              onChangeText={(text) => setFormData({ ...formData, patientName: text })}
              placeholder="Nombre completo"
            />

            <Text style={styles.inputLabel}>Teléfono:</Text>
            <TextInput
              style={styles.input}
              value={formData.patientPhone}
              onChangeText={(text) => setFormData({ ...formData, patientPhone: text })}
              placeholder="+54 9 123 456 789"
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>Motivo de la consulta (opcional):</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.reason}
              onChangeText={(text) => setFormData({ ...formData, reason: text })}
              placeholder="Describe brevemente el motivo de tu consulta"
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity style={styles.confirmButton} onPress={createAppointment}>
              <Text style={styles.confirmButtonText}>✅ Confirmar Cita</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => setStep(3)}>
              <Text style={styles.backButtonText}>← Volver</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📝 Nueva Cita Médica</Text>
      <View style={styles.progressBar}>
        {[1, 2, 3, 4].map(num => (
          <View
            key={num}
            style={[
              styles.progressStep,
              step >= num && styles.progressStepActive
            ]}
          />
        ))}
      </View>
      {renderStepContent()}
    </ScrollView>
  );
}

// Pantalla Mis Citas
function MyAppointmentsScreen({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    const allAppointments = AppointmentDB.getAppointments();
    const userAppointments = allAppointments.filter(apt => apt.patientEmail === user);
    setAppointments(userAppointments);
  };

  const cancelAppointment = (appointment) => {
    Alert.alert(
      'Cancelar Cita',
      `¿Estás seguro de que deseas cancelar la cita de ${appointment.specialty}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, Cancelar',
          style: 'destructive',
          onPress: () => {
            AppointmentDB.cancelAppointment(appointment.id);
            loadAppointments();
            Alert.alert('✅ Cita cancelada correctamente');
          }
        }
      ]
    );
  };

  const filteredAppointments = appointments.filter(apt => {
    const now = new Date();
    const aptDate = new Date(apt.date);
    
    switch (filter) {
      case 'upcoming':
        return aptDate > now;
      case 'past':
        return aptDate < now;
      default:
        return true;
    }
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📋 Mis Citas</Text>
      
      {/* Filtros */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            Todas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'upcoming' && styles.filterButtonActive]}
          onPress={() => setFilter('upcoming')}
        >
          <Text style={[styles.filterText, filter === 'upcoming' && styles.filterTextActive]}>
            Próximas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'past' && styles.filterButtonActive]}
          onPress={() => setFilter('past')}
        >
          <Text style={[styles.filterText, filter === 'past' && styles.filterTextActive]}>
            Pasadas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de citas */}
      {filteredAppointments.length > 0 ? (
        filteredAppointments.map(appointment => (
          <View key={appointment.id} style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
              <Text style={styles.appointmentSpecialtyCard}>{appointment.specialty}</Text>
              <Text style={styles.appointmentStatus}>{appointment.status}</Text>
            </View>
            
            <Text style={styles.appointmentDoctorCard}>{appointment.doctor}</Text>
            <Text style={styles.appointmentPatient}>Paciente: {appointment.patientName}</Text>
            <Text style={styles.appointmentDateTime}>
              📅 {appointment.date} - ⏰ {appointment.time}
            </Text>
            
            {appointment.reason && (
              <Text style={styles.appointmentReason}>Motivo: {appointment.reason}</Text>
            )}
            
            <View style={styles.appointmentActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => cancelAppointment(appointment)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contactar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {filter === 'upcoming' ? 'No tienes citas próximas' :
             filter === 'past' ? 'No tienes citas pasadas' :
             'No tienes citas registradas'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

// Pantalla de Perfil
function ProfileScreen({ user, onLogout }) {
  const [notifications, setNotifications] = useState(true);
  const [showManageDoctors, setShowManageDoctors] = useState(false);

  const toggleNotifications = () => {
    setNotifications(!notifications);
    Alert.alert(
      'Notificaciones',
      `Notificaciones ${!notifications ? 'activadas' : 'desactivadas'}`
    );
  };

  if (showManageDoctors) {
    return <ManageDoctorsScreen onBack={() => setShowManageDoctors(false)} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👤 Mi Perfil</Text>
      
      {/* Información del usuario */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📋 Información Personal</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Teléfono:</Text>
          <Text style={styles.infoValue}>+54 9 123 456 789</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>✏️ Editar Información</Text>
        </TouchableOpacity>
      </View>

      {/* Gestión de Doctores */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>👩‍⚕️ Gestión de Doctores</Text>
        <TouchableOpacity 
          style={styles.manageDoctorsButton} 
          onPress={() => setShowManageDoctors(true)}
        >
          <Text style={styles.manageDoctorsButtonText}>✏️ Personalizar Nombres de Doctores</Text>
        </TouchableOpacity>
        <Text style={styles.manageDoctorsDescription}>
          Cambia los nombres de los médicos según tus preferencias
        </Text>
      </View>

      {/* Configuraciones */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚙️ Configuraciones</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>🔔 Notificaciones</Text>
          <TouchableOpacity
            style={[styles.toggleButton, notifications && styles.toggleButtonActive]}
            onPress={toggleNotifications}
          >
            <Text style={styles.toggleButtonText}>
              {notifications ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.settingOption}>
          <Text style={styles.settingLabel}>🌍 Idioma</Text>
          <Text style={styles.settingValue}>Español</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingOption}>
          <Text style={styles.settingLabel}>❓ Ayuda</Text>
          <Text style={styles.settingValue}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Cerrar sesión */}
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Pantalla de Gestión de Doctores
function ManageDoctorsScreen({ onBack }) {
  const [doctors, setDoctors] = useState(AppointmentDB.getAllDoctors());
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [newName, setNewName] = useState('');

  const startEditing = (doctor) => {
    setEditingDoctor(doctor.id);
    setNewName(doctor.name);
  };

  const saveChanges = () => {
    if (newName.trim() && editingDoctor) {
      const success = AppointmentDB.updateDoctorName(editingDoctor, newName.trim());
      if (success) {
        setDoctors(AppointmentDB.getAllDoctors());
        setEditingDoctor(null);
        setNewName('');
        Alert.alert('✅ Éxito', 'Nombre del doctor actualizado correctamente');
      }
    }
  };

  const cancelEditing = () => {
    setEditingDoctor(null);
    setNewName('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerWithBack}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>👩‍⚕️ Gestionar Doctores</Text>
      </View>
      
      <Text style={styles.subtitle}>Personaliza los nombres de los médicos</Text>

      {doctors.map(doctor => (
        <View key={doctor.id} style={styles.doctorEditCard}>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorSpecialtyEdit}>{doctor.specialty}</Text>
            
            {editingDoctor === doctor.id ? (
              <View style={styles.editingContainer}>
                <TextInput
                  style={styles.editInput}
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Nombre del doctor"
                  autoFocus
                />
                <View style={styles.editActions}>
                  <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                    <Text style={styles.saveButtonText}>✅ Guardar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelEditButton} onPress={cancelEditing}>
                    <Text style={styles.cancelEditButtonText}>❌ Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.doctorDisplayContainer}>
                <Text style={styles.doctorNameEdit}>{doctor.name}</Text>
                <TouchableOpacity 
                  style={styles.editDoctorButton} 
                  onPress={() => startEditing(doctor)}
                >
                  <Text style={styles.editDoctorButtonText}>✏️ Editar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <View style={styles.scheduleInfo}>
            <Text style={styles.scheduleLabel}>Horarios:</Text>
            <Text style={styles.scheduleText}>{doctor.schedule.join(', ')}</Text>
          </View>
        </View>
      ))}

      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>💡 Instrucciones</Text>
        <Text style={styles.instructionsText}>
          • Toca "Editar" junto al nombre del doctor que deseas cambiar{'\n'}
          • Escribe el nuevo nombre{'\n'}
          • Toca "Guardar" para confirmar los cambios{'\n'}
          • Los cambios se aplicarán inmediatamente en toda la aplicación
        </Text>
      </View>
    </ScrollView>
  );
}

// Navegador principal con pestañas
function MainTabNavigator({ user, onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconText;
          switch (route.name) {
            case 'Inicio':
              iconText = '🏠';
              break;
            case 'Nueva Cita':
              iconText = '📝';
              break;
            case 'Mis Citas':
              iconText = '📋';
              break;
            case 'Perfil':
              iconText = '👤';
              break;
          }
          return <Text style={{ fontSize: size }}>{iconText}</Text>;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Inicio">
        {() => <HomeScreen user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Nueva Cita">
        {() => <NewAppointmentScreen user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Mis Citas">
        {() => <MyAppointmentsScreen user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Perfil">
        {() => <ProfileScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Componente principal de la aplicación
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular verificación de sesión
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleLogin = (userEmail) => {
    setUser(userEmail);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          onPress: () => {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingTitle}>🏥 Sistema de Citas Médicas</Text>
        <Text style={styles.loadingText}>Cargando aplicación...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <MainTabNavigator user={user} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
}

// Estilos completos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  
  // Login styles
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 10,
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  loginForm: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    padding: 10,
    alignItems: 'center',
  },
  linkText: {
    color: '#2196F3',
    fontSize: 14,
  },

  // General styles
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 12,
  },

  // Home screen styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  appointmentItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  appointmentSpecialty: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  appointmentDoctor: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  appointmentDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    padding: 20,
  },
  quickAction: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  quickActionText: {
    fontSize: 16,
    color: '#333',
  },

  // New appointment styles
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  progressStep: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: '#2196F3',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 20,
    textAlign: 'center',
  },
  selectedInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  doctorCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#666',
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 16,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    width: '22%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeButtonSelected: {
    backgroundColor: '#2196F3',
  },
  timeButtonText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  timeButtonTextSelected: {
    color: 'white',
  },
  nextButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#2196F3',
    fontSize: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  summaryCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // My appointments styles
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    backgroundColor: 'white',
    marginHorizontal: 2,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
  },
  filterText: {
    color: '#333',
    fontSize: 14,
  },
  filterTextActive: {
    color: 'white',
  },
  appointmentCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentSpecialtyCard: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  appointmentStatus: {
    fontSize: 12,
    color: '#4CAF50',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  appointmentDoctorCard: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  appointmentPatient: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  appointmentDateTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  appointmentReason: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 12,
  },
  contactButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginLeft: 5,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },

  // Profile styles
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 15,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
  },
  toggleButton: {
    backgroundColor: '#ddd',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  toggleButtonActive: {
    backgroundColor: '#4CAF50',
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Estilos para gestión de doctores
  headerWithBack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  manageDoctorsButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  manageDoctorsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  manageDoctorsDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  doctorEditCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorInfo: {
    marginBottom: 12,
  },
  doctorSpecialtyEdit: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  doctorDisplayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doctorNameEdit: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  editDoctorButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editDoctorButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  editingContainer: {
    marginTop: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelEditButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  cancelEditButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scheduleInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  scheduleLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  scheduleText: {
    fontSize: 12,
    color: '#333',
  },
  instructionsCard: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 40,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
});
