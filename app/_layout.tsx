import { Stack } from 'expo-router';
import { UsernameProvider } from '../components/UsernameContext';

export default function RootLayout() {
  return (
    <UsernameProvider>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="gynecologist" options={{ headerShown: true, title: 'Find a Gynecologist', headerTintColor: '#FF69B4' }} />
      <Stack.Screen name="international-network" options={{ headerShown: true, title: 'International Gynecology Network', headerTintColor: '#FF69B4' }} />
      <Stack.Screen name="kabale-hospital" options={{ headerShown: true, title: 'Kabale Regional Referral Hospital', headerTintColor: '#FF69B4' }} />
      <Stack.Screen name="rugarama-hospital" options={{ headerShown: true, title: 'Rugarama Hospital Kabale', headerTintColor: '#FF69B4' }} />
      <Stack.Screen name="womens-health" options={{ headerShown: true, title: "Women's Health", headerTintColor: '#FF69B4' }} />
      <Stack.Screen name="privacy-security" options={{ headerShown: true, title: 'Privacy & Security', headerTintColor: '#FF69B4' }} />
      <Stack.Screen name="notifications-settings" options={{ headerShown: true, title: 'Notifications', headerTintColor: '#FF69B4' }} />
      <Stack.Screen name="help-support" options={{ headerShown: true, title: 'Help & Support', headerTintColor: '#FF69B4' }} />
      <Stack.Screen name="faq" options={{ headerShown: true, title: 'Frequently Asked Questions', headerTintColor: '#FF69B4' }} />
      <Stack.Screen name="contact-support" options={{ headerShown: true, title: 'Contact Support', headerTintColor: '#FF69B4' }} />
      <Stack.Screen name="health-resources" options={{ headerShown: true, title: 'Trusted Menstrual Health Resources', headerTintColor: '#FF69B4' }} />
      <Stack.Screen name="chatbot" options={{ headerShown: true, title: 'Community ChatBot', headerTintColor: '#FF69B4' }} />
      <Stack.Screen name="community-forum" options={{ headerShown: true, title: 'Community Forum', headerTintColor: '#FF69B4' }} />
      <Stack.Screen name="logout" options={{ headerShown: true, title: 'Log Out', headerTintColor: '#FF69B4' }} />
    </Stack>
    </UsernameProvider>
  );
}
