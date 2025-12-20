import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { Ionicons } from '@expo/vector-icons'; // ✅ Import Icons
import { useNavigation } from '@react-navigation/native'; // ✅ Import Navigation Hook
import DateCarousel from '../components/DateCarousel'; 
import MealList from '../components/MealList';
import BottomNavBar from '../components/BottomNavBar';
import "../global.css";

// --- MEAL DATA ---
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
  {
    id: '5',
    time: '19:30',
    type: 'Dinner',
    title: 'Grilled Salmon with Asparagus',
    prepTime: '25 min',
    calories: '520 kcal',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=400',
  },
  {
    id: '6',
    time: '21:00',
    type: 'Late Snack',
    title: 'Greek Yogurt with Honey',
    prepTime: '5 min',
    calories: '180 kcal',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
  },
];

export default function HomePage() {
  const [date, setDate] = useState(new Date()); 
  const [showPicker, setShowPicker] = useState(false);
  
  // ✅ Initialize Navigation
  const navigation = useNavigation(); 

  // Helper for Top Date Text
  const formatDate = (rawDate: Date) => {
    return rawDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  // Handler for the Animated Carousel
  const handleCarouselSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    // Logic to filter MEALS based on selectedDate would go here
  };

  return (
    <View className="flex-1 bg-secondaryBackground">
      
      {/* SECTION 1: HEADER */}
      <SafeAreaView 
        edges={['top']} 
        className="bg-primaryBackground pt-2 pb-6 rounded-b-[40px] shadow-sm z-20 w-full max-w-xl self-center relative"
      >
        
        {/* ✅ FLOATING ACTION BUTTON (Added here) */}
        <TouchableOpacity 
          className="absolute right-4 top-16 bg-secondary w-20 h-20 rounded-full items-center justify-center shadow-lg z-50"
          onPress={() => (navigation as any).navigate('CreateRecipe')}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>

        <View className="items-center mt-2 mb-2">
          {/* Date Picker Trigger */}
          <TouchableOpacity onPress={() => setShowPicker(!showPicker)}>
            <Text className="text-primaryText font-bodoni text-xl ">
                {formatDate(date)}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              style={{ width: 520, backgroundColor: "white" }} 
            />
          )}
        </View>

        {/* Carousel Integration */}
        <View className="w-full h-auto mt-5"> 
          <DateCarousel onDateSelected={handleCarouselSelect} selectedDate={date} />
        </View>
        
      </SafeAreaView>

      {/* SECTION 2: MEAL LIST */}
      <MealList meals={MEALS} />

      {/* SECTION 3: FADE OVERLAY */}
      <LinearGradient
        colors={['rgba(245, 245, 245, 0)', '#F5F5F5']} 
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 70, 
          height: 100, 
        }}
        pointerEvents="none"
      />

      {/* SECTION 4: BOTTOM NAVIGATION */}
      <BottomNavBar activePage="Home" />

    </View>
  );
}