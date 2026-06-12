import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { useJobs } from '../context/JobContext';

const STATUS_OPTIONS = ['Applied', 'Interview', 'Offer', 'Rejected'];

export default function AddJobScreen({ navigation, route }) {
  const { addJob, updateJob, jobs } = useJobs();
  const editingId = route?.params?.jobId;

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState('Applied');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingId) {
      const job = jobs.find((j) => j.id === editingId);
      if (job) {
        setCompany(job.company || '');
        setRole(job.role || '');
        setLocation(job.location || '');
        setSalary(job.salary || '');
        setStatus(job.status || 'Applied');
        setNotes(job.notes || '');
      }
    }
  }, [editingId, jobs]);

  const handleSave = async () => {
    if (!company.trim() || !role.trim()) {
      Alert.alert('Missing fields', 'Please enter company and role.');
      return;
    }
    const payload = {
      company: company.trim(),
      role: role.trim(),
      location: location.trim() || undefined,
      salary: salary.trim() || undefined,
      status,
      notes: notes.trim() || undefined,
    };

    try {
      setLoading(true);
      if (editingId) {
        await updateJob(editingId, payload);
      } else {
        await addJob(payload);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.label}>Company</Text>
        <TextInput style={styles.input} value={company} onChangeText={setCompany} placeholder="e.g. Acme Inc." />

        <Text style={styles.label}>Role</Text>
        <TextInput style={styles.input} value={role} onChangeText={setRole} placeholder="e.g. Frontend Engineer" />

        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="City, Remote" />

        <Text style={styles.label}>Salary</Text>
        <TextInput style={styles.input} value={salary} onChangeText={setSalary} placeholder="Optional" keyboardType="numeric" />

        <Text style={styles.label}>Status</Text>
        <View style={styles.statusRow}>
          {STATUS_OPTIONS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.statusBtn, status === s && styles.statusBtnActive]}
              onPress={() => setStatus(s)}
            >
              <Text style={[styles.statusText, status === s && styles.statusTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any notes"
          multiline
        />

        <TouchableOpacity style={[styles.saveBtn, loading && { opacity: 0.7 }]} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>{editingId ? 'Update Job' : 'Add Job'}</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginTop: 12 },
  input: { backgroundColor: '#F9FAFB', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#E5E7EB', marginTop: 6, color: '#1a1a2e' },
  statusRow: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  statusBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#EEF2FF', marginRight: 8, marginTop: 8 },
  statusBtnActive: { backgroundColor: '#1A73E8' },
  statusText: { color: '#3730A3', fontWeight: '700' },
  statusTextActive: { color: '#fff' },
  saveBtn: { backgroundColor: '#1A73E8', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 18 },
  saveText: { color: '#fff', fontWeight: '800' },
});
