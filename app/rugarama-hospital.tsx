import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RugaramaHospitalPage() {
  const open = (url: string) => Linking.openURL(url);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.intro}>
        Rugarama Hospital in Kabale offers comprehensive gynecological services and has a specialist gynecologist available for consultations.
      </Text>

      <Text style={styles.sectionTitle}>Key Services & Details:</Text>
      {[
        'Gynecological Care: Services related to women\'s health, including treatment of gynecological cancers (cervical, ovarian, uterine).',
        'Maternity and Antenatal: Dedicated Maternity and Antenatal/Family Planning department.',
        'Availability: Services are available for appointments, with 24/7 support mentioned in their pricing/services information.',
      ].map((item) => (
        <Text key={item} style={styles.bullet}>• {item}</Text>
      ))}

      <View style={styles.contactCard}>
        <Text style={styles.contactHeading}>Contact Information</Text>
        <TouchableOpacity onPress={() => open('tel:+256778717619')}>
          <Text style={styles.link}>📞 Phone: +256 778 717619</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => open('tel:+256772727772')}>
          <Text style={styles.link}>📞 Alternative: +256 772 727772</Text>
        </TouchableOpacity>
        <Text style={styles.text}>📍 Address: Kibikura cell, Kabale, Uganda</Text>
        <Text style={styles.note}>
          It is recommended to call ahead to confirm the specific schedule of the gynecologist.
        </Text>
        <TouchableOpacity onPress={() => open('https://rugaramahospital.org/')}>
          <Text style={styles.link}>🌐 Website: Rugarama Hospital</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  intro: { fontSize: 15, color: '#444', marginBottom: 16, lineHeight: 22 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginTop: 12, marginBottom: 6 },
  bullet: { fontSize: 14, color: '#444', marginBottom: 6, lineHeight: 20 },
  contactCard: {
    backgroundColor: '#fff5f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3dbe6',
    padding: 12,
    marginTop: 8,
  },
  contactHeading: { fontSize: 15, fontWeight: '600', color: '#C2185B', marginBottom: 6 },
  text: { fontSize: 14, color: '#444', marginBottom: 6 },
  note: { fontSize: 13, fontStyle: 'italic', color: '#888', marginBottom: 6 },
  link: { color: '#2196F3', fontSize: 14, textDecorationLine: 'none', marginBottom: 6 },
});
