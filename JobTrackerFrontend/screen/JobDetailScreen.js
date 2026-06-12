import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useJobs } from '../context/JobContext';

const STATUS_OPTIONS = ['Applied', 'Interview', 'Offer', 'Rejected'];

export default function JobDetailScreen({ route, navigation }) {
  const { jobId } = route.params || {};
  const { jobs, updateJob, deleteJob } = useJobs();
  const job = useMemo(() => jobs.find((j) => j.id === jobId), [jobs, jobId]);

  const handleDelete = () => {
    Alert.alert('Delete', 'Are you sure you want to delete this job?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await deleteJob(jobId);
          navigation.goBack();
        } catch (e) {
          Alert.alert('Error', 'Failed to delete job');
        }
      } },
    ]);
  };

  const changeStatus = async (newStatus) => {
    try {
      await updateJob(jobId, { status: newStatus });
    } catch (e) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  if (!job) {
    return (
      <View style={styles.container}><Text style={styles.title}>Job not found</Text></View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.company}>{job.company}</Text>
        <Text style={styles.role}>{job.role}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{job.location || '—'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Salary:</Text>
          <Text style={styles.value}>{job.salary || '—'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{job.status}</Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={styles.label}>Notes</Text>
          <Text style={styles.notes}>{job.notes || 'No notes'}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('AddJob', { jobId })}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statusList}>
          {STATUS_OPTIONS.map((s) => (
            <TouchableOpacity key={s} style={[styles.statusOption, job.status === s && styles.statusOptionActive]} onPress={() => changeStatus(s)}>
              <Text style={[styles.statusOptionText, job.status === s && styles.statusOptionTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F3F4F6' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  company: { fontSize: 20, fontWeight: '800', color: '#1a1a2e' },
  role: { fontSize: 16, color: '#374151', marginTop: 4 },
  row: { flexDirection: 'row', marginTop: 10, alignItems: 'center' },
  label: { fontSize: 13, color: '#6B7280', width: 80, fontWeight: '600' },
  value: { fontSize: 14, color: '#111827' },
  notes: { marginTop: 6, color: '#374151' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  editBtn: { backgroundColor: '#1A73E8', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
  editText: { color: '#fff', fontWeight: '700' },
  deleteBtn: { backgroundColor: '#FEE2E2', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
  deleteText: { color: '#EF4444', fontWeight: '700' },
  statusList: { flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' },
  statusOption: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#E5E7EB', marginRight: 8, marginTop: 8 },
  statusOptionActive: { backgroundColor: '#1A73E8' },
  statusOptionText: { fontWeight: '700', color: '#374151' },
  statusOptionTextActive: { color: '#fff' },
});
