import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../components/ThemeContext';
import { View, StyleSheet } from 'react-native';

function TabIcon({ name, color, focused }: { name: any; color: string; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <MaterialIcons name={name} size={23} color={color} />
    </View>
  );
}

export default function TabsLayout() {
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#C2185B',
        tabBarInactiveTintColor: c.textSecondary,
        tabBarStyle: {
          backgroundColor: c.tabBar,
          borderTopColor: c.border,
          borderTopWidth: 1,
          height: 66,
          paddingBottom: 10,
          paddingTop: 6,
          elevation: 16,
          shadowColor: '#C2185B',
          shadowOpacity: 0.12,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="status-check"
        options={{
          title: 'Status',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="favorite" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="healthcare"
        options={{
          title: 'Healthcare',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="local-hospital" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="settings" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 36, height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#FCE4EC',
  },
});
