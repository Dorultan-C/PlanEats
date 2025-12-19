import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
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
  return (
    <ScrollView 
      className="flex-1 px-5 pt-6 w-full max-w-xl self-center" // FIX: Centered & Max Width for Web
      contentContainerStyle={{ paddingBottom: 120 }} 
      showsVerticalScrollIndicator={false}
    >
      {meals.map((meal) => (
        <View key={meal.id} className="flex-row bg-primaryBackground rounded-3xl mb-5 overflow-hidden shadow-sm h-36 border border-secondaryBackground">
          
          {/* Left Side: Text Info */}
          <View className="flex-1 p-4 justify-between">
            
            {/* Top Row: Time & Checkbox */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                  <View className="bg-secondaryBackground px-2 py-1 rounded-md">
                      <Text className="text-secondaryText text-xs font-bold">{meal.time}</Text>
                  </View>
                  <Text className="text-secondaryText text-xs">{meal.type}</Text>
              </View>
              {/* Checkbox Circle */}
              <TouchableOpacity className="w-5 h-5 rounded-full border-2 border-primary" />
            </View>

            {/* Meal Title */}
            <Text className="text-primaryText font-bodoni font-bold text-lg leading-5 pr-1" numberOfLines={2}>
              {meal.title}
            </Text>

            {/* Bottom Row: Prep Time & Calories */}
            <View className="flex-row items-center justify-between mt-1">
              <View className="bg-primary px-2 py-1 rounded-full flex-row items-center gap-1">
                 <Feather name="clock" size={10} color="white" />
                 <Text className="text-primaryBackground text-[10px] font-bold">{meal.prepTime}</Text>
              </View>
              <Text className="text-secondaryText text-xs font-bold">{meal.calories}</Text>
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
  );
}