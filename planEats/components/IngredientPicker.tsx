import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import "../global.css";

// Mock Database 
const INGREDIENT_DATABASE = [
  { id: '1', name: 'Plain Flour', unit: 'g', calories: 364, image: 'https://img.icons8.com/color/96/flour.png' },
  { id: '2', name: 'Large Egg', unit: 'pcs', calories: 72, image: 'https://img.icons8.com/color/96/eggs.png' },
  { id: '3', name: 'Whole Milk', unit: 'ml', calories: 60, image: 'https://img.icons8.com/color/96/milk-bottle.png' },
  { id: '4', name: 'White Sugar', unit: 'g', calories: 387, image: 'https://img.icons8.com/color/96/sugar.png' },
  { id: '5', name: 'Butter', unit: 'g', calories: 717, image: 'https://img.icons8.com/color/96/butter.png' },
  { id: '6', name: 'Salt', unit: 'g', calories: 0, image: 'https://img.icons8.com/color/96/salt-shaker.png' },
];

export default function IngredientPicker({ isVisible, onClose, onAddIngredient, onCreateNew }: any) {
  const [search, setSearch] = useState('');
  
  // ✅ NEW: Reset search every time the modal becomes visible
  useEffect(() => {
    if (isVisible) {
      setSearch('');
    }
  }, [isVisible]);

  const filteredData = INGREDIENT_DATABASE.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-secondaryBackground h-[85%] rounded-t-[40px] overflow-hidden">
          
          {/* Header */}
          <View className="bg-primaryBackground px-6 py-6 rounded-b-[30px] shadow-sm z-10">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bodoni text-primaryText">Add Ingredient</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close-circle" size={30} color="#E0E0E0" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center bg-secondaryBackground px-4 py-3 rounded-full">
              <Ionicons name="search" size={20} color="#757575" />
              <TextInput 
                placeholder="Search ingredients..." 
                className="flex-1 ml-2 text-primaryText text-base"
                placeholderTextColor="#9E9E9E"
                value={search}
                onChangeText={setSearch}
                autoFocus={false} // Prevents keyboard from jumping up instantly if you prefer
              />
              {/* Optional: Clear button inside the bar */}
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={18} color="#C0C0C0" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* List */}
          <FlatList 
            data={filteredData}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
            
            renderItem={({ item }) => (
              <View className="flex-row items-center bg-white p-4 mb-3 rounded-2xl shadow-sm">
                <Image source={{ uri: item.image }} className="w-12 h-12 rounded-lg bg-gray-50" resizeMode="contain" />
                <View className="flex-1 ml-4">
                  <Text className="text-lg font-bold text-primaryText">{item.name}</Text>
                  <Text className="text-secondaryText text-sm">{item.calories} kcal / 100{item.unit}</Text>
                </View>
                <TouchableOpacity 
                  className="bg-primary w-10 h-10 rounded-full items-center justify-center shadow-md"
                  onPress={() => onAddIngredient(item)}
                >
                  <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
              </View>
            )}

            ListFooterComponent={() => {
              if (search.length === 0) return null;

              return (
                <View className="items-center mt-6 mb-10">
                  <Text className="text-secondaryText mb-2">Can&apos;t find exactly &quot;{search}&quot;?</Text>
                  <TouchableOpacity 
                    className="bg-secondary px-6 py-3 rounded-full shadow-lg flex-row items-center"
                    onPress={() => onCreateNew(search)} 
                  >
                    <Ionicons name="add-circle-outline" size={20} color="white" style={{ marginRight: 8 }}/>
                    <Text className="text-white font-bold">+ Create &quot;{search}&quot;</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}