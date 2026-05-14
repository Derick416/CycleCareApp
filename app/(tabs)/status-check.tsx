import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCycle, CycleEntry } from '../../components/CycleContext';
import { useTheme } from '../../components/ThemeContext';

const TODAY = new Date().toISOString().split('T')[0];

function getTodayStatus(markedDates: Record<string, any>) {
  const entry = markedDates[TODAY];
  if (!entry?.customStyles?.container?.backgroundColor) return null;
  const bg = entry.customStyles.container.backgroundColor;
  if (bg === '#E53935') return 'Period';
  if (bg === '#43A047') return 'Safe';
  if (bg === '#FB8C00') return 'Unsafe';
  if (bg === '#8E24AA') return 'Next Period';
  return null;
}

const STATUS_META = {
  Period: {
    icon: 'water-drop' as const,
    color: '#E53935',
    bg: '#FFEBEE',
    title: 'Period Day',
    tips: [
      'Use clean menstrual products and change every 4–6 hours.',
      'Stay hydrated and rest as needed.',
      'Light exercise like walking can ease cramps.',
      'Track flow heaviness for your health records.',
    ],
  },
  Safe: {
    icon: 'check-circle' as const,
    color: '#43A047',
    bg: '#E8F5E9',
    title: 'Safe Day',
    tips: [
      'Low likelihood of pregnancy today.',
      'Hormones are relatively stable — good energy day!',
      'Great time for physical activity.',
      'Continue tracking daily for accurate predictions.',
    ],
  },
  Unsafe: {
    icon: 'warning' as const,
    color: '#FB8C00',
    bg: '#FFF3E0',
    title: 'Fertile / Unsafe Day',
    tips: [
      'You are in your fertile window — highest pregnancy risk.',
      'If avoiding pregnancy, use contraception consistently.',
      'You may notice increased cervical mucus.',
      'Ovulation may occur around this period.',
    ],
  },
  'Next Period': {
    icon: 'event' as const,
    color: '#8E24AA',
    bg: '#F3E5F5',
    title: 'Next Period Expected',
    tips: [
      'Your next period is expected soon.',
      'Prepare supplies in advance.',
      'You may experience PMS symptoms — mood changes, bloating.',
      'Rest well and reduce caffeine intake.',
    ],
  },
};

function EntryCard({ entry, onDelete }: { entry: CycleEntry; onDelete: () => void }) {
  const { theme } = useTheme();
  const c = theme.colors;
  const [expanded, setExpanded] = useState(false);
  const todayStatus = getTodayStatus(entry.markedDates);
  const meta = todayStatus ? STATUS_META[todayStatus] : null;

  return (
    <View style={[styles.entryCard, { backgroundColor: c.surface }]}>
      <TouchableOpacity
        style={styles.entryHeader}
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.8}
      >
        <View style={styles.entryHeaderLeft}>
          <MaterialIcons name="calendar-month" size={20} color="#C2185B" />
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.entryTitle, { color: c.text }]}>
              Cycle: {new Date(entry.periodStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
            <Text style={[styles.entrySub, { color: c.textSecondary }]}>
              Next: {new Date(entry.nextPeriod).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </View>
        </View>
        <View style={styles.entryHeaderRight}>
          {todayStatus && (
            <View style={[styles.todayBadge, { backgroundColor: meta!.bg }]}>
              <Text style={[styles.todayBadgeText, { color: meta!.color }]}>Today: {todayStatus}</Text>
            </View>
          )}
          <MaterialIcons
            name={expanded ? 'expand-less' : 'expand-more'}
            size={22}
            color={c.textSecondary}
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
          {/* Calendar */}
          <Calendar
            markedDates={entry.markedDates}
            markingType="custom"
            style={[styles.calendarSmall, { backgroundColor: c.surface }]}
            theme={{
              backgroundColor: c.surface,
              calendarBackground: c.surface,
              todayTextColor: '#C2185B',
              arrowColor: '#C2185B',
              dayTextColor: c.text,
              monthTextColor: c.text,
            }}
          />

          {/* Today's status card */}
          {meta && (
            <View style={[styles.statusCard, { backgroundColor: meta.bg }]}>
              <View style={styles.statusCardHeader}>
                <MaterialIcons name={meta.icon} size={22} color={meta.color} />
                <Text style={[styles.statusCardTitle, { color: meta.color }]}>
                  {meta.title}
                </Text>
              </View>
              {meta.tips.map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                  <MaterialIcons name="fiber-manual-record" size={8} color={meta.color} style={{ marginTop: 5 }} />
                  <Text style={[styles.tipText, { color: meta.color }]}>{tip}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Legend */}
          <View style={[styles.legendBox, { backgroundColor: c.surfaceAlt }]}>
            {[
              { label: 'Period (days 1–5)', color: '#E53935' },
              { label: 'Safe days', color: '#43A047' },
              { label: 'Unsafe / Fertile', color: '#FB8C00' },
              { label: 'Next Period', color: '#8E24AA' },
            ].map((item) => (
              <View key={item.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={[styles.legendLabel, { color: c.textSecondary }]}>{item.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() =>
              Alert.alert('Delete', 'Remove this cycle entry?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: onDelete },
              ])
            }
          >
            <MaterialIcons name="delete-outline" size={16} color="#E53935" />
            <Text style={styles.deleteBtnText}>Delete this entry</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function StatusCheckPage() {
  const router = useRouter();
  const { entries, removeEntry } = useCycle();
  const { theme } = useTheme();
  const c = theme.colors;

  // Compute today's status from the most recent entry (if any)
  const latestEntry = entries.length > 0 ? entries[entries.length - 1] : null;
  const todayStatus = latestEntry ? getTodayStatus(latestEntry.markedDates) : null;
  const todayMeta = todayStatus ? STATUS_META[todayStatus] : null;

  if (entries.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: c.background }]}>
        <MaterialIcons name="calendar-today" size={64} color="#F48FB1" />
        <Text style={[styles.emptyTitle, { color: c.text }]}>No cycles tracked yet</Text>
        <Text style={[styles.emptyDesc, { color: c.textSecondary }]}>
          Start by logging your period start date in the Period Tracker.
        </Text>
        <TouchableOpacity
          style={styles.goTrackBtn}
          onPress={() => router.push('/period-tracker')}
        >
          <Text style={styles.goTrackText}>Go to Period Tracker</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <Text style={[styles.pageTitle, { color: c.text }]}>My Cycle History</Text>
      <Text style={[styles.pageSub, { color: c.textSecondary }]}>
        {entries.length} saved cycle{entries.length > 1 ? 's' : ''} · Tap any entry to view details
      </Text>
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} onDelete={() => removeEntry(entry.id)} />
      ))}
      <TouchableOpacity
        style={styles.addMoreBtn}
        onPress={() => router.push('/period-tracker')}
      >
        <MaterialIcons name="add" size={18} color="#C2185B" />
        <Text style={styles.addMoreText}>Track a new cycle</Text>
      </TouchableOpacity>

      {/* Today's status summary placed below the list */}
      {todayMeta && (
        <View style={[styles.todaySummary, { backgroundColor: todayMeta.bg }]}>
          <View style={styles.statusCardHeader}>
            <MaterialIcons name={todayMeta.icon} size={22} color={todayMeta.color} />
            <Text style={[styles.statusCardTitle, { color: todayMeta.color }]}>
              Today: {todayStatus} · {new Date().toLocaleDateString('en-US')}
            </Text>
          </View>
          <Text style={[styles.tipText, { color: todayMeta.color, marginTop: 8 }]}>
            {todayMeta.tips[0]}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginTop: 16, textAlign: 'center' },
  emptyDesc: { fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  goTrackBtn: {
    backgroundColor: '#C2185B', borderRadius: 14, paddingVertical: 14,
    paddingHorizontal: 28, marginTop: 24,
  },
  goTrackText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  pageTitle: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  pageSub: { fontSize: 12, marginBottom: 16 },

  entryCard: {
    borderRadius: 16, marginBottom: 12,
    elevation: 2, shadowColor: '#C2185B',
    shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
  },
  entryHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', padding: 14,
  },
  entryHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  entryHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  entryTitle: { fontSize: 14, fontWeight: '700' },
  entrySub: { fontSize: 11, marginTop: 1 },
  todayBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  todayBadgeText: { fontSize: 10, fontWeight: '700' },

  calendarSmall: { borderRadius: 12, marginBottom: 12, overflow: 'hidden' },

  statusCard: { borderRadius: 12, padding: 14, marginBottom: 12 },
  statusCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  statusCardTitle: { fontSize: 15, fontWeight: '700' },
  tipRow: { flexDirection: 'row', gap: 8, marginBottom: 4, alignItems: 'flex-start' },
  tipText: { fontSize: 13, flex: 1, lineHeight: 19 },

  legendBox: { borderRadius: 10, padding: 12, marginBottom: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', width: '47%' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendLabel: { fontSize: 11 },

  deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end' },
  deleteBtnText: { color: '#E53935', fontSize: 12, fontWeight: '600' },

  addMoreBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginTop: 4, paddingVertical: 14,
    borderRadius: 14, borderWidth: 1.5, borderColor: '#F48FB1',
  },
  addMoreText: { color: '#C2185B', fontWeight: '700', fontSize: 14 },

  todaySummary: {
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
    marginBottom: 12,
  },
});
