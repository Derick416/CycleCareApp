import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';

export default function PrivacySecurityPage() {
  const [biometricLock, setBiometricLock] = useState(false);
  const [showCycleOnLockscreen, setShowCycleOnLockscreen] = useState(false);
  const [anonymousDataSharing, setAnonymousDataSharing] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>Biometric Lock</Text>
          <Text style={styles.rowSub}>Require fingerprint or face ID to open app</Text>
        </View>
        <Switch
          value={biometricLock}
          onValueChange={setBiometricLock}
          trackColor={{ true: '#FF69B4' }}
          thumbColor={biometricLock ? '#fff' : '#f4f3f4'}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>Show Cycle on Lockscreen</Text>
          <Text style={styles.rowSub}>Display cycle info in notifications</Text>
        </View>
        <Switch
          value={showCycleOnLockscreen}
          onValueChange={setShowCycleOnLockscreen}
          trackColor={{ true: '#FF69B4' }}
          thumbColor={showCycleOnLockscreen ? '#fff' : '#f4f3f4'}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>Anonymous Data Sharing</Text>
          <Text style={styles.rowSub}>Help improve the app with anonymous usage data</Text>
        </View>
        <Switch
          value={anonymousDataSharing}
          onValueChange={setAnonymousDataSharing}
          trackColor={{ true: '#FF69B4' }}
          thumbColor={anonymousDataSharing ? '#fff' : '#f4f3f4'}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>Export My Data</Text>
          <Text style={styles.rowSub}>Download all your cycle data</Text>
        </View>
        <TouchableOpacity
          style={styles.exportBtn}
          onPress={() => Alert.alert('Export', 'Exporting cycle data...')}
        >
          <Text style={styles.exportBtnText}>Export</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => Alert.alert('Saved', 'Privacy & Security settings saved')}
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
  exportBtn: {
    backgroundColor: '#FF69B4',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  exportBtnText: { color: '#fff', fontWeight: 'bold' },
  saveBtn: {
    backgroundColor: '#FF69B4',
    margin: 16,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
