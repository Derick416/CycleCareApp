import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { useEffect, useState } from 'react';
import { Alert, Linking, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../components/ThemeContext';

const STORAGE_DIR = `${FileSystem.documentDirectory}MHMInfo/`;
const DOWNLOADS_DIR = `${FileSystem.documentDirectory}Downloads/`;

const pdfItems = [
  {
  title: 'Menstrual Hygiene',
  description: 'Educational booklet on menstrual hygiene practices.',
  asset: 'https://www.pszim.com/wp-content/uploads/sites/34/2024/07/menstrual-hygiene-booklet-amend-7-12-22.pdf',
  fileName: 'menstrual-hygiene.pdf',
},
  {
  title: 'Guide to menstrual hygiene',
  description: 'UNICEF guidance on menstrual hygiene materials (2019).',
  asset: 'https://www.unicef.org/media/91346/file/unicef-guide-menstrual-hygiene-materials-2019.pdf',
  fileName: 'menstrual-hygiene-guide.pdf',
},
];

export default function MhmInfoPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [progressVisible, setProgressVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        // Create directories if they don't exist
        await FileSystem.makeDirectoryAsync(STORAGE_DIR, { intermediates: true });
        await FileSystem.makeDirectoryAsync(DOWNLOADS_DIR, { intermediates: true });
        
        // Check which PDFs have been downloaded
        const state: Record<string, boolean> = {};
        for (const item of pdfItems) {
          // Check if file exists in Downloads folder
          const downloadInfo = await FileSystem.getInfoAsync(getDownloadUri(item.fileName));
          if (downloadInfo.exists) {
            state[item.fileName] = true;
          } else {
            // Fallback check in local storage
            const storageInfo = await FileSystem.getInfoAsync(`${STORAGE_DIR}${item.fileName}`);
            state[item.fileName] = storageInfo.exists;
          }
        }
        setDownloaded(state);
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    init();
  }, []);

  const getStoredUri = (fileName: string) => `${STORAGE_DIR}${fileName}`;
  const getDownloadUri = (fileName: string) => `${DOWNLOADS_DIR}${fileName}`;

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

  const downloadPdfToDevice = async (item: (typeof pdfItems)[number]) => {
    setLoading((prev) => ({ ...prev, [item.fileName]: true }));
    setProgress(0);
    setProgressVisible(true);
    try {
      const asset = Asset.fromModule(item.asset);
      // step 1: ensure asset is downloaded
      await asset.downloadAsync();
      setProgress(20);

      const sourceUri = asset.localUri || asset.uri;
      if (!sourceUri) throw new Error('Unable to load PDF asset');

      if (Platform.OS === 'android' && FileSystem.StorageAccessFramework) {
        // Ask user to pick a directory (they can choose Downloads)
        const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permission required', 'Please select a folder to save the file.');
          return;
        }
        const directoryUri = permission.directoryUri;
        setProgress(40);

        // create file in selected directory
        const safUri = await FileSystem.StorageAccessFramework.createFileAsync(directoryUri, item.fileName, 'application/pdf');
        setProgress(60);

        // read asset as base64 and write via SAF
        const base64 = await FileSystem.readAsStringAsync(sourceUri, { encoding: FileSystem.EncodingType.Base64 });
        setProgress(80);

        await FileSystem.writeAsStringAsync(safUri, base64, { encoding: FileSystem.EncodingType.Base64 });
        setProgress(100);

        setDownloaded((prev) => ({ ...prev, [item.fileName]: true }));
        Alert.alert('Download Complete', `${item.title} has been saved to the folder you selected.`, [
          { text: 'Open File', onPress: () => openPdf(item) },
          { text: 'Done', style: 'cancel' },
        ]);
        return safUri;
      }

      // Fallback for other platforms: copy to app Downloads directory
      try {
        await FileSystem.makeDirectoryAsync(DOWNLOADS_DIR, { intermediates: true });
      } catch {}
      const downloadUri = getDownloadUri(item.fileName);
      const existing = await FileSystem.getInfoAsync(downloadUri);
      if (existing.exists) await FileSystem.deleteAsync(downloadUri);

      // read and write (using base64 to keep behavior consistent)
      const base64 = await FileSystem.readAsStringAsync(sourceUri, { encoding: FileSystem.EncodingType.Base64 });
      setProgress(70);
      await FileSystem.writeAsStringAsync(downloadUri, base64, { encoding: FileSystem.EncodingType.Base64 });
      setProgress(100);

      setDownloaded((prev) => ({ ...prev, [item.fileName]: true }));
      Alert.alert('Download Complete', `${item.title} has been saved to your device.`);
      return downloadUri;
    } catch (error) {
      console.error('Download error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Download Failed', `Error: ${errorMsg}`);
    } finally {
      setLoading((prev) => ({ ...prev, [item.fileName]: false }));
      setTimeout(() => {
        setProgressVisible(false);
        setProgress(0);
      }, 700);
    }
  };

  const openPdf = async (item: (typeof pdfItems)[number]) => {
    try {
      const storedUri = getStoredUri(item.fileName);
      const info = await FileSystem.getInfoAsync(storedUri);
      const uri = info.exists ? storedUri : await storePdfLocally(item);

      if (Platform.OS === 'android') {
        const contentUri = await FileSystem.getContentUriAsync(uri);
        await Linking.openURL(contentUri);
      } else {
        await Linking.openURL(uri);
      }
    } catch {
      // handled by storePdfLocally alert
    }
  };

  return (
    <>
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
              {isDownloaded && <Text style={[styles.downloadLabel, { color: colors.textSecondary }]}>Downloaded to Downloads folder</Text>}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.pdfButton, { backgroundColor: '#F48FB1', flex: 1 }]}
                onPress={() => downloadPdfToDevice(item)}
                activeOpacity={0.82}
                disabled={isLoading}
              >
                <Text style={styles.pdfButtonText}>{isLoading ? 'Downloading...' : 'Download'}</Text>
              </TouchableOpacity>
              {isDownloaded && (
                <TouchableOpacity
                  style={[styles.pdfButton, { backgroundColor: '#9575CD', marginLeft: 10, flex: 1 }]}
                  onPress={() => openPdf(item)}
                  activeOpacity={0.82}
                  disabled={isLoading}
                >
                  <Text style={styles.pdfButtonText}>Open</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}

      <Text style={[styles.footerText, { color: colors.textSecondary }]}>Downloaded files are stored locally for offline access.</Text>
    </ScrollView>

    {progressVisible && (
      <Modal transparent animationType="fade" visible={progressVisible}>
        <View style={styles.progressOverlay}>
          <View style={styles.progressBox}>
            <Text style={styles.progressTitle}>Downloading</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        </View>
      </Modal>
    )}
  </>
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
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  progressOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBox: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  progressBarBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F48FB1',
  },
  progressText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
  },
});
