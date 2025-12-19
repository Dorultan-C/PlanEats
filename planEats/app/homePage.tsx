import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import DateCarousel from '../components/DateCarousel'; 
import MealList from '../components/MealList';
import BottomNavBar from '../components/BottomNavBar';
import "../global.css"

// --- 1. RESTORED DATA ARRAYS ---
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
  const [selectedDateId, setSelectedDateId] = useState('3'); 

  return (
    <View className="flex-1 bg-secondaryBackground">
      
      {/* SECTION 1: HEADER & DATES */}
      <SafeAreaView 
        edges={['top']} 
        className="bg-primaryBackground pt-2 pb-6 rounded-b-[40px] shadow-sm z-20 w-full max-w-xl self-center"
      >
        <View className="items-center mt-2 mb-6">
          <Text className="text-secondaryText font-bodoni text-lg">03 November 2025</Text>
        </View>

        <DateCarousel 
            dates={DATES}
            selectedId={selectedDateId}
            onSelect={setSelectedDateId}
        />
      </SafeAreaView>

      {/* SECTION 2: MEAL LIST */}
      <MealList meals={MEALS} />

      {/* SECTION 3: FADE OVERLAY */}
      <LinearGradient
        // IMPORTANT: Make sure this second color matches your background!
        colors={['rgba(245, 245, 245, 0)', '#F5F5F5']} 
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 70,
          height: 100, // Height of the fade effect
        }}
        pointerEvents="none"
      />

      {/* SECTION 4: BOTTOM NAVIGATION */}
      <BottomNavBar activePage="Home" />

    </View>
  );
}