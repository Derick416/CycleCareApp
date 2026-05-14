import { Stack } from 'expo-router';
import { UsernameProvider } from '../components/UsernameContext';
import { ThemeProvider } from '../components/ThemeContext';
import { CycleProvider } from '../components/CycleContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <UsernameProvider>
        <CycleProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="period-tracker" options={{ headerShown: true, title: 'Period Tracker', headerTintColor: '#C2185B' }} />
            <Stack.Screen name="status-check" options={{ headerShown: true, title: 'My Cycle Status', headerTintColor: '#C2185B' }} />
            <Stack.Screen name="gynecologist" options={{ headerShown: true, title: 'Find a Gynecologist', headerTintColor: '#C2185B' }} />
            <Stack.Screen name="international-network" options={{ headerShown: true, title: 'International Gynecology Network', headerTintColor: '#C2185B' }} />
            <Stack.Screen name="kabale-hospital" options={{ headerShown: true, title: 'Kabale Regional Referral Hospital', headerTintColor: '#C2185B' }} />
            <Stack.Screen name="rugarama-hospital" options={{ headerShown: true, title: 'Rugarama Hospital Kabale', headerTintColor: '#C2185B' }} />
            <Stack.Screen name="womens-health" options={{ headerShown: true, title: "Women's Health", headerTintColor: '#C2185B' }} />
            <Stack.Screen name="privacy-security" options={{ headerShown: true, title: 'Privacy & Security', headerTintColor: '#C2185B' }} />
            <Stack.Screen name="notifications-settings" options={{ headerShown: true, title: 'Notifications', headerTintColor: '#C2185B' }} />
            <Stack.Screen name="help-support" options={{ headerShown: true, title: 'Help & Support', headerTintColor: '#C2185B' }} />
            <Stack.Screen name="faq" options={{ headerShown: true, title: 'FAQs', headerTintColor: '#C2185B' }} />
            <Stack.Screen name="contact-support" options={{ headerShown: true, title: 'Contact Support', headerTintColor: '#C2185B' }} />
            <Stack.Screen name="health-resources" options={{ headerShown: true, title: 'Health Resources', headerTintColor: '#C2185B' }} />
            <Stack.Screen name="chatbot" options={{ headerShown: true, title: 'Community ChatBot', headerTintColor: '#C2185B' }} />
            <Stack.Screen name="community-forum" options={{ headerShown: true, title: 'Community Forum', headerTintColor: '#C2185B' }} />
            <Stack.Screen name="logout" options={{ headerShown: true, title: 'Log Out', headerTintColor: '#C2185B' }} />
          </Stack>
        </CycleProvider>
      </UsernameProvider>
    </ThemeProvider>
  );
}
