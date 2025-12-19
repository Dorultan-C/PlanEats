import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import "../global.css"

// Helper to use your tailwind config colors in the Icon "color" prop
const COLORS = {
  primary: '#4CAF50',
  secondaryText: '#757575',
  alternate: '#F44336'
};

export default function MenuPage() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

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
      
      {/* 1. HEADER & PROFILE */}
      {/* bg-primary/10 creates the light green background using your primary color */}
      <SafeAreaView edges={['top']} className="bg-primary/10 pb-6"> 
        <View className="px-6 pt-2">
            <Text className="text-4xl font-bodoni font-bold text-primaryText mb-6">Menu</Text>
            
            <View className="flex-row items-center bg-primaryBackground p-4 rounded-2xl shadow-sm border border-secondaryBackground">
                <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' }} 
                    className="w-16 h-16 rounded-full mr-4"
                />
                <View>
                    <Text className="text-xl font-bold font-bodoni text-primaryText">John Lee</Text>
                    <TouchableOpacity>
                        <Text className="text-primary font-bold text-sm underline mt-1">Edit Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </SafeAreaView>

      {/* 2. SCROLLABLE CONTENT */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* --- MY FOOD --- */}
        <View className="bg-primary/10 py-3 px-6 mt-4">
            <Text className="text-secondaryText font-bold text-xs tracking-widest uppercase">My Food</Text>
        </View>

        <View className="px-6">
            <TouchableOpacity className="flex-row justify-between items-center py-5 border-b border-secondaryBackground">
                <Text className="text-lg font-bodoni text-primaryText">Dietary Type</Text>
                <View className="flex-row items-center">
                    <Text className="text-secondaryText font-bodoni mr-2">Vegetarian</Text>
                    <Feather name="chevron-right" size={20} color={COLORS.secondaryText} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row justify-between items-center py-5 border-b border-secondaryBackground">
                <Text className="text-lg font-bodoni text-primaryText">Allergy & Preferences</Text>
                <View className="flex-row items-center">
                    <Text className="text-secondaryText font-bodoni mr-2">3 selected</Text>
                    <Feather name="chevron-right" size={20} color={COLORS.secondaryText} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row justify-between items-center py-5">
                <Text className="text-lg font-bodoni text-primaryText">Favourite dishes</Text>
                <Feather name="chevron-right" size={20} color={COLORS.secondaryText} />
            </TouchableOpacity>
        </View>


        {/* --- SETTINGS --- */}
        <View className="bg-primary/10 py-3 px-6 mt-2">
            <Text className="text-secondaryText font-bold text-xs tracking-widest uppercase">Settings</Text>
        </View>

        <View className="px-6">
            <View className="flex-row justify-between items-center py-4 border-b border-secondaryBackground">
                <Text className="text-lg font-bodoni text-primaryText">Notifications</Text>
                <Switch 
                    trackColor={{ false: "#E0E0E0", true: COLORS.primary }}
                    thumbColor={isNotificationsEnabled ? "#FFFFFF" : "#f4f3f4"}
                    onValueChange={setIsNotificationsEnabled}
                    value={isNotificationsEnabled}
                />
            </View>

            <TouchableOpacity className="flex-row justify-between items-center py-5">
                <Text className="text-lg font-bodoni text-primaryText">Units</Text>
                <View className="flex-row items-center">
                    <Text className="text-secondaryText font-bodoni mr-2">Metric (gr, ml)</Text>
                    <Feather name="chevron-right" size={20} color={COLORS.secondaryText} />
                </View>
            </TouchableOpacity>
        </View>


        {/* --- ACCOUNT --- */}
        <View className="bg-primary/10 py-3 px-6 mt-2">
            <Text className="text-secondaryText font-bold text-xs tracking-widest uppercase">Account</Text>
        </View>

        <View className="px-6">
            <TouchableOpacity className="flex-row justify-between items-center py-5 border-b border-secondaryBackground">
                <Text className="text-lg font-bodoni text-primaryText">Help & FAQs</Text>
                <Feather name="chevron-right" size={20} color={COLORS.secondaryText} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} className="w-full py-6 items-center">
                {/* Used 'text-alternate' (Red) for Log Out */}
                <Text className="text-alternate font-bodoni text-xl">Log Out</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>


      {/* 3. BOTTOM NAVIGATION */}
      <View className="absolute bottom-8 left-6 right-6 h-20 bg-primaryBackground rounded-[40px] shadow-2xl shadow-black/10 flex-row items-center justify-around px-2 border border-secondaryBackground">
        
        {/* Home */}
        <TouchableOpacity 
            className="items-center justify-center opacity-40"
            onPress={() => router.push('/homePage')}
        >
            <View className="items-center justify-center">
                <Ionicons name="home" size={26} color={COLORS.primary} /> 
                <Text className="text-primary text-[10px] font-bold mt-1">Home</Text>
            </View>
        </TouchableOpacity>

        {/* Shopping */}
        <TouchableOpacity className="items-center justify-center opacity-40">
             <View className="items-center justify-center">
                <Feather name="shopping-cart" size={24} color={COLORS.primary} />
                <Text className="text-primary text-[10px] font-bold mt-1">Shopping</Text>
            </View>
        </TouchableOpacity>

        {/* Menu (Active) */}
        <TouchableOpacity className="items-center justify-center">
             <View className="items-center justify-center">
                <Ionicons name="menu" size={28} color={COLORS.primary} />
                <Text className="text-primary text-[10px] font-bold mt-1">Menu</Text>
            </View>
        </TouchableOpacity>

      </View>

    </View>
  );
}