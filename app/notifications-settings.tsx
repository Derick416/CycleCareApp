import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function NotificationsPage() {
  const [periodStartReminder, setPeriodStartReminder] = useState(true);
  const [notifyDaysBefore, setNotifyDaysBefore] = useState(2);
  const [fertileWindowAlert, setFertileWindowAlert] = useState(true);
  const [ovulationDayReminder, setOvulationDayReminder] = useState(false);
  const [dailyLogReminder, setDailyLogReminder] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>Period Start Reminder</Text>
          <Text style={styles.rowSub}>Get notified before your period</Text>
        </View>
        <Switch
          value={periodStartReminder}
          onValueChange={setPeriodStartReminder}
          trackColor={{ true: '#FF69B4' }}
        />
      </View>

      {periodStartReminder && (
        <View style={styles.pickerRow}>
          <Text style={styles.pickerLabel}>Notify me:</Text>
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={notifyDaysBefore}
              onValueChange={(v) => setNotifyDaysBefore(v)}
              style={styles.picker}
            >
              <Picker.Item label="1 day before" value={1} />
              <Picker.Item label="2 days before" value={2} />
              <Picker.Item label="3 days before" value={3} />
            </Picker>
          </View>
        </View>
      )}

      {[
        { label: 'Fertile Window Alert', sub: 'Get notified during fertile days', val: fertileWindowAlert, set: setFertileWindowAlert },
        { label: 'Ovulation Day Reminder', sub: 'Get notified on your ovulation day', val: ovulationDayReminder, set: setOvulationDayReminder },
        { label: 'Daily Log Reminder', sub: 'Remind me to log my symptoms', val: dailyLogReminder, set: setDailyLogReminder },
      ].map((item) => (
        <View key={item.label} style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>{item.label}</Text>
            <Text style={styles.rowSub}>{item.sub}</Text>
          </View>
          <Switch
            value={item.val}
            onValueChange={item.set}
            trackColor={{ true: '#FF69B4' }}
          />
        </View>
      ))}

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => Alert.alert('Saved', 'Notification settings saved')}
      >
        <Text style={styles.saveBtnText}>Save Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '600' },
  rowSub: { fontSize: 13, color: '#888', marginTop: 2 },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  pickerLabel: { fontSize: 15, marginRight: 8 },
  pickerWrap: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  picker: { height: 44 },
  saveBtn: {
    backgroundColor: '#FF69B4',
    margin: 16,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
