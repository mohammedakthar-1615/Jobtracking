import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, SafeAreaView, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../styles/theme';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Info', 'Please enter email and password.');
      return;
    }
    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (e) {
      const msg = e.response?.data?.message || 'Login failed. Please try again.';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: COLORS.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.emoji}>💼</Text>
            <Text style={styles.title}>Job Tracker</Text>
            <Text style={styles.subtitle}>Track your job applications</Text>
          </View>

          {/* Form */}
          <View style={[styles.form, { backgroundColor: COLORS.card }] }>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setShowPassword((s) => !s)}
              >
                <Text>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.btn, loading && { opacity: 0.7, backgroundColor: COLORS.primary }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={[styles.btnText, { color: '#fff' }]}>Login</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchBtn}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.switchText}>
                Don't have an account? <Text style={styles.switchLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center' },

  header: { alignItems: 'center', marginBottom: 40 },
  emoji: { fontSize: 56, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#1a1a2e' },
  subtitle: { fontSize: 15, color: '#6B7280', marginTop: 4 },

  form: { backgroundColor: '#fff', borderRadius: 20, padding: 24, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 12, elevation: 4 },

  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: '#F9FAFB', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: '#1a1a2e',
    borderWidth: 1, borderColor: '#E5E7EB',
  },

  inputRow: { flexDirection: 'row', alignItems: 'center' },
  passwordInput: { flex: 1, marginRight: 8 },
  iconButton: { padding: 8 },

  btn: {
    backgroundColor: '#1A73E8', borderRadius: 14,
    paddingVertical: 15, alignItems: 'center', marginTop: 24,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  switchBtn: { alignItems: 'center', marginTop: 16 },
  switchText: { fontSize: 14, color: '#6B7280' },
  switchLink: { color: '#1A73E8', fontWeight: '700' },
});

export default LoginScreen;