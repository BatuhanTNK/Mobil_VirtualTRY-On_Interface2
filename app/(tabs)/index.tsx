import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

const { height: screenHeight } = Dimensions.get('window');

interface PhotoUploadCardProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPhotoSelect: (uri: string) => void;
  selectedPhoto?: string;
}

function PhotoUploadCard({ title, subtitle, icon, onPhotoSelect, selectedPhoto }: PhotoUploadCardProps) {
  const handlePhotoSelect = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri erişim izni gerekli.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
      base64: false,
    });

    if (!result.canceled && result.assets[0]) {
      onPhotoSelect(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={24} color="#4F7CFF" />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
      
      <TouchableOpacity style={styles.uploadArea} onPress={handlePhotoSelect}>
        {selectedPhoto ? (
          <Image source={{ uri: selectedPhoto }} style={styles.selectedImage} />
        ) : (
          <>
            <Ionicons name="camera" size={48} color="#9CA3AF" />
            <Text style={styles.uploadText}>Fotoğraf Yükle</Text>
            <Text style={styles.uploadHint}>Dokunarak fotoğraf seçin</Text>
          </>
        )}
      </TouchableOpacity>
      
      <Text style={styles.fileSpecs}>Max 10MB • JPG, PNG, WEBP</Text>
    </View>
  );
}

function ExperimentSettingsCard() {
  const [poseProtection, setPoseProtection] = useState(true);
  const [aspectRatio, setAspectRatio] = useState('3:4 (Fashion)');
  const [showAspectModal, setShowAspectModal] = useState(false);

  const aspectRatios = ['3:4 (Fashion)', '1:1 (Square)', '16:9 (Wide)'];

  const handlePoseToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPoseProtection(!poseProtection);
  };

  const handleAspectRatioSelect = (ratio: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setAspectRatio(ratio);
    setShowAspectModal(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="settings" size={24} color="#4F7CFF" />
        <Text style={styles.cardTitle}>Deneme Ayarları</Text>
      </View>

      {/* Pose Protection */}
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Poz Korunacak</Text>
          <Text style={styles.settingDescription}>
            Vücut pozisyonunu koruyarak sadece kıyafeti değiştir
          </Text>
        </View>
        <Switch
          trackColor={{ false: '#E5E7EB', true: '#10B981' }}
          thumbColor={poseProtection ? '#FFFFFF' : '#FFFFFF'}
          ios_backgroundColor="#E5E7EB"
          onValueChange={handlePoseToggle}
          value={poseProtection}
        />
      </View>

      {/* Aspect Ratio */}
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Görsel Oranı</Text>
          <Text style={styles.settingDescription}>
            Sonuç görselinin boy-en oranını belirleyin
          </Text>
        </View>
        <TouchableOpacity
          style={styles.aspectRatioButton}
          onPress={() => setShowAspectModal(true)}
        >
          <Text style={styles.aspectRatioText}>{aspectRatio}</Text>
          <Ionicons name="chevron-down" size={16} color="#4F7CFF" />
        </TouchableOpacity>
      </View>

      {/* Aspect Ratio Modal */}
      <Modal
        visible={showAspectModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Görsel Oranı Seçin</Text>
            {aspectRatios.map((ratio) => (
              <TouchableOpacity
                key={ratio}
                style={[
                  styles.aspectRatioOption,
                  aspectRatio === ratio && styles.selectedAspectRatio
                ]}
                onPress={() => handleAspectRatioSelect(ratio)}
              >
                <Text style={[
                  styles.aspectRatioOptionText,
                  aspectRatio === ratio && styles.selectedAspectRatioText
                ]}>
                  {ratio}
                </Text>
                {aspectRatio === ratio && (
                  <Ionicons name="checkmark" size={20} color="#4F7CFF" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowAspectModal(false)}
            >
              <Text style={styles.modalCloseText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function VirtualTryOnScreen() {
  const [personPhoto, setPersonPhoto] = useState<string>('');
  const [clothingPhoto, setClothingPhoto] = useState<string>('');
  const [showMenu, setShowMenu] = useState(false);
  const insets = useSafeAreaInsets();

  const handleStartTryOn = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    if (!personPhoto || !clothingPhoto) {
      Alert.alert(
        'Eksik Fotoğraf',
        'Lütfen hem kişi hem de kıyafet fotoğrafı yükleyin.',
        [{ text: 'Tamam', style: 'default' }]
      );
      return;
    }

    Alert.alert(
      'Sanal Deneme Başlatıldı',
      'AI ile kıyafet deneme işlemi başlatılıyor...',
      [{ text: 'Tamam', style: 'default' }]
    );
  };

  const toggleMenu = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setShowMenu(!showMenu);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <LinearGradient
          colors={['#4F7CFF', '#6B8EFF']}
          style={styles.gradient}
        >
          <KeyboardAvoidingView 
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top > 0 ? 0 : 20 }]}>
              <View style={styles.headerContent}>
                <View style={styles.headerText}>
                  <Text style={styles.appTitle}>Virtual Try-On</Text>
                  <Text style={styles.appSubtitle}>AI ile Kıyafet Deneme Deneyimi</Text>
                </View>
                <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
                  <Ionicons name="menu" size={28} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Main Content */}
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: Math.max(insets.bottom, 30) + 80 }
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <PhotoUploadCard
                title="Kişi Fotoğrafı"
                subtitle="Boydan boy kişi fotoğrafı yükleyin"
                icon="person"
                onPhotoSelect={setPersonPhoto}
                selectedPhoto={personPhoto}
              />

              <PhotoUploadCard
                title="Kıyafet Fotoğrafı"
                subtitle="Denenmek istenen kıyafet"
                icon="shirt"
                onPhotoSelect={setClothingPhoto}
                selectedPhoto={clothingPhoto}
              />

              <ExperimentSettingsCard />
            </ScrollView>

            {/* Action Button */}
            <View style={[styles.actionButtonContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
              <TouchableOpacity style={styles.actionButton} onPress={handleStartTryOn}>
                <Text style={styles.actionButtonText}>Sanal Denemeyi Başlat</Text>
              </TouchableOpacity>
            </View>

            {/* Menu Modal */}
            <Modal
              visible={showMenu}
              transparent
              animationType="slide"
            >
              <View style={styles.menuOverlay}>
                <View style={styles.menuContent}>
                  <View style={styles.menuHeader}>
                    <Text style={styles.menuTitle}>Menü</Text>
                    <TouchableOpacity onPress={() => setShowMenu(false)}>
                      <Ionicons name="close" size={24} color="#374151" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="help-circle" size={20} color="#6B7280" />
                    <Text style={styles.menuItemText}>Yardım</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="information-circle" size={20} color="#6B7280" />
                    <Text style={styles.menuItemText}>Hakkında</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="share" size={20} color="#6B7280" />
                    <Text style={styles.menuItemText}>Paylaş</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#B3C8FF',
    fontWeight: '500',
  },
  menuButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginLeft: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 140,
    justifyContent: 'center',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
  },
  uploadHint: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  fileSpecs: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  aspectRatioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  aspectRatioText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4F7CFF',
    marginRight: 4,
  },
  actionButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  actionButton: {
    backgroundColor: '#374151',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 20,
    textAlign: 'center',
  },
  aspectRatioOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedAspectRatio: {
    backgroundColor: '#EFF6FF',
  },
  aspectRatioOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedAspectRatioText: {
    color: '#4F7CFF',
    fontWeight: '600',
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  menuItemText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
});