import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const faqs = [
  {
    q: 'How do I log my period?',
    a: "Go to the Status page, tap 'Enter Period Start Date', and select your start date.",
  },
  {
    q: 'Can I edit past cycle entries?',
    a: 'Currently, you can only set a new start date. Editing past entries is not supported. You can set new entries at the start date of the new period.',
  },
  {
    q: 'How do reminders work?',
    a: 'Enable notifications in Settings → Notifications to get alerts before your period or fertile window.',
  },
];

export default function FaqPage() {
  return (
    <ScrollView style={styles.container}>
      {faqs.map((item) => (
        <View key={item.q} style={styles.item}>
          <Text style={styles.question}>{item.q}</Text>
          <Text style={styles.answer}>{item.a}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  item: { marginBottom: 20 },
  question: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: '#222' },
  answer: { fontSize: 14, color: '#555', lineHeight: 20 },
});
