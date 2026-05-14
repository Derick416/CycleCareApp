import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useTheme } from '../components/ThemeContext';

// Handle notifications while app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NotificationsPage() {
  const { theme } = useTheme();
  const c = theme.colors;

  const [permGranted, setPermGranted] = useState(false);
  const [periodReminder, setPeriodReminder] = useState(true);
  const [fertileAlert, setFertileAlert] = useState(true);
  const [ovulationReminder, setOvulationReminder] = useState(false);
  const [dailyLog, setDailyLog] = useState(false);
  const [daysBefore, setDaysBefore] = useState(2);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermGranted(status === 'granted');
  };

  const requestPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setPermGranted(status === 'granted');
    if (status !== 'granted') {
      Alert.alert(
        'Permission Needed',
        'Please enable notifications in your device Settings to receive reminders.',
      );
    }
    return status === 'granted';
  };

  const sendTestNotification = async () => {
    const granted = permGranted || (await requestPermission());
    if (!granted) return;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌸 CycleCare',
        body: 'This is a test reminder from CycleCare!',
        sound: true,
      },
      trigger: { seconds: 3 },
    });
    Alert.alert('Test Sent ✓', 'You will receive a notification in 3 seconds.');
  };

  const handleSave = async () => {
    const granted = permGranted || (await requestPermission());
    if (!granted) return;

    // Cancel all existing local notifications before rescheduling
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (dailyLog) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '📝 Daily Log Reminder',
          body: "Don't forget to log your symptoms today!",
          sound: true,
        },
        trigger: {
          hour: 20,
          minute: 0,
          repeats: true,
        },
      });
    }

    if (periodReminder) {
      // Schedule a sample reminder (in a real app this would use the saved cycle date)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌸 Period Coming Soon',
          body: `Your period may start in about ${daysBefore} day(s). Prepare your supplies!`,
          sound: true,
        },
        trigger: { seconds: 5 }, // placeholder — real app uses cycle date
      });
    }

    Alert.alert('Settings Saved ✓', 'Your notification preferences have been saved.');
  };

  const toggleItems = [
    {
      label: 'Period Start Reminder',
      sub: `Alert ${daysBefore} day(s) before your period`,
      val: periodReminder,
      set: setPeriodReminder,
      icon: 'water-drop' as const,
      color: '#C2185B',
    },
    {
      label: 'Fertile Window Alert',
      sub: 'Get notified during your fertile days',
      val: fertileAlert,
      set: setFertileAlert,
      icon: 'favorite' as const,
      color: '#8E24AA',
    },
    {
      label: 'Ovulation Day Reminder',
      sub: 'Notification on your ovulation day',
      val: ovulationReminder,
      set: setOvulationReminder,
      icon: 'brightness-5' as const,
      color: '#F57F17',
    },
    {
      label: 'Daily Log Reminder',
      sub: 'Evening reminder at 8 PM to log symptoms',
      val: dailyLog,
      set: setDailyLog,
      icon: 'edit-note' as const,
      color: '#1565C0',
    },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Permission banner */}
      {!permGranted ? (
        <TouchableOpacity style={styles.permBanner} onPress={requestPermission}>
          <MaterialIcons name="notifications-off" size={20} color="#E65100" />
          <Text style={styles.permText}>
            Notifications are off. Tap to enable.
          </Text>
          <MaterialIcons name="chevron-right" size={18} color="#E65100" />
        </TouchableOpacity>
      ) : (
        <View style={[styles.permGrantedRow, { backgroundColor: '#E8F5E9' }]}>
          <MaterialIcons name="check-circle" size={18} color="#2E7D32" />
          <Text style={styles.permGrantedText}>Device notifications enabled</Text>
        </View>
      )}

      {/* Days before period selector */}
      <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>DAYS BEFORE PERIOD</Text>
      <View style={[styles.card, { backgroundColor: c.surface }]}>
        <Text style={[styles.daysTitle, { color: c.text }]}>
          Remind me {daysBefore} day{daysBefore > 1 ? 's' : ''} before
        </Text>
        <View style={styles.daysRow}>
          {[1, 2, 3].map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.dayChip,
                {
                  backgroundColor: daysBefore === d ? '#C2185B' : c.surfaceAlt,
                  borderColor: daysBefore === d ? '#C2185B' : c.border,
                },
              ]}
              onPress={() => setDaysBefore(d)}
            >
              <Text style={[styles.dayChipText, { color: daysBefore === d ? '#fff' : c.text }]}>
                {d} day{d > 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Toggle reminders */}
      <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>REMINDERS</Text>
      <View style={[styles.card, { backgroundColor: c.surface }]}>
        {toggleItems.map((item, i) => (
          <View
            key={item.label}
            style={[
              styles.row,
              i < toggleItems.length - 1 && { borderBottomWidth: 1, borderColor: c.border },
            ]}
          >
            <View style={[styles.iconBox, { backgroundColor: c.surfaceAlt }]}>
              <MaterialIcons name={item.icon} size={20} color={item.color} />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowLabel, { color: c.text }]}>{item.label}</Text>
              <Text style={[styles.rowSub, { color: c.textSecondary }]}>{item.sub}</Text>
            </View>
            <Switch
              value={item.val}
              onValueChange={item.set}
              trackColor={{ false: '#ddd', true: '#C2185B' }}
              thumbColor={item.val ? '#fff' : '#f4f3f4'}
            />
          </View>
        ))}
      </View>

      {/* Test notification */}
      <TouchableOpacity style={[styles.testBtn, { borderColor: '#C2185B' }]} onPress={sendTestNotification}>
        <MaterialIcons name="notifications-active" size={18} color="#C2185B" />
        <Text style={styles.testBtnText}>Send Test Notification</Text>
      </TouchableOpacity>

      {/* Save */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <MaterialIcons name="save" size={18} color="#fff" />
        <Text style={styles.saveBtnText}>Save Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  permBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF3E0', margin: 16,
    borderRadius: 12, padding: 14, gap: 10,
  },
  permText: { flex: 1, color: '#E65100', fontSize: 13, fontWeight: '600' },
  permGrantedRow: {
    flexDirection: 'row', alignItems: 'center',
    margin: 16, borderRadius: 12, padding: 12, gap: 8,
  },
  permGrantedText: { color: '#2E7D32', fontSize: 13, fontWeight: '600' },

  sectionLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.2,
    marginHorizontal: 16, marginTop: 18, marginBottom: 8,
  },
  card: {
    marginHorizontal: 16, borderRadius: 16, overflow: 'hidden',
    elevation: 2, shadowColor: '#C2185B',
    shadowOpacity: 0.05, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  daysTitle: { fontSize: 14, fontWeight: '600', padding: 14, paddingBottom: 10 },
  daysRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 14, paddingBottom: 14 },
  dayChip: {
    flex: 1, borderRadius: 10, paddingVertical: 10,
    alignItems: 'center', borderWidth: 1.5,
  },
  dayChipText: { fontSize: 13, fontWeight: '700' },

  row: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  iconBox: {
    width: 38, height: 38, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 14, fontWeight: '600' },
  rowSub: { fontSize: 12, marginTop: 1 },

  testBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: 16, marginTop: 20,
    borderRadius: 14, paddingVertical: 14, borderWidth: 1.5,
  },
  testBtnText: { color: '#C2185B', fontWeight: '700', fontSize: 14 },

  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#C2185B',
    marginHorizontal: 16, marginTop: 12,
    borderRadius: 14, paddingVertical: 15,
    elevation: 4, shadowColor: '#C2185B',
    shadowOpacity: 0.3, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
