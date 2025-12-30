import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { signOut, Auth } from 'firebase/auth'; 
import BottomNavBar from '../components/BottomNavBar';
import "../global.css"

// eslint-disable-next-line @typescript-eslint/no-require-imports
const auth = require('../firebaseConfig').auth as Auth;

export default function MenuPage() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [userData, setUserData] = useState({
    name: auth.currentUser?.displayName || 'User',
    photo: auth.currentUser?.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
  });

  useFocusEffect(
    React.useCallback(() => {
      if (auth.currentUser) {
        auth.currentUser.reload().then(() => {
          setUserData({
            name: auth.currentUser?.displayName || 'User',
            photo: auth.currentUser?.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
          });
        });
      }
    }, [])
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/logIn');
    } catch (error: any) {
      Alert.alert("Error logging out", error.message);
    }
  };

  return (
    <View className="flex-1 bg-primaryBackground">
      <SafeAreaView edges={['top']} className="bg-primary/10 pb-6 w-full max-w-xl self-center"> 
        <View className="px-6 pt-2">
            <Text className="text-4xl font-bodoni font-bold text-primaryText mb-6">Menu</Text>
            
            <View className="flex-row items-center bg-primaryBackground p-4 rounded-2xl shadow-sm border border-secondaryBackground">
                {/* ✅ FIX: Explicit Style Dimensions */}
                <Image 
                    source={{ uri: userData.photo }} 
                    style={{ width: 64, height: 64, borderRadius: 32 }}
                    className="mr-4"
                />
                <View>
                    <Text className="text-xl font-bold font-bodoni text-primaryText">{userData.name}</Text>
                    <TouchableOpacity onPress={() => router.push('/EditProfile')}>
                        <Text className="text-primary font-bold text-sm underline mt-1">Edit Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 w-full max-w-xl self-center" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        {/* ... (Rest of the menu options are text-only, no images to fix here) ... */}
        {/* COPY THE REST OF YOUR MENU ITEMS HERE (My Food, Settings, Account...) */}
        {/* I am omitting the middle text sections to save space as they were already correct */}
        
        <View className="bg-primary/5 py-3 px-6 mt-4">
            <Text className="text-secondaryText font-bold text-xs tracking-widest uppercase">My Food</Text>
        </View>
        <View className="px-6">
            <TouchableOpacity className="flex-row justify-between items-center py-5 border-b border-secondaryBackground">
                <Text className="text-lg font-bodoni text-primaryText">Dietary Type</Text>
                <View className="flex-row items-center">
                    <Text className="text-secondaryText font-bodoni mr-2">Vegetarian</Text>
                    <Feather name="chevron-right" size={20} color="#757575" />
                </View>
            </TouchableOpacity>
            {/* ... other items ... */}
        </View>

        {/* ... Settings Section ... */}
        <View className="bg-primary/5 py-3 px-6 mt-2">
            <Text className="text-secondaryText font-bold text-xs tracking-widest uppercase">Settings</Text>
        </View>
        <View className="px-6">
            <View className="flex-row justify-between items-center py-4 border-b border-secondaryBackground">
                <Text className="text-lg font-bodoni text-primaryText">Notifications</Text>
                <Switch 
                    trackColor={{ false: "#E0E0E0", true: "#4CAF50" }} 
                    thumbColor={isNotificationsEnabled ? "#FFFFFF" : "#f4f3f4"}
                    onValueChange={setIsNotificationsEnabled}
                    value={isNotificationsEnabled}
                />
            </View>
            {/* ... other settings ... */}
        </View>

        {/* ... Account Section ... */}
        <View className="bg-primary/5 py-3 px-6 mt-2">
            <Text className="text-secondaryText font-bold text-xs tracking-widest uppercase">Account</Text>
        </View>
        <View className="px-6">
            <TouchableOpacity onPress={handleLogout} className="w-full py-6 items-center">
                <Text className="text-alternate font-bodoni text-xl">Log Out</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
      <BottomNavBar activePage="Menu" />
    </View>
  );
}