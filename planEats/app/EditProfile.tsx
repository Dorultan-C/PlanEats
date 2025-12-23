import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';
import { storage } from '../firebaseConfig';
import "../global.css";

// ✅ 1. Import Auth type
import { updateProfile, Auth } from 'firebase/auth';

// ✅ 2. FIX: Use 'require' with linter disable to bypass the implicit-any error
// eslint-disable-next-line @typescript-eslint/no-require-imports
const auth = require('../firebaseConfig').auth as Auth;

export default function EditProfile() {
  const router = useRouter();
  const user = auth.currentUser;

  const [name, setName] = useState(user?.displayName || '');
  const [photo, setPhoto] = useState(user?.photoURL || null);
  const [loading, setLoading] = useState(false);

  // --- IMAGE PICKER ---
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  // --- SAVE CHANGES ---
  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    try {
      let photoURL = user.photoURL;

      // 1. If photo changed (is local URI), upload to Firebase Storage
      if (photo && photo !== user.photoURL) {
        const base64 = await FileSystem.readAsStringAsync(photo, { encoding: 'base64' });
        const filename = `profiles/${user.uid}-${Date.now()}.jpg`;
        const storageRef = ref(storage, filename);
        
        await uploadString(storageRef, base64, 'base64', { contentType: 'image/jpeg' });
        photoURL = await getDownloadURL(storageRef);
      }

      // 2. Update Auth Profile
      await updateProfile(user, {
        displayName: name,
        photoURL: photoURL
      });

      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-secondaryBackground">
      <SafeAreaView className="flex-1">
        
        {/* HEADER */}
        <View className="flex-row items-center px-6 py-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white rounded-full shadow-sm">
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-2xl font-bodoni text-primaryText ml-4">Edit Profile</Text>
        </View>

        <View className="px-6 mt-8">
          
          {/* PROFILE PHOTO */}
          <View className="items-center mb-10">
            <TouchableOpacity onPress={pickImage} className="relative">
              <Image 
                source={{ uri: photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' }} 
                className="w-32 h-32 rounded-full border-4 border-white shadow-md"
              />
              <View className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-2 border-white">
                <Ionicons name="camera" size={20} color="white" />
              </View>
            </TouchableOpacity>
            <Text className="text-secondaryText mt-3 text-sm">Tap to change photo</Text>
          </View>

          {/* INPUT FIELDS */}
          <Text className="text-primaryText font-bold mb-2 ml-1">Display Name</Text>
          <TextInput 
            className="bg-white p-4 rounded-xl border border-gray-100 text-lg mb-6 shadow-sm"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />

          <Text className="text-primaryText font-bold mb-2 ml-1">Email (Read Only)</Text>
          <View className="bg-gray-100 p-4 rounded-xl border border-gray-200 mb-10">
            <Text className="text-gray-500">{user?.email}</Text>
          </View>

          {/* SAVE BUTTON */}
          <TouchableOpacity 
            onPress={handleSave}
            disabled={loading}
            className="bg-primary py-4 rounded-full items-center shadow-lg active:opacity-90"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Save Changes</Text>
            )}
          </TouchableOpacity>

        </View>

      </SafeAreaView>
    </View>
  );
}