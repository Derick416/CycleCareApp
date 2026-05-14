import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCycle, CycleEntry } from '../components/CycleContext';
import { useTheme } from '../components/ThemeContext';

const CYCLE_LENGTH = 28;

function normalize(date: Date): string {
  return date.toISOString().split('T')[0];
}

type DayStatus = 'Period' | 'Safe' | 'Unsafe';

function getDayStatus(index: number): DayStatus {
  if (index < 5) return 'Period';
  if (index < 9) return 'Safe';
  if (index < 18) return 'Unsafe';
  return 'Safe';
}

const STATUS_COLORS: Record<DayStatus, string> = {
  Period: '#E53935',
  Safe: '#43A047',
  Unsafe: '#FB8C00',
};

const NEXT_COLOR = '#8E24AA';

function generateMarks(start: Date) {
  const marks: Record<string, any> = {};
  for (let i = 0; i < CYCLE_LENGTH; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    const key = normalize(day);
    const status = getDayStatus(i);
    marks[key] = {
      customStyles: {
        container: { backgroundColor: STATUS_COLORS[status], borderRadius: 20 },
        text: { color: '#fff', fontWeight: 'bold' },
      },
    };
  }
  const next = new Date(start);
  next.setDate(start.getDate() + CYCLE_LENGTH);
  marks[normalize(next)] = {
    customStyles: {
      container: { backgroundColor: NEXT_COLOR, borderRadius: 20 },
      text: { color: '#fff', fontWeight: 'bold' },
    },
  };
  return { marks, nextPeriod: next };
}

export default function PeriodTrackerPage() {
  const router = useRouter();
  const { addEntry, entries } = useCycle();
  const { theme } = useTheme();
  const c = theme.colors;

  const [step, setStep] = useState<'pick' | 'preview'>('pick');
  const [periodStart, setPeriodStart] = useState<Date | null>(null);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [nextPeriod, setNextPeriod] = useState<Date | null>(null);

  const handleDayPress = (day: DateData) => {
    const date = new Date(day.dateString);
    const { marks, nextPeriod: np } = generateMarks(date);
    setPeriodStart(date);
    setMarkedDates(marks);
    setNextPeriod(np);
    setStep('preview');
  };

  const handleSave = () => {
    if (!periodStart || !nextPeriod) return;
    const entry: CycleEntry = {
      id: Date.now().toString(),
      periodStart: normalize(periodStart),
      nextPeriod: normalize(nextPeriod),
      savedAt: new Date().toISOString(),
      markedDates,
    };
    addEntry(entry);
    Alert.alert('Saved ✓', 'Your cycle has been saved. You can view it in Status Check.', [
      { text: 'View Status', onPress: () => router.replace('/(tabs)/status-check') },
      { text: 'Stay here', style: 'cancel' },
    ]);
  };

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const legend = [
    { label: 'Period (days 1–5)', color: '#E53935' },
    { label: 'Safe days', color: '#43A047' },
    { label: 'Unsafe / Fertile', color: '#FB8C00' },
    { label: 'Next Period', color: '#8E24AA' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={{ paddingBottom: 40 }}>

      {/* STEP INDICATOR */}
      <View style={styles.stepRow}>
        <View style={[styles.step, step === 'pick' && styles.stepActive]}>
          <Text style={[styles.stepNum, step === 'pick' && styles.stepNumActive]}>1</Text>
          <Text style={[styles.stepLabel, { color: step === 'pick' ? '#C2185B' : c.textSecondary }]}>
            Select Date
          </Text>
        </View>
        <View style={[styles.stepLine, { backgroundColor: c.border }]} />
        <View style={[styles.step, step === 'preview' && styles.stepActive]}>
          <Text style={[styles.stepNum, step === 'preview' && styles.stepNumActive]}>2</Text>
          <Text style={[styles.stepLabel, { color: step === 'preview' ? '#C2185B' : c.textSecondary }]}>
            Review & Save
          </Text>
        </View>
      </View>

      {step === 'pick' && (
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={[styles.instruction, { color: c.text }]}>
            Tap the day your last period started:
          </Text>
          <Calendar
            onDayPress={handleDayPress}
            style={[styles.calendar, { backgroundColor: c.surface }]}
            theme={{
              backgroundColor: c.surface,
              calendarBackground: c.surface,
              todayTextColor: '#C2185B',
              arrowColor: '#C2185B',
              selectedDayBackgroundColor: '#C2185B',
              textDayFontWeight: '500',
              dayTextColor: c.text,
              monthTextColor: c.text,
            }}
          />
        </View>
      )}

      {step === 'preview' && periodStart && nextPeriod && (
        <View style={{ paddingHorizontal: 16 }}>
          {/* Summary chips */}
          <View style={styles.summaryRow}>
            <View style={[styles.summaryChip, { backgroundColor: '#FCE4EC' }]}>
              <MaterialIcons name="calendar-today" size={16} color="#C2185B" />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.chipLabel}>Period Started</Text>
                <Text style={styles.chipValue}>{fmt(periodStart)}</Text>
              </View>
            </View>
            <View style={[styles.summaryChip, { backgroundColor: '#F3E5F5' }]}>
              <MaterialIcons name="event" size={16} color="#8E24AA" />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.chipLabel}>Next Period</Text>
                <Text style={[styles.chipValue, { color: '#8E24AA' }]}>{fmt(nextPeriod)}</Text>
              </View>
            </View>
          </View>

          <Calendar
            markedDates={markedDates}
            markingType="custom"
            style={[styles.calendar, { backgroundColor: c.surface }]}
            theme={{
              backgroundColor: c.surface,
              calendarBackground: c.surface,
              todayTextColor: '#C2185B',
              arrowColor: '#C2185B',
              dayTextColor: c.text,
              monthTextColor: c.text,
            }}
          />

          {/* Legend */}
          <View style={[styles.legendBox, { backgroundColor: c.surface }]}>
            <Text style={[styles.legendTitle, { color: c.text }]}>Cycle Key</Text>
            <View style={styles.legendGrid}>
              {legend.map((item) => (
                <View key={item.label} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <Text style={[styles.legendLabel, { color: c.textSecondary }]}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Past saves count */}
          {entries.length > 0 && (
            <Text style={[styles.savedInfo, { color: c.textSecondary }]}>
              You have {entries.length} saved cycle{entries.length > 1 ? 's' : ''} on record.
            </Text>
          )}

          {/* Actions */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <MaterialIcons name="save" size={20} color="#fff" />
            <Text style={styles.saveBtnText}>Save This Cycle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.resetBtn, { borderColor: c.border }]}
            onPress={() => { setStep('pick'); setPeriodStart(null); }}
          >
            <MaterialIcons name="refresh" size={18} color="#C2185B" />
            <Text style={styles.resetBtnText}>Change Date</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stepRow: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 8 },
  step: { alignItems: 'center', flex: 1 },
  stepActive: {},
  stepNum: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#eee', textAlign: 'center',
    lineHeight: 28, fontWeight: '700', fontSize: 13, color: '#999',
    overflow: 'hidden',
  },
  stepNumActive: { backgroundColor: '#C2185B', color: '#fff' },
  stepLabel: { fontSize: 11, marginTop: 4, fontWeight: '600' },
  stepLine: { flex: 0.5, height: 2, borderRadius: 1, marginBottom: 16 },

  instruction: { fontSize: 15, fontWeight: '600', marginBottom: 12, marginTop: 4 },
  calendar: { borderRadius: 16, overflow: 'hidden', elevation: 2 },

  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 14, marginTop: 8 },
  summaryChip: {
    flex: 1, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center',
  },
  chipLabel: { fontSize: 10, color: '#888', fontWeight: '600' },
  chipValue: { fontSize: 12, fontWeight: '700', color: '#C2185B', marginTop: 1 },

  legendBox: { borderRadius: 14, padding: 16, marginTop: 14, elevation: 1 },
  legendTitle: { fontWeight: '700', fontSize: 14, marginBottom: 10 },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', width: '47%' },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  legendLabel: { fontSize: 12 },

  savedInfo: { textAlign: 'center', fontSize: 12, marginTop: 12, fontStyle: 'italic' },

  saveBtn: {
    backgroundColor: '#C2185B',
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    elevation: 4,
    shadowColor: '#C2185B',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  resetBtn: {
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    borderWidth: 1.5,
  },
  resetBtnText: { color: '#C2185B', fontWeight: '700', fontSize: 14 },
});
