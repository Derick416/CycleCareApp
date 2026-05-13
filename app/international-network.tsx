import React from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity, Linking, View } from 'react-native';

export default function InternationalNetworkPage() {
  const open = (url: string) => Linking.openURL(url);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.intro}>
        The International Federation of Gynecology and Obstetrics (FIGO) is the world's largest alliance of national societies of obstetricians and gynecologists. Founded in 1954, FIGO represents over 130 member societies worldwide and works to advance women's health through advocacy, education, and global collaboration.
      </Text>

      <Text style={styles.sectionTitle}>Overview:</Text>
      {[
        'Headquarters: London, UK',
        'Membership: 132 national societies across more than 100 countries',
        'Focus Areas: Maternal health, gynecological cancers, family planning, safe abortion, and newborn care',
        'Publications: International Journal of Gynecology & Obstetrics (IJGO)',
        'Events: FIGO World Congress held every three years (next in Montréal, Canada, 2027)',
      ].map((item) => (
        <Text key={item} style={styles.bullet}>• {item}</Text>
      ))}

      <Text style={styles.sectionTitle}>Contact Info:</Text>
      <Text style={styles.text}>Phone: +44 (0)20 7928 1166</Text>
      <Text style={styles.text}>Email: figo@figo.org</Text>
      <Text style={styles.text}>Address: FIGO House, Suite 3, Waterloo Court, London SE1 8ST, UK</Text>
      <TouchableOpacity onPress={() => open('https://www.figo.org/')}>
        <Text style={styles.link}>🌐 Website: FIGO Official Site</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  intro: { fontSize: 15, color: '#444', marginBottom: 16, lineHeight: 22 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginTop: 12, marginBottom: 6 },
  bullet: { fontSize: 14, color: '#444', marginBottom: 4, lineHeight: 20 },
  text: { fontSize: 14, color: '#444', marginBottom: 4 },
  link: { color: '#2196F3', fontSize: 14, textDecorationLine: 'underline', marginTop: 6 },
});
