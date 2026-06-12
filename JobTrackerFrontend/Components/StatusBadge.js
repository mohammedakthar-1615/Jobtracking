import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/theme';

const STATUS_COLORS = {
  Applied:   { bg: '#E8F4FF', text: COLORS.primary, border: COLORS.primary },
  Interview: { bg: '#FFF8E1', text: COLORS.warning, border: COLORS.warning },
  Offer:     { bg: '#E6F9F0', text: COLORS.success, border: COLORS.success },
  Rejected:  { bg: '#FEE2E2', text: COLORS.danger, border: COLORS.danger },
};

const StatusBadge = ({ status }) => {
  const colors = STATUS_COLORS[status] || STATUS_COLORS['Applied'];
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <Text style={[styles.text, { color: colors.text }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default StatusBadge;