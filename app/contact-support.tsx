import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export default function ContactSupportPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email us at:</Text>
      <TouchableOpacity onPress={() => Linking.openURL('mailto:derickiraguha96@gmail.com')}>
        <Text style={styles.email}>derickiraguha96@gmail.com</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  label: { fontSize: 18, color: '#333', marginBottom: 8 },
  email: { fontSize: 16, color: '#2196F3', textDecorationLine: 'underline' },
});
