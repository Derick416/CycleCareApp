import { useEffect, useState } from 'react';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { Linking, Platform, View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../components/ThemeContext';

const STORAGE_DIR = `${FileSystem.documentDirectory}MHMInfo/`;

const pdfItems = [
  {
    title: 'MHM Basics',
    description: 'What to expect during your period and how your body changes.',
    asset: require('../assets/pdfs/mhm-basics.pdf'),
    fileName: 'mhm-basics.pdf',
  },
  {
    title: 'Self-Care Guide',
    description: 'Simple care tips for hydration, rest, comfort, and mood support.',
    asset: require('../assets/pdfs/self-care-guide.pdf'),
    fileName: 'self-care-guide.pdf',
  },
];

export default function MhmInfoPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const init = async () => {
      try {
        await FileSystem.makeDirectoryAsync(STORAGE_DIR, { intermediates: true });
        const state: Record<string, boolean> = {};
        for (const item of pdfItems) {
          const info = await FileSystem.getInfoAsync(`${STORAGE_DIR}${item.fileName}`);
          state[item.fileName] = info.exists;
        }
        setDownloaded(state);
      } catch {
        // ignore initialization errors
      }
    };

    init();
  }, []);

  const getStoredUri = (fileName: string) => `${STORAGE_DIR}${fileName}`;

  const storePdfLocally = async (item: (typeof pdfItems)[number]) => {
    setLoading((prev) => ({ ...prev, [item.fileName]: true }));
    try {
      const asset = Asset.fromModule(item.asset);
      await asset.downloadAsync();
      const sourceUri = asset.localUri || asset.uri;
      if (!sourceUri) throw new Error('Unable to load PDF asset');

      const targetUri = getStoredUri(item.fileName);
      const fileInfo = await FileSystem.getInfoAsync(targetUri);
      if (!fileInfo.exists) {
        await FileSystem.copyAsync({ from: sourceUri, to: targetUri });
      }

      setDownloaded((prev) => ({ ...prev, [item.fileName]: true }));
      return targetUri;
    } catch (error) {
      Alert.alert('Download failed', 'Unable to save the PDF to your device.');
      throw error;
    } finally {
      setLoading((prev) => ({ ...prev, [item.fileName]: false }));
    }
  };

  const openPdf = async (item: (typeof pdfItems)[number]) => {
    try {
      const storedUri = getStoredUri(item.fileName);
      const info = await FileSystem.getInfoAsync(storedUri);
      const uri = info.exists ? storedUri : await storePdfLocally(item);

      if (Platform.OS === 'android') {
        const contentUri = await FileSystem.getContentUriAsync(uri);
        await Linking.openURL(contentUri.uri);
      } else {
        await Linking.openURL(uri);
      }
    } catch {
      // handled by storePdfLocally alert
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.heading, { color: colors.text }]}>MHM Info</Text>
      <Text style={[styles.subheading, { color: colors.textSecondary }]}>Menstrual health guidance for what to expect during your period and how to care for yourself.</Text>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <Text style={[styles.cardTitle, { color: colors.text }]}>What to expect during your period</Text>
        <Text style={[styles.cardText, { color: colors.textSecondary }]}>Your cycle may include cramps, bloating, mood changes, fatigue, and variable flow. Track your symptoms so you can learn your body’s normal rhythm and plan comfort measures in advance.</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <Text style={[styles.cardTitle, { color: colors.text }]}>How to care for yourself</Text>
        <Text style={[styles.cardText, { color: colors.textSecondary }]}>Drink plenty of water, eat iron-rich foods, rest when needed, use heat for cramps, and choose period products that feel comfortable for you. Gentle movement can also help ease discomfort.</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <Text style={[styles.cardTitle, { color: colors.text }]}>When to seek help</Text>
        <Text style={[styles.cardText, { color: colors.textSecondary }]}>If pain is severe, bleeding is unusually heavy, or your cycle changes suddenly, talk to a healthcare provider. A checkup can help rule out any concerns.</Text>
      </View>

      <Text style={[styles.sectionLabel, { color: colors.text }]}>Download PDFs for offline use</Text>
      {pdfItems.map((item) => {
        const isDownloaded = downloaded[item.fileName];
        const isLoading = loading[item.fileName];

        return (
          <View key={item.fileName} style={[styles.pdfItem, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
            <View style={styles.pdfInfo}>
              <Text style={[styles.pdfTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.pdfDescription, { color: colors.textSecondary }]}>{item.description}</Text>
              {isDownloaded && <Text style={[styles.downloadLabel, { color: colors.textSecondary }]}>Saved locally</Text>}
            </View>
            <TouchableOpacity
              style={[styles.pdfButton, { backgroundColor: '#F48FB1' }]}
              onPress={() => openPdf(item)}
              activeOpacity={0.82}
              disabled={isLoading}
            >
              <Text style={styles.pdfButtonText}>{isLoading ? 'Loading...' : isDownloaded ? 'Open' : 'Download'}</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <Text style={[styles.footerText, { color: colors.textSecondary }]}>Downloaded files are stored locally for offline access.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  card: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionLabel: {
    marginTop: 10,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '700',
  },
  pdfItem: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  pdfInfo: {
    marginBottom: 12,
  },
  pdfTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  pdfDescription: {
    fontSize: 13,
    lineHeight: 20,
  },
  downloadLabel: {
    marginTop: 8,
    fontSize: 12,
  },
  pdfButton: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  pdfButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 18,
    opacity: 0.85,
  },
});
