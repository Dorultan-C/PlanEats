import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, Platform } from 'react-native';
// 1. IMPORT FROM SAFE AREA CONTEXT
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import "../global.css"

// --- 2. MOCK DATA (RESTORED) ---
const DATES = [
  { id: '1', day: '01', weekday: 'Mon' },
  { id: '2', day: '02', weekday: 'Tue' },
  { id: '3', day: '03', weekday: 'Wed' }, 
  { id: '4', day: '04', weekday: 'Thu' },
  { id: '5', day: '05', weekday: 'Fri' },
];

const MEALS = [
  {
    id: '1',
    time: '08:00',
    type: 'Breakfast',
    title: 'Blueberry Pancakes with maple syrup',
    prepTime: '20 min',
    calories: '350 kcal',
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400', 
  },
  {
    id: '2',
    time: '11:00',
    type: 'Morning Snack',
    title: 'Fresh Red Apple',
    prepTime: 'Instant',
    calories: '50 kcal',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400',
  },
  {
    id: '3',
    time: '14:00',
    type: 'Lunch',
    title: 'Chicken curry with Rice and Broccoli',
    prepTime: '40 min',
    calories: '450 kcal',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
  },
  {
    id: '4',
    time: '17:00',
    type: 'Snack',
    title: 'Earl Gray Tea & Biscuits',
    prepTime: '10 min',
    calories: '250 kcal',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
  },
];

export default function HomePage() {
  const [selectedDateId, setSelectedDateId] = useState('3'); 

  return (
    <View className="flex-1 bg-gray-50 dark:bg-black">
      
      {/* SECTION 1: HEADER & DATES */}
      {/* 3. USE SAFE AREA WITH EDGES PROP */}
      <SafeAreaView edges={['top']} className="bg-white pt-2 pb-6 rounded-b-[40px] shadow-sm z-20">
        <View className="items-center mt-2 mb-6">
          <Text className="text-gray-400 font-bodoni text-lg">03 November 2025</Text>
        </View>

        {/* Date Carousel */}
        <View>
            <FlatList
            data={DATES}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, alignItems: 'center' }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
                const isActive = item.id === selectedDateId;
                return (
                <TouchableOpacity 
                    onPress={() => setSelectedDateId(item.id)}
                    className={`items-center justify-center w-16 h-20 mx-2 rounded-3xl ${isActive ? 'bg-[#4CAF50] shadow-lg scale-110' : 'bg-transparent'}`}
                >
                    <Text className={`text-xs mb-1 font-bodoni ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {item.weekday}
                    </Text>
                    <Text className={`text-2xl font-bold font-bodoni ${isActive ? 'text-white' : 'text-gray-300'}`}>
                    {item.day}
                    </Text>
                </TouchableOpacity>
                );
            }}
            />
        </View>
      </SafeAreaView>

      {/* SECTION 2: SCROLLABLE MEAL LIST */}
      <ScrollView 
        className="flex-1 px-5 pt-6"
        contentContainerStyle={{ paddingBottom: 120 }} 
        showsVerticalScrollIndicator={false}
      >
        {MEALS.map((meal) => (
          <View key={meal.id} className="flex-row bg-white rounded-3xl mb-5 overflow-hidden shadow-sm h-36 border border-gray-100">
            
            {/* Left Side: Text Info */}
            <View className="flex-1 p-4 justify-between">
              
              {/* Top Row: Time & Checkbox */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                    <View className="bg-gray-100 px-2 py-1 rounded-md">
                        <Text className="text-gray-500 text-xs font-bold">{meal.time}</Text>
                    </View>
                    <Text className="text-gray-400 text-xs">{meal.type}</Text>
                </View>
                {/* Checkbox Circle */}
                <View className="w-5 h-5 rounded-full border-2 border-[#4CAF50]" />
              </View>

              {/* Meal Title */}
              <Text className="text-gray-800 font-bodoni font-bold text-lg leading-5 pr-1" numberOfLines={2}>
                {meal.title}
              </Text>

              {/* Bottom Row: Prep Time & Calories */}
              <View className="flex-row items-center justify-between mt-1">
                <View className="bg-[#4CAF50] px-2 py-1 rounded-full flex-row items-center gap-1">
                   <Feather name="clock" size={10} color="white" />
                   <Text className="text-white text-[10px] font-bold">{meal.prepTime}</Text>
                </View>
                <Text className="text-gray-400 text-xs font-bold">{meal.calories}</Text>
              </View>
            </View>

            {/* Right Side: Image */}
            <View className="w-32 h-full">
               <Image 
                 source={{ uri: meal.image }} 
                 className="w-full h-full"
                 resizeMode="cover"
               />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* SECTION 3: BOTTOM NAVIGATION */}
      <View className="absolute bottom-8 left-6 right-6 h-20 bg-white rounded-[40px] shadow-2xl shadow-black/10 flex-row items-center justify-around px-2 border border-gray-100">
        
        {/* Home (Active) */}
        <TouchableOpacity className="items-center justify-center">
            <View className="items-center justify-center">
                <Ionicons name="home" size={26} color="#4CAF50" /> 
                <Text className="text-[#4CAF50] text-[10px] font-bold mt-1">Home</Text>
            </View>
        </TouchableOpacity>

        {/* Shopping */}
        <TouchableOpacity className="items-center justify-center opacity-40">
             <View className="items-center justify-center">
                <Feather name="shopping-cart" size={24} color="#4CAF50" />
                <Text className="text-[#4CAF50] text-[10px] font-bold mt-1">Shopping</Text>
            </View>
        </TouchableOpacity>

        {/* Menu */}
        <TouchableOpacity className="items-center justify-center opacity-40">
             <View className="items-center justify-center">
                <Ionicons name="menu" size={28} color="#4CAF50" />
                <Text className="text-[#4CAF50] text-[10px] font-bold mt-1">Menu</Text>
            </View>
        </TouchableOpacity>

      </View>

    </View>
  );
}