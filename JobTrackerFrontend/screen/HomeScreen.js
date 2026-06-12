import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, TextInput, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import JobCard from '../Components/JobCard';
import FabButton from '../Components/FabButton';
import { COLORS } from '../styles/theme';

const FILTERS = ['All', 'Applied', 'Interview', 'Offer', 'Rejected'];
const STATS_COLORS = {
  Applied:   '#1A73E8',
  Interview: '#F59E0B',
  Offer:     '#10B981',
  Rejected:  '#EF4444',
};

const HomeScreen = ({ navigation }) => {
  const { jobs, loading, fetchJobs } = useJobs();
  const { user, logout } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const filtered = jobs.filter((j) => {
    const matchStatus = activeFilter === 'All' || j.status === activeFilter;
    const matchSearch =
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.role.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statCount = (status) => jobs.filter((j) => j.status === status).length;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: COLORS.background }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {user?.name?.split(' ')[0]} 👋</Text>
            <Text style={styles.sub}>{jobs.length} jobs tracked</Text>
          </View>
          <View style={styles.headerBtns}>
            <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddJob')}>
              <Text style={styles.addBtnText}>+ Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          {['Applied', 'Interview', 'Offer', 'Rejected'].map((s) => (
            <View key={s} style={[styles.statCard, { borderTopColor: STATS_COLORS[s] }]}>
              <Text style={[styles.statNum, { color: STATS_COLORS[s] }]}>{statCount(s)}</Text>
              <Text style={styles.statLabel}>{s}</Text>
            </View>
          ))}
        </View>

        <TextInput
          style={styles.search}
          placeholder="🔍  Search company or role..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.filters}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#1A73E8" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <JobCard job={item} onPress={() => navigation.navigate('JobDetail', { jobId: item.id })} />
            )}
            showsVerticalScrollIndicator={false}
            onRefresh={fetchJobs}
            refreshing={loading}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>📭</Text>
                <Text style={styles.emptyText}>No applications yet</Text>
                <Text style={styles.emptySub}>Tap "+ Add" to track your first job</Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 32 }}
          />
        )}
        <FabButton onPress={() => navigation.navigate('AddJob')} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greeting: { fontSize: 22, fontWeight: '800', color: '#1a1a2e' },
  sub: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  headerBtns: { flexDirection: 'row', gap: 8 },
  addBtn: { backgroundColor: '#1A73E8', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  logoutBtn: { backgroundColor: '#FEE2E2', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12 },
  logoutText: { color: '#EF4444', fontWeight: '700', fontSize: 14 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 10, alignItems: 'center', borderTopWidth: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  statNum: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 10, color: '#6B7280', marginTop: 2, fontWeight: '500' },
  search: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#1a1a2e', marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  filters: { flexDirection: 'row', marginBottom: 14, gap: 6 },
  filterTab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#E5E7EB' },
  filterTabActive: { backgroundColor: '#1A73E8' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  filterTextActive: { color: '#fff' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#374151' },
  emptySub: { fontSize: 14, color: '#9CA3AF', marginTop: 6 },
});

export default HomeScreen;