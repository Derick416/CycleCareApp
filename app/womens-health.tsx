import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export default function WomensHealthPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Click to open Women's Health Website</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => Linking.openURL('https://www.womenshealthmag.com/')}
      >
        <Text style={styles.buttonText}>Open Women's Health Website</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  label: { fontSize: 18, marginBottom: 20, textAlign: 'center', color: '#333' },
  button: { backgroundColor: '#FF69B4', borderRadius: 10, paddingVertical: 14, paddingHorizontal: 24 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
