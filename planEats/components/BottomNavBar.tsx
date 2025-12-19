import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import "../global.css";

type BottomNavBarProps = {
  activePage: 'Home' | 'Shopping' | 'Menu';
};

export default function BottomNavBar({ activePage }: BottomNavBarProps) {
  
  const renderUnderline = (isActive: boolean) => {
    if (!isActive) return <View className="h-1 mt-1 w-8" />; 
    return <View className="h-1 mt-1 w-8 bg-secondary rounded-full" />;
  };

  return (
    <View className="absolute bottom-20 w-full max-w-xl self-center px-6">
      <View 
        className="h-20 bg-primaryBackground rounded-[40px] flex-row items-center justify-around px-2"
        style={styles.floatingShadow} 
      >
        
        {/* HOME BUTTON */}
        <TouchableOpacity 
            className="items-center justify-center w-20"
            onPress={() => router.push('/homePage')}
        >
            <View className="items-center justify-center">
                <Ionicons name="home" size={26} color="#4CAF50" /> 
                <Text className="text-primary text-[10px] font-bold mt-1">Home</Text>
                {renderUnderline(activePage === 'Home')}
            </View>
        </TouchableOpacity>

        {/* SHOPPING BUTTON */}
        <TouchableOpacity className="items-center justify-center w-20">
             <View className="items-center justify-center">
                <Feather name="shopping-cart" size={24} color="#4CAF50" />
                <Text className="text-primary text-[10px] font-bold mt-1">Shopping</Text>
                {renderUnderline(activePage === 'Shopping')}
            </View>
        </TouchableOpacity>

        {/* MENU BUTTON */}
        <TouchableOpacity 
            className="items-center justify-center w-20"
            onPress={() => router.push('/menu')}
        >
             <View className="items-center justify-center">
                <Ionicons name="menu" size={28} color="#4CAF50" />
                <Text className="text-primary text-[10px] font-bold mt-1">Menu</Text>
                {renderUnderline(activePage === 'Menu')}
            </View>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingShadow: {
    // --- ANDROID FIX ---
    elevation: 10, // Keeps the bottom drop shadow
    // We add a subtle border ONLY to the top to mimic the 'lift' where the shadow would be
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)', // Very faint dark line
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.03)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.03)',
    borderBottomWidth: 0, // Let the real shadow handle the bottom

    // --- iOS (Standard Shadow) ---
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
});