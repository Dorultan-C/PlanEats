import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import MealList from '../components/MealList';
import BottomNavBar from '../components/BottomNavBar';
import "../global.css";

export default function Favourites() {
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load Data every time screen opens
  useFocusEffect(
    useCallback(() => {
      fetchFavourites();
    }, [])
  );

  const fetchFavourites = async () => {
    try {
      setLoading(true);
      
      // 1. Get Favorite IDs from Local Storage
      const stored = await AsyncStorage.getItem('favorites');
      const favoriteIds = stored ? JSON.parse(stored) : [];

      if (favoriteIds.length === 0) {
        setMeals([]);
        setLoading(false);
        return;
      }

      // 2. Fetch All Recipes
      const querySnapshot = await getDocs(collection(db, "recipes"));
      
      const allMeals = querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        const mealType = (data.categories && data.categories.length > 0) 
          ? data.categories[0] 
          : "Recipe";

        return {
          id: doc.id,
          title: data.title || "Untitled",
          calories: `${data.total_calories || 0} kcal`,
          image: data.cover_image || 'https://via.placeholder.com/400',
          prepTime: data.prep_time || '20 min',
          type: mealType,
          time: 'Saved',
          ingredients: data.ingredients || [], 
          steps: data.steps || [] 
        };
      });

      // 3. Filter only Favorites
      const favMeals = allMeals.filter(meal => favoriteIds.includes(meal.id));
      setMeals(favMeals);

    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-secondaryBackground">
      
      {/* HEADER */}
      <SafeAreaView edges={['top']} className="bg-primaryBackground pt-4 pb-4 rounded-b-[40px] shadow-sm z-20">
        <Text className="text-center text-2xl font-bodoni text-primaryText">My Favourites</Text>
      </SafeAreaView>

      {/* CONTENT */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : meals.length > 0 ? (
        <MealList meals={meals} />
      ) : (
        <View className="flex-1 justify-center items-center p-10">
          <Text className="text-secondaryText text-center text-lg">No saved recipes yet.</Text>
          <Text className="text-gray-400 text-center mt-2">Tap the heart icon on any recipe to save it here.</Text>
        </View>
      )}

      {/* NAV BAR */}
      {/* ✅ CHANGED: activePage is now 'Favourites', so 'Home' underline will disappear */}
      <BottomNavBar activePage="Favourites" /> 
    </View>
  );
}