import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import StatusBadge from './StatusBadge';
import { COLORS, SPACING } from '../styles/theme';

const JobCard = ({ job, onPress }) => {
  const date = new Date(job.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>{job.company?.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.role} numberOfLines={1}>{job.role}</Text>
          <Text style={styles.company} numberOfLines={1}>{job.company}</Text>
        </View>
        <StatusBadge status={job.status} />
      </View>

      <View style={styles.footer}>
        {job.location ? (
          <Text style={styles.meta}>📍 {job.location}</Text>
        ) : null}
        {job.salary ? (
          <Text style={styles.meta}>💰 {job.salary}</Text>
        ) : null}
        <Text style={styles.date}>🗓 {date}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  logoText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  info: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  role: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  company: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  meta: {
    fontSize: 12,
    color: COLORS.muted,
    marginRight: SPACING.md,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default JobCard;