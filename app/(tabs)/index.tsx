import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

type DayStatus = 'Period' | 'Safe' | 'Unsafe' | 'NextPeriod';

const CYCLE_LENGTH = 28;

function normalize(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDayStatus(index: number): DayStatus {
  if (index < 4) return 'Period';
  if (index < 8) return 'Safe';
  if (index < 17) return 'Unsafe';
  return 'Safe';
}

const statusColors: Record<DayStatus | 'NextPeriod', string> = {
  Period: '#F44336',
  Safe: '#4CAF50',
  Unsafe: '#FF9800',
  NextPeriod: '#9C27B0',
};

export default function StatusPage() {
  const [periodStart, setPeriodStart] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [nextPeriod, setNextPeriod] = useState<Date | null>(null);

  const generateCycle = (start: Date) => {
    const marks: Record<string, any> = {};

    for (let i = 0; i < CYCLE_LENGTH; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const key = normalize(day);
      const status = getDayStatus(i);
      marks[key] = {
        customStyles: {
          container: {
            backgroundColor: statusColors[status],
            borderRadius: 20,
          },
          text: { color: '#fff', fontWeight: 'bold' },
        },
      };
    }

    const next = new Date(start);
    next.setDate(start.getDate() + CYCLE_LENGTH);
    const nextKey = normalize(next);
    marks[nextKey] = {
      customStyles: {
        container: { backgroundColor: '#9C27B0', borderRadius: 20 },
        text: { color: '#fff', fontWeight: 'bold' },
      },
    };

    setNextPeriod(next);
    setMarkedDates(marks);
  };

  const handleDaySelect = (day: DateData) => {
    const date = new Date(day.dateString);
    setPeriodStart(date);
    generateCycle(date);
    setShowPicker(false);
  };

  const formatDate = (d: Date) =>
    `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!periodStart ? (
        <View style={styles.centered}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setShowPicker(!showPicker)}
          >
            <Text style={styles.startButtonText}>Enter Period Start Date</Text>
          </TouchableOpacity>

          {showPicker && (
            <Calendar
              onDayPress={handleDaySelect}
              style={styles.calendar}
              theme={{ todayTextColor: '#FF69B4', arrowColor: '#FF69B4' }}
            />
          )}
        </View>
      ) : (
        <View>
          <Calendar
            markedDates={markedDates}
            markingType="custom"
            style={styles.calendar}
            theme={{ todayTextColor: '#FF69B4', arrowColor: '#FF69B4' }}
          />

          {/* Legend */}
          <View style={styles.legend}>
            <Text style={styles.legendTitle}>Key:</Text>
            <View style={styles.legendRow}>
              {[
                { label: 'Period', color: '#F44336' },
                { label: 'Safe', color: '#4CAF50' },
                { label: 'Unsafe', color: '#FF9800' },
                { label: 'Next Period', color: '#9C27B0' },
              ].map((item) => (
                <View key={item.label} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {nextPeriod && (
            <Text style={styles.nextPeriod}>
              Next Expected Period: {formatDate(nextPeriod)}
            </Text>
          )}

          <TouchableOpacity
            style={[styles.startButton, { marginTop: 16 }]}
            onPress={() => {
              setPeriodStart(null);
              setMarkedDates({});
              setNextPeriod(null);
            }}
          >
            <Text style={styles.startButtonText}>Reset / Change Date</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  centered: { alignItems: 'center', marginTop: 60 },
  startButton: {
    backgroundColor: '#FF69B4',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignSelf: 'center',
  },
  startButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  calendar: { borderRadius: 12, marginBottom: 16 },
  legend: { padding: 12 },
  legendTitle: { fontWeight: 'bold', color: '#FF69B4', marginBottom: 8 },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 14, height: 14, borderRadius: 7, marginRight: 4 },
  legendLabel: { fontSize: 13 },
  nextPeriod: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF69B4',
    textAlign: 'center',
    marginTop: 12,
  },
});
