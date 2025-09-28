import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function GalleryScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <LinearGradient
          colors={['#4F7CFF', '#6B8EFF']}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Galeri</Text>
            <Text style={styles.subtitle}>Sanal deneme geçmişiniz</Text>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.emptyState}>
              <Ionicons name="images-outline" size={64} color="#B3C8FF" />
              <Text style={styles.emptyTitle}>Henüz sanal deneme yok</Text>
              <Text style={styles.emptySubtitle}>
                İlk sanal denemenizi yapmak için ana sayfaya gidin
              </Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#B3C8FF',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#B3C8FF',
    textAlign: 'center',
    lineHeight: 24,
  },
});