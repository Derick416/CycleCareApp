import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

export default function SplashPage() {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const duration = 800;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      SplashScreen.hideAsync()
        .catch(() => {
          // Ignore if splash screen was already hidden.
        })
        .finally(() => {
          router.replace('/login');
        });
    });
  }, [router, opacity, scale]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      <Text style={styles.title}>{"WOMEN'S HEALTH"}</Text>
      <Text style={styles.subtitle}>Stay updated about your reproductive health</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F763B9',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#F763B9',
    marginTop: 16,
    textAlign: 'center',
  },
});
