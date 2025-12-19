import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import "../global.css";

// Define what the data looks like
type DateItem = {
  id: string;
  day: string;
  weekday: string;
};

// Define what props this component accepts
type DateCarouselProps = {
  dates: DateItem[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function DateCarousel({ dates, selectedId, onSelect }: DateCarouselProps) {
  return (
    <View>
      <FlatList
        data={dates}
        horizontal
        showsHorizontalScrollIndicator={false}
        // FIX: Added 'justifyContent: center' and 'flexGrow: 1'
        // This forces the items to sit in the middle of the screen
        contentContainerStyle={{ 
            paddingHorizontal: 20, 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexGrow: 1 
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isActive = item.id === selectedId;
          return (
            <TouchableOpacity 
              onPress={() => onSelect(item.id)}
              className={`items-center justify-center w-16 h-20 mx-2 rounded-3xl ${isActive ? 'bg-primary shadow-lg scale-110' : 'bg-transparent'}`}
            >
              <Text className={`text-xs mb-1 font-bodoni ${isActive ? 'text-primaryBackground' : 'text-secondaryText'}`}>
                {item.weekday}
              </Text>
              <Text className={`text-2xl font-bold font-bodoni ${isActive ? 'text-primaryBackground' : 'text-gray-300'}`}>
                {item.day}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}