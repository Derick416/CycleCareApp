import React from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export default function KabaleHospitalPage() {
  const open = (url: string) => Linking.openURL(url);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.intro}>
        Kabale Regional Referral Hospital is a government facility offering obstetrics, gynecology, antenatal care, family planning, and cervical cancer screening.
      </Text>

      <Text style={styles.sectionTitle}>Key Services & Details:</Text>
      {[
        'Specialist Staff: The hospital has staff specializing in obstetrics and gynecology, such as Dr. Hillary Aheisibwe (Obstetrician/Gynecologist) and Dr. Godfrey Bandoga.',
        'Services Offered: Maternal and child health services, including consultations, antenatal care, labor and delivery, and gynecological wards.',
        'Emergency Care: The hospital provides comprehensive emergency obstetric care, including cesarean sections.',
        'Teaching Hospital: It is affiliated with the Kabale University School of Medicine, Department of Obstetrics & Gynaecology.',
      ].map((item) => (
        <Text key={item} style={styles.bullet}>• {item}</Text>
      ))}

      <Text style={styles.sectionTitle}>Contact Info:</Text>
      <TouchableOpacity onPress={() => open('tel:+256486422006')}>
        <Text style={styles.link}>📞 Phone: +256 486 422006</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => open('tel:+256757320146')}>
        <Text style={styles.link}>📞 Alternative: +256 757 320146</Text>
      </TouchableOpacity>
      <Text style={styles.text}>📍 Address: Corryndon Road, Kabale, Uganda</Text>
      <TouchableOpacity onPress={() => open('https://health.go.ug/hospitals/kabale-regional-referral-hospital')}>
        <Text style={styles.link}>🌐 Website: Kabale Regional Referral Hospital</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  intro: { fontSize: 15, color: '#444', marginBottom: 16, lineHeight: 22 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginTop: 12, marginBottom: 6 },
  bullet: { fontSize: 14, color: '#444', marginBottom: 6, lineHeight: 20 },
  text: { fontSize: 14, color: '#444', marginBottom: 6 },
  link: { color: '#2196F3', fontSize: 14, textDecorationLine: 'underline', marginBottom: 6 },
});
