import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import BottomNavBar from '../components/BottomNavBar';
import "../global.css"

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
      
      {/* 1. HEADER & PROFILE SECTION */}
      <SafeAreaView 
        edges={['top']} 
        className="bg-primary/10 pb-6 w-full max-w-xl self-center"
      > 
        <View className="px-6 pt-2">
            <Text className="text-4xl font-bodoni font-bold text-primaryText mb-6">Menu</Text>
            
            <View className="flex-row items-center bg-primaryBackground p-4 rounded-2xl shadow-sm border border-secondaryBackground">
                {/* Profile Image */}
                <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' }} 
                    className="w-16 h-16 rounded-full mr-4"
                />
                
                {/* Name & Edit Link */}
                <View>
                    <Text className="text-xl font-bold font-bodoni text-primaryText">John Lee</Text>
                    <TouchableOpacity>
                        <Text className="text-primary font-bold text-sm underline mt-1">Edit Profile</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </SafeAreaView>

      {/* 2. SCROLLABLE SETTINGS LIST */}
      <ScrollView 
        className="flex-1 w-full max-w-xl self-center" 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 150 }} // Extra padding for the new taller nav bar
      >
        
        {/* --- SECTION: MY FOOD --- */}
        <View className="bg-primary/5 py-3 px-6 mt-4">
            <Text className="text-secondaryText font-bold text-xs tracking-widest uppercase">My Food</Text>
        </View>

        <View className="px-6">
            {/* Dietary Type */}
            <TouchableOpacity className="flex-row justify-between items-center py-5 border-b border-secondaryBackground">
                <Text className="text-lg font-bodoni text-primaryText">Dietary Type</Text>
                <View className="flex-row items-center">
                    <Text className="text-secondaryText font-bodoni mr-2">Vegetarian</Text>
                    <Feather name="chevron-right" size={20} color="#757575" />
                </View>
            </TouchableOpacity>

            {/* Allergy & Preferences */}
            <TouchableOpacity className="flex-row justify-between items-center py-5 border-b border-secondaryBackground">
                <Text className="text-lg font-bodoni text-primaryText">Allergy & Preferences</Text>
                <View className="flex-row items-center">
                    <Text className="text-secondaryText font-bodoni mr-2">3 selected</Text>
                    <Feather name="chevron-right" size={20} color="#757575" />
                </View>
            </TouchableOpacity>

            {/* Favourite Dishes */}
            <TouchableOpacity className="flex-row justify-between items-center py-5">
                <Text className="text-lg font-bodoni text-primaryText">Favourite dishes</Text>
                <Feather name="chevron-right" size={20} color="#757575" />
            </TouchableOpacity>
        </View>


        {/* --- SECTION: SETTINGS --- */}
        <View className="bg-primary/5 py-3 px-6 mt-2">
            <Text className="text-secondaryText font-bold text-xs tracking-widest uppercase">Settings</Text>
        </View>

        <View className="px-6">
            {/* Notifications Toggle */}
            <View className="flex-row justify-between items-center py-4 border-b border-secondaryBackground">
                <Text className="text-lg font-bodoni text-primaryText">Notifications</Text>
                <Switch 
                    trackColor={{ false: "#E0E0E0", true: "#4CAF50" }} 
                    thumbColor={isNotificationsEnabled ? "#FFFFFF" : "#f4f3f4"}
                    onValueChange={setIsNotificationsEnabled}
                    value={isNotificationsEnabled}
                />
            </View>

            {/* Units */}
            <TouchableOpacity className="flex-row justify-between items-center py-5">
                <Text className="text-lg font-bodoni text-primaryText">Units</Text>
                <View className="flex-row items-center">
                    <Text className="text-secondaryText font-bodoni mr-2">Metric (gr, ml)</Text>
                    <Feather name="chevron-right" size={20} color="#757575" />
                </View>
            </TouchableOpacity>
        </View>


        {/* --- SECTION: ACCOUNT --- */}
        <View className="bg-primary/5 py-3 px-6 mt-2">
            <Text className="text-secondaryText font-bold text-xs tracking-widest uppercase">Account</Text>
        </View>

        <View className="px-6">
            {/* Help & FAQs */}
            <TouchableOpacity className="flex-row justify-between items-center py-5 border-b border-secondaryBackground">
                <Text className="text-lg font-bodoni text-primaryText">Help & FAQs</Text>
                <Feather name="chevron-right" size={20} color="#757575" />
            </TouchableOpacity>

            {/* LOG OUT BUTTON */}
            <TouchableOpacity onPress={handleLogout} className="w-full py-6 items-center">
                <Text className="text-alternate font-bodoni text-xl">Log Out</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>

      {/* 3. REUSABLE BOTTOM NAVIGATION BAR */}
      <BottomNavBar activePage="Menu" />

    </View>
  );
}