import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import "../global.css";

type BottomNavBarProps = {
  activePage: 'Home' | 'Shopping' | 'Menu';
};

// Colors from tailwind.config.js
const PRIMARY_COLOR = '#4CAF50'; 

export default function BottomNavBar({ activePage }: BottomNavBarProps) {
  
  const renderUnderline = (isActive: boolean) => {
    // ✅ Uses 'bg-secondary' (Amber #FFC107 from screenshot) for the active dash
    if (!isActive) return <View className="h-1 mt-1 w-8" />; 
    return <View className="h-1 mt-1 w-8 bg-secondary rounded-full" />;
  };

  return (
    <View className="absolute bottom-10 w-full max-w-xl self-center px-6">
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
                <Ionicons name="home" size={26} color={PRIMARY_COLOR} /> 
                {/* ✅ Added font-bodoni for consistency */}
                <Text className="text-primary text-[10px] font-bodoni font-bold mt-1">Home</Text>
                {renderUnderline(activePage === 'Home')}
            </View>
        </TouchableOpacity>

        {/* SHOPPING BUTTON */}
        <TouchableOpacity className="items-center justify-center w-20">
             <View className="items-center justify-center">
                <Feather name="shopping-cart" size={24} color={PRIMARY_COLOR} />
                <Text className="text-primary text-[10px] font-bodoni font-bold mt-1">Shopping</Text>
                {renderUnderline(activePage === 'Shopping')}
            </View>
        </TouchableOpacity>

        {/* MENU BUTTON */}
        <TouchableOpacity 
            className="items-center justify-center w-20"
            onPress={() => router.push('/menu')}
        >
             <View className="items-center justify-center">
                <Ionicons name="menu" size={28} color={PRIMARY_COLOR} />
                <Text className="text-primary text-[10px] font-bodoni font-bold mt-1">Menu</Text>
                {renderUnderline(activePage === 'Menu')}
            </View>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingShadow: {
    elevation: 10, 
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
});