import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../components/ThemeContext';
import { useUsername } from '../../components/UsernameContext';

export default function SettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { username } = useUsername();
  const c = theme.colors;

  const accountItems = [
    { icon: 'lock-outline' as const, label: 'Privacy & Security', sub: 'Biometric lock, data sharing & export', route: '/privacy-security' },
    { icon: 'notifications-none' as const, label: 'Notifications', sub: 'Reminders for your cycle & fertile window', route: '/notifications-settings' },
  ];

  const supportItems = [
    { icon: 'help-outline' as const, label: 'Help & Support', sub: 'FAQs, contact us, health resources', route: '/help-support' },
    { icon: 'chat-bubble-outline' as const, label: 'Community Forum', sub: 'Connect with other women', route: '/community-forum' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={{ paddingBottom: 40 }}>

      {/* PROFILE HEADER */}
      <View style={[styles.profileHeader, { backgroundColor: '#880E4F' }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{username ? username[0].toUpperCase() : '?'}</Text>
        </View>
        <View style={{ marginLeft: 14 }}>
          <Text style={styles.profileName}>{username || 'My Account'}</Text>
          <Text style={styles.profileSub}>CycleCare Member</Text>
        </View>
      </View>

      {/* APPEARANCE */}
      <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>APPEARANCE</Text>
      <View style={[styles.card, { backgroundColor: c.surface }]}>
        <View style={styles.row}>
          <View style={[styles.iconBox, { backgroundColor: theme.dark ? '#1E1E3A' : '#FCE4EC' }]}>
            <MaterialIcons name={theme.dark ? 'nights-stay' : 'wb-sunny'} size={22} color="#C2185B" />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowLabel, { color: c.text }]}>
              {theme.dark ? 'Dark Mode' : 'Light Mode'}
            </Text>
            <Text style={[styles.rowSub, { color: c.textSecondary }]}>
              {theme.dark ? 'Switch to light theme' : 'Switch to dark theme'}
            </Text>
          </View>
          <Switch
            value={theme.dark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#ddd', true: '#C2185B' }}
            thumbColor={theme.dark ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* ACCOUNT */}
      <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>ACCOUNT</Text>
      <View style={[styles.card, { backgroundColor: c.surface }]}>
        {accountItems.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.row, i < accountItems.length - 1 && { borderBottomWidth: 1, borderColor: c.border }]}
            onPress={() => router.push(item.route as any)}
          >
            <View style={[styles.iconBox, { backgroundColor: c.surfaceAlt }]}>
              <MaterialIcons name={item.icon} size={22} color="#C2185B" />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowLabel, { color: c.text }]}>{item.label}</Text>
              <Text style={[styles.rowSub, { color: c.textSecondary }]}>{item.sub}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={c.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* SUPPORT */}
      <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>SUPPORT</Text>
      <View style={[styles.card, { backgroundColor: c.surface }]}>
        {supportItems.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.row, i < supportItems.length - 1 && { borderBottomWidth: 1, borderColor: c.border }]}
            onPress={() => router.push(item.route as any)}
          >
            <View style={[styles.iconBox, { backgroundColor: c.surfaceAlt }]}>
              <MaterialIcons name={item.icon} size={22} color="#C2185B" />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowLabel, { color: c.text }]}>{item.label}</Text>
              <Text style={[styles.rowSub, { color: c.textSecondary }]}>{item.sub}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={c.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* ABOUT */}
      <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>ABOUT</Text>
      <View style={[styles.card, { backgroundColor: c.surface }]}>
        <View style={styles.row}>
          <View style={[styles.iconBox, { backgroundColor: c.surfaceAlt }]}>
            <MaterialIcons name="info-outline" size={22} color="#C2185B" />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowLabel, { color: c.text }]}>App Version</Text>
            <Text style={[styles.rowSub, { color: c.textSecondary }]}>CycleCare v1.0.0</Text>
          </View>
        </View>
        <View style={[styles.row, { borderTopWidth: 1, borderColor: c.border }]}>
          <View style={[styles.iconBox, { backgroundColor: c.surfaceAlt }]}>
            <MaterialIcons name="shield" size={22} color="#C2185B" />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowLabel, { color: c.text }]}>Privacy Policy</Text>
            <Text style={[styles.rowSub, { color: c.textSecondary }]}>Your data is private & secure</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color={c.textSecondary} />
        </View>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity
        style={[styles.logoutBtn, { backgroundColor: c.surface, borderColor: '#E53935' }]}
        onPress={() => router.push('/logout')}
      >
        <MaterialIcons name="logout" size={20} color="#E53935" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={[styles.footerNote, { color: c.textSecondary }]}>
        Made with 💗 for women's health
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: 'row', alignItems: 'center',
    padding: 24, paddingTop: 32,
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: { fontSize: 22, fontWeight: '800', color: '#fff' },
  profileName: { fontSize: 18, fontWeight: '800', color: '#fff' },
  profileSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },

  sectionLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.2,
    marginHorizontal: 16, marginTop: 20, marginBottom: 8,
  },
  card: {
    marginHorizontal: 16, borderRadius: 16,
    overflow: 'hidden', elevation: 2,
    shadowColor: '#C2185B', shadowOpacity: 0.05,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14, gap: 12,
  },
  iconBox: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 14, fontWeight: '600' },
  rowSub: { fontSize: 12, marginTop: 1 },

  logoutBtn: {
    marginHorizontal: 16, marginTop: 20,
    borderRadius: 14, borderWidth: 1.5,
    padding: 15, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  logoutText: { color: '#E53935', fontWeight: '700', fontSize: 15 },
  footerNote: { textAlign: 'center', fontSize: 12, marginTop: 20 },
});
