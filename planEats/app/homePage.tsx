import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // ✅ Import useFocusEffect
import DateCarousel from '../components/DateCarousel'; 
import MealList from '../components/MealList';
import BottomNavBar from '../components/BottomNavBar';
import "../global.css";

// --- FIREBASE IMPORTS ---
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ensure this path is correct

export default function HomePage() {
  const navigation = useNavigation();
  
  // --- STATE ---
  const [date, setDate] = useState(new Date()); 
  const [showPicker, setShowPicker] = useState(false);
  const [meals, setMeals] = useState<any[]>([]); // ✅ Holds real data
  const [loading, setLoading] = useState(true);  // ✅ Loading state

  // --- FETCH DATA FUNCTION ---
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "recipes"));
      
      const fetchedMeals = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          // We map your Firebase fields to what the UI expects
          title: data.title || "Untitled Recipe",
          calories: `${data.total_calories || 0} kcal`,
          image: data.cover_image || 'https://via.placeholder.com/400', // Fallback image
          prepTime: '20 min', // You can save this in DB later
          time: 'Recently Added', // Or use data.created_at
          type: 'Recipe',
          steps: data.steps || [],
          ingredients: data.ingredients || [], 
        };
      });

      setMeals(fetchedMeals);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ RE-FETCH WHEN RETURNING TO SCREEN
  // This ensures new recipes show up immediately after you create them
  useFocusEffect(
    React.useCallback(() => {
      fetchRecipes();
    }, [])
  );

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

  const handleCarouselSelect = (selectedDate: Date) => {
    setDate(selectedDate);
  };

  return (
    <View className="flex-1 bg-secondaryBackground">
      
      {/* SECTION 1: HEADER */}
      <SafeAreaView 
        edges={['top']} 
        className="bg-primaryBackground pt-2 pb-6 rounded-b-[40px] shadow-sm z-20 w-full max-w-xl self-center relative"
      >
        
        {/* Floating Action Button */}
        <TouchableOpacity 
          className="absolute right-8 top-16 bg-secondary w-20 h-20 rounded-full items-center justify-center shadow-lg z-50"
          onPress={() => (navigation as any).navigate('CreateRecipe')}
        >
          <Ionicons name="add" size={26} color="white" />
        </TouchableOpacity>

        <View className="items-center mt-2 mb-2">
          {/* Date Picker Trigger */}
          <TouchableOpacity onPress={() => setShowPicker(!showPicker)}>
            <Text className="text-primaryText font-bodoni text-2xl ">
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

        {/* Carousel */}
        <View className="w-full h-auto mt-5"> 
          <DateCarousel onDateSelected={handleCarouselSelect} selectedDate={date} />
        </View>
        
      </SafeAreaView>

      {/* SECTION 2: MEAL LIST (REAL DATA) */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text className="text-secondaryText mt-2">Loading Recipes...</Text>
        </View>
      ) : (
        <MealList meals={meals} />
      )}

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