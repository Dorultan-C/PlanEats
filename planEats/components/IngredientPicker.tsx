import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import "../global.css";

// Note: We REMOVED the hardcoded INGREDIENT_DATABASE here.
// We now receive data via the 'availableIngredients' prop.

export default function IngredientPicker({ isVisible, onClose, onAddIngredient, onCreateNew, availableIngredients = [] }: any) {
  const [search, setSearch] = useState('');
  
  // Reset search when opening
  useEffect(() => {
    if (isVisible) setSearch('');
  }, [isVisible]);

  // Filter the list passed from the parent
  const filteredData = availableIngredients.filter((i: any) => 
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
                placeholder="Search pantry..." 
                className="flex-1 ml-2 text-primaryText text-base"
                placeholderTextColor="#9E9E9E"
                value={search}
                onChangeText={setSearch}
                autoFocus={false} 
              />
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
                <Image source={{ uri: item.image || 'https://img.icons8.com/color/96/ingredients.png' }} className="w-12 h-12 rounded-lg bg-gray-50" resizeMode="contain" />
                <View className="flex-1 ml-4">
                  <Text className="text-lg font-bold text-primaryText">{item.name}</Text>
                  {/* Show calories if we have them, otherwise just the name */}
                  <Text className="text-secondaryText text-sm">
                     {item.calories ? `${item.calories} kcal` : 'No info'}
                  </Text>
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