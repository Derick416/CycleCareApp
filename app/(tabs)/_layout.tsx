import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUsername } from '../../components/UsernameContext';

export default function TabsLayout() {
  const { username } = useUsername();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF69B4',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: { height: 60, paddingBottom: 8 },
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#FF69B4',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Status',
          headerTitle: `Welcome, ${username}`,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mhm-info"
        options={{
          title: 'MHM Info',
          headerTitle: 'Menstrual Health Info',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="healthcare"
        options={{
          title: 'Healthcare',
          headerTitle: 'Healthcare Resources',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medkit" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerTitle: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
