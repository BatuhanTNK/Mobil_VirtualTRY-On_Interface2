// app/_layout.tsx
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('immersive' as any);
      NavigationBar.setBehaviorAsync('overlay-swipe');
      NavigationBar.setBackgroundColorAsync('transparent');
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      {/* UYGULAMA GENEL ARKAPLANI: MAVİ */}
      <View style={{ flex: 1, backgroundColor: '#4F7CFF' }}>
        <Stack
          screenOptions={{
            headerShown: false,
            // ekranların default arka planını transparan yap ki üstteki mavi görünsün
            contentStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}
