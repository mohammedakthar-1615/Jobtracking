import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../styles/theme';

const SignupScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Info', 'Please fill all fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password);
    } catch (e) {
      const msg = e.response?.data?.message || 'Registration failed. Please try again.';
      Alert.alert('Signup Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: COLORS.background }]}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>💼</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start tracking your job applications</Text>
        </View>

        {/* Form */}
        <View style={[styles.form, { backgroundColor: COLORS.card }] }>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />

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
          <TextInput
            style={styles.input}
            placeholder="Min 6 characters"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.7, backgroundColor: COLORS.primary }]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={[styles.btnText, { color: '#fff' }]}>Create Account</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.switchText}>
              Already have an account? <Text style={styles.switchLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center', paddingVertical: 40 },

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

  btn: {
    backgroundColor: '#1A73E8', borderRadius: 14,
    paddingVertical: 15, alignItems: 'center', marginTop: 24,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  switchBtn: { alignItems: 'center', marginTop: 16 },
  switchText: { fontSize: 14, color: '#6B7280' },
  switchLink: { color: '#1A73E8', fontWeight: '700' },
});

export default SignupScreen;