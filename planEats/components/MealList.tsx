import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
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
    <FlatList 
      data={meals}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      className="flex-1 w-full max-w-xl self-center px-5 pt-6"
      
      // FIX 1: Add Margin to the bottom of the list container
      // The MenuBar is ~160px tall including its bottom spacing. 
      // We reserve this space so the list physically ends above it.
      style={{ marginBottom: 100 }}

      // FIX 2: Reset Padding
      // Since we aren't scrolling *behind* the bar anymore, we don't need huge padding.
      contentContainerStyle={{ paddingBottom: 20 }} 
      
      renderItem={({ item }) => (
        <View className="flex-row bg-primaryBackground rounded-3xl mb-5 overflow-hidden shadow-sm h-36 border border-secondaryBackground">
          
          {/* Left Side: Text Info */}
          <View className="flex-1 p-4 justify-between">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                  <View className="bg-secondaryBackground px-2 py-1 rounded-md">
                      <Text className="text-secondaryText text-xs font-bold">{item.time}</Text>
                  </View>
                  <Text className="text-secondaryText text-xs">{item.type}</Text>
              </View>
              <TouchableOpacity className="w-5 h-5 rounded-full border-2 border-primary" />
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
        </View>
      )}
    />
  );
}