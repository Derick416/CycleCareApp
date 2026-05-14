import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, StatusBar, Share, Alert,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUsername } from '../../components/UsernameContext';
import { useTheme } from '../../components/ThemeContext';
import { useCycle } from '../../components/CycleContext';

const TODAY = new Date().toISOString().split('T')[0];

function getTodayStatus(markedDates: Record<string, any>): string | null {
  const entry = markedDates[TODAY];
  if (!entry?.customStyles?.container?.backgroundColor) return null;
  const bg = entry.customStyles.container.backgroundColor;
  if (bg === '#E53935') return 'Period';
  if (bg === '#43A047') return 'Safe';
  if (bg === '#FB8C00') return 'Unsafe';
  if (bg === '#8E24AA') return 'Next Period';
  return null;
}

export default function HomePage() {
  const router = useRouter();
  const { username } = useUsername();
  const { theme } = useTheme();
  const { latestEntry } = useCycle();
  const c = theme.colors;

  const todayStatus = latestEntry ? getTodayStatus(latestEntry.markedDates) : null;

  const statusBadge = todayStatus
    ? {
        Period:       { bg: '#FFEBEE', text: '#C62828', icon: 'water-drop' as const,   msg: 'Your period is active today. Rest & stay hydrated.' },
        Safe:         { bg: '#E8F5E9', text: '#2E7D32', icon: 'check-circle' as const, msg: 'Safe day. Low chance of pregnancy.' },
        Unsafe:       { bg: '#FFF3E0', text: '#E65100', icon: 'warning' as const,       msg: 'Unsafe day. Fertile window — take care.' },
        'Next Period':{ bg: '#F3E5F5', text: '#6A1B9A', icon: 'event' as const,         msg: 'Your next period is expected soon.' },
      }[todayStatus]
    : null;

  const handleInvite = async () => {
    try {
      await Share.share({
        message:
          '🌸 Hey! I\'m using CycleCare to track my menstrual health. It\'s really helpful — you should try it too! Download it now.',
        title: 'Invite to CycleCare',
      });
    } catch (e) {
      Alert.alert('Could not share', 'Please try again.');
    }
  };

  const quickCards = [
    {
      icon: 'calendar-today' as const,
      iconBg: '#FCE4EC',
      iconColor: '#C2185B',
      title: 'Period Tracker',
      desc: 'Log your start date and map your full cycle. Save to review anytime.',
      route: '/period-tracker',
      badge: null,
      isMatComm: false,
    },
    {
      icon: 'favorite' as const,
      iconBg: '#F3E5F5',
      iconColor: '#8E24AA',
      title: 'Check Status',
      desc: 'View your menstrual calendar and see exactly where you are today.',
      route: '/(tabs)/status-check',
      badge: latestEntry ? 'Saved' : null,
      isMatComm: false,
    },
    {
      icon: 'local-hospital' as const,
      iconBg: '#E3F2FD',
      iconColor: '#1565C0',
      title: 'Healthcare',
      desc: 'Find gynecologists, hospitals, and trusted women\'s health resources.',
      route: '/(tabs)/healthcare',
      badge: null,
      isMatComm: false,
    },
    {
      icon: 'groups' as const,
      iconBg: '#E8F5E9',
      iconColor: '#2E7D32',
      title: 'Community Forum',
      desc: 'Connect with women, share experiences, and support each other.',
      route: '/community-forum',
      badge: 'Coming Soon',
      isMatComm: false,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <StatusBar barStyle="light-content" backgroundColor="#880E4F" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.appName}>CycleCare</Text>
            <Text style={styles.appTagline}>Your menstrual health companion</Text>
          </View>
        </View>
        <MaterialIcons name="notifications-none" size={27} color="#fff" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 36 }}>

        {/* ── WELCOME BANNER ── */}
        <View style={[styles.welcomeBanner, {
          backgroundColor: c.surface,
          shadowColor: theme.dark ? '#000' : '#C2185B',
        }]}>
          <View style={styles.welcomeLeft}>
            <Text style={[styles.welcomeHi, { color: c.textSecondary }]}>Good day,</Text>
            <Text style={[styles.welcomeName, { color: c.text }]}>
              {username || 'Beautiful 🌸'}
            </Text>
            <Text style={[styles.welcomeSub, { color: c.textSecondary }]}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>
          <MaterialCommunityIcons name="flower-tulip" size={58} color="#F48FB1" />
        </View>

        {/* ── TODAY STATUS STRIP ── */}
        {statusBadge ? (
          <View style={[styles.statusStrip, { backgroundColor: statusBadge.bg }]}>
            <MaterialIcons name={statusBadge.icon} size={22} color={statusBadge.text} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.statusStripTitle, { color: statusBadge.text }]}>
                Today: {todayStatus}
              </Text>
              <Text style={[styles.statusStripMsg, { color: statusBadge.text }]}>
                {statusBadge.msg}
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.statusStrip, { backgroundColor: '#FCE4EC' }]}
            onPress={() => router.push('/period-tracker')}
          >
            <MaterialIcons name="touch-app" size={22} color="#C2185B" />
            <Text style={[styles.statusStripTitle, { color: '#C2185B', marginLeft: 10, flex: 1 }]}>
              Tap here to start tracking your cycle →
            </Text>
          </TouchableOpacity>
        )}

        {/* ── SECTION LABEL ── */}
        <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>QUICK ACCESS</Text>

        {/* ── QUICK CARDS ── */}
        {quickCards.map((card) => (
          <TouchableOpacity
            key={card.title}
            style={[styles.quickCard, {
              backgroundColor: c.surface,
              shadowColor: '#fff',
              shadowOpacity: 0.9,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 4 },
              elevation: 5,
              borderColor: theme.dark ? c.border : '#F8BBD0',
              borderWidth: 1,
            }]}
            onPress={() => router.push(card.route as any)}
            activeOpacity={0.82}
          >
            {/* Icon box */}
            <View style={[styles.quickIconBox, { backgroundColor: card.iconBg }]}>
              <MaterialIcons name={card.icon} size={30} color={card.iconColor} />
            </View>

            <View style={styles.quickCardText}>
              <View style={styles.quickCardRow}>
                <Text style={[styles.quickCardTitle, { color: c.text }]}>{card.title}</Text>
                {card.badge && (
                  <View style={[
                    styles.badge,
                    { backgroundColor: card.badge === 'Coming Soon' ? '#E8F5E9' : '#FCE4EC' },
                  ]}>
                    <Text style={[
                      styles.badgeText,
                      { color: card.badge === 'Coming Soon' ? '#2E7D32' : '#C2185B' },
                    ]}>{card.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.quickCardDesc, { color: c.textSecondary }]}>{card.desc}</Text>
            </View>

            <MaterialIcons name="chevron-right" size={24} color="#C2185B" />
          </TouchableOpacity>
        ))}

        {/* ── INVITE FRIENDS CARD ── */}
        <TouchableOpacity
          style={[styles.inviteCard, {
            backgroundColor: c.surface,
            shadowColor: '#fff',
            shadowOpacity: 0.9,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 4 },
            elevation: 5,
            borderColor: theme.dark ? c.border : '#F8BBD0',
            borderWidth: 1,
          }]}
          onPress={handleInvite}
          activeOpacity={0.82}
        >
          <View style={[styles.quickIconBox, { backgroundColor: '#FFF8E1' }]}>
            <MaterialIcons name="person-add" size={30} color="#F57F17" />
          </View>
          <View style={styles.quickCardText}>
            <Text style={[styles.quickCardTitle, { color: c.text }]}>Invite Friends</Text>
            <Text style={[styles.quickCardDesc, { color: c.textSecondary }]}>
              Share CycleCare with friends and family who need it.
            </Text>
          </View>
          <MaterialIcons name="share" size={22} color="#F57F17" />
        </TouchableOpacity>

        {/* ── NEXT PERIOD CHIP ── */}
        {latestEntry && (
          <View style={[styles.nextPeriodChip, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
            <MaterialIcons name="event" size={18} color="#C2185B" />
            <Text style={[styles.nextPeriodText, { color: c.text }]}>
              Next period expected:{' '}
              <Text style={{ fontWeight: 'bold', color: '#C2185B' }}>
                {new Date(latestEntry.nextPeriod).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </Text>
            </Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#880E4F',
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: {
    width: 46, height: 46, borderRadius: 23,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  appName: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  appTagline: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 1 },

  welcomeBanner: {
    marginHorizontal: 16, marginTop: 16,
    borderRadius: 20, padding: 22,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    shadowOpacity: 0.08, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  welcomeLeft: { flex: 1 },
  welcomeHi: { fontSize: 13, fontWeight: '500' },
  welcomeName: { fontSize: 24, fontWeight: '800', marginTop: 2, letterSpacing: 0.3 },
  welcomeSub: { fontSize: 12, marginTop: 4 },

  statusStrip: {
    marginHorizontal: 16, marginTop: 12,
    borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center',
  },
  statusStripTitle: { fontSize: 14, fontWeight: '700' },
  statusStripMsg: { fontSize: 12, marginTop: 2 },

  sectionLabel: {
    marginHorizontal: 20, marginTop: 22, marginBottom: 10,
    fontSize: 11, fontWeight: '700', letterSpacing: 1.2,
  },

  quickCard: {
    marginHorizontal: 16, marginBottom: 12,
    borderRadius: 18, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  quickIconBox: {
    width: 58, height: 58, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  quickCardText: { flex: 1 },
  quickCardRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  quickCardTitle: { fontSize: 16, fontWeight: '700' },
  quickCardDesc: { fontSize: 12, marginTop: 4, lineHeight: 17 },
  badge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontWeight: '700' },

  inviteCard: {
    marginHorizontal: 16, marginBottom: 12,
    borderRadius: 18, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },

  nextPeriodChip: {
    marginHorizontal: 16, marginTop: 4,
    borderRadius: 12, padding: 14,
    flexDirection: 'row', alignItems: 'center',
    gap: 8, borderWidth: 1,
  },
  nextPeriodText: { fontSize: 13, flex: 1 },
});
