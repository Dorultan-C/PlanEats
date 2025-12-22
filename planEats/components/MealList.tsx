import React, { useState, useCallback } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; 
import "../global.css";

type Meal = {
  id: string;
  time: string;
  type: string;
  title: string;
  prepTime: string;
  calories: string;
  image: string;
};

type MealListProps = {
  meals: Meal[];
};

export default function MealList({ meals }: MealListProps) {
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);

  // 1. Load favorites whenever the list comes into focus
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      if (stored) setFavorites(JSON.parse(stored));
    } catch (e) { console.error(e); }
  };

  const toggleFavorite = async (id: string) => {
    try {
      let newFavorites = [...favorites];
      if (newFavorites.includes(id)) {
        newFavorites = newFavorites.filter(favId => favId !== id);
      } else {
        newFavorites.push(id);
      }
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (e) { console.error(e); }
  };

  return (
    <FlatList 
      data={meals}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      className="flex-1 w-full max-w-xl self-center px-5 pt-6"
      style={{ marginBottom: 100 }}
      contentContainerStyle={{ paddingBottom: 20 }} 
      
      renderItem={({ item }) => {
        const isFav = favorites.includes(item.id);

        return (
          <TouchableOpacity 
            className="flex-row bg-primaryBackground rounded-3xl mb-5 overflow-hidden shadow-sm h-36 border border-secondaryBackground"
            activeOpacity={0.9}
            onPress={() => router.push({ pathname: "/RecipeDetails", params: { recipeData: JSON.stringify(item) } })}
          >
            
            {/* Left Side: Text Info */}
            <View className="flex-1 p-4 justify-between">
              
              {/* Top Row: Time/Type + Heart Button */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                    <View className="bg-secondaryBackground px-2 py-1 rounded-md">
                        <Text className="text-secondaryText text-xs font-bold">{item.time}</Text>
                    </View>
                    <Text className="text-secondaryText text-xs">{item.type}</Text>
                </View>
                
                {/* ❤️ UPDATED HEART BUTTON ❤️ */}
                <TouchableOpacity 
                  onPress={(e) => {
                    e.stopPropagation(); // Stop navigation when clicking heart
                    toggleFavorite(item.id);
                  }}
                  // Removing background and border as requested
                  className="w-8 h-8 items-center justify-center"
                >
                   {isFav ? (
                     // SAVED: Red Filled Heart
                     <Ionicons name="heart" size={20} color="#F44336" />
                   ) : (
                     // UNSAVED: White Body + Green Outline
                     <View className="items-center justify-center">
                        <Ionicons name="heart" size={20} color="white" style={{ position: 'absolute' }} />
                        <Ionicons name="heart-outline" size={20} color="#4CAF50" />
                     </View>
                   )}
                </TouchableOpacity>
              </View>

              <Text className="text-primaryText font-bodoni font-bold text-lg leading-5 pr-1" numberOfLines={2}>
                {item.title}
              </Text>

              <View className="flex-row items-center justify-between mt-1">
                <View className="bg-primary px-2 py-1 rounded-full flex-row items-center gap-1">
                   <Feather name="clock" size={10} color="white" />
                   <Text className="text-primaryBackground text-[10px] font-bold">{item.prepTime}</Text>
                </View>
                <Text className="text-secondaryText text-xs font-bold">{item.calories}</Text>
              </View>
            </View>

            {/* Right Side: Image */}
            <View className="w-32 h-full">
               <Image 
                 source={{ uri: item.image }} 
                 className="w-full h-full"
                 resizeMode="cover"
               />
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}