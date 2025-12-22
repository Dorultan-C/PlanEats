import React, { useState, useRef, useMemo } from 'react';
import { 
  View, Text, Image, TouchableOpacity, ScrollView, Alert, FlatList, Dimensions, StatusBar 
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import "../global.css";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CAROUSEL_HEIGHT = SCREEN_HEIGHT * 0.5;
const FALLBACK_IMAGE = "https://placehold.co/600x400/png?text=No+Image";

// --- HELPER: Fix Firebase URLs ---
// Converts "recipes/image.jpg" -> "recipes%2Fimage.jpg"
const getCleanImageUrl = (url: string | null | undefined) => {
  if (!url || typeof url !== 'string') return null;

  // 1. Check if it's a Firebase Storage URL
  if (url.includes("firebasestorage.googleapis.com") && url.includes("/o/")) {
    try {
      // Split the URL into base (before query params) and query params
      const [baseUrl, queryString] = url.split("?");
      
      // Find where the object path starts (after "/o/")
      const pathStartIndex = baseUrl.indexOf("/o/") + 3;
      const host = baseUrl.substring(0, pathStartIndex);
      const rawPath = baseUrl.substring(pathStartIndex);

      // Encode the path (specifically replacing slashes)
      // We only encode slashes that haven't been encoded yet
      const encodedPath = rawPath.replace(/\//g, "%2F");

      return `${host}${encodedPath}${queryString ? `?${queryString}` : ''}`;
    } catch (e) {
      console.warn("Failed to sanitize Firebase URL:", url);
      return url; // Return original if parsing fails
    }
  }

  // 2. Handle local files (missing file:// prefix)
  if (!url.startsWith('http') && !url.startsWith('file://') && !url.startsWith('data:')) {
    return `file://${url}`;
  }

  return url;
};

export default function RecipeDetails() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  
  // Parse Recipe
  const recipe = useMemo(() => {
    try {
      return params.recipeData ? JSON.parse(params.recipeData as string) : null;
    } catch (e) {
      console.error("Failed to parse recipe:", e);
      return null;
    }
  }, [params.recipeData]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<{[key: number]: boolean}>({});

  // --- PREPARE IMAGES ---
  const recipeImages = useMemo(() => {
    if (!recipe) return [FALLBACK_IMAGE];
    
    // Collect all potential image sources
    const rawImages = [
      recipe.image, 
      ...(recipe.steps?.map((s: any) => s.image) || [])
    ];

    // Clean and Filter
    const validUrls = rawImages
      .map(url => getCleanImageUrl(url)) // Apply the Firebase Fix
      .filter((url): url is string => !!url && url.length > 5);

    return validUrls.length > 0 ? validUrls : [FALLBACK_IMAGE];
  }, [recipe]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveImageIndex(viewableItems[0].index || 0);
    }
  }).current;

  // Toggle Checkboxes
  const toggleIngredient = (index: number) => {
    setCheckedIngredients(prev => ({ ...prev, [index]: !prev[index] }));
  };

  if (!recipe) return <View className="flex-1 justify-center items-center"><Text>Loading...</Text></View>;

  return (
    <View className="flex-1 bg-secondaryBackground">
      <StatusBar barStyle="light-content" />
      
      {/* CAROUSEL HEADER */}
      <View style={{ height: CAROUSEL_HEIGHT, backgroundColor: '#1a1a1a' }}>
        <FlatList
          data={recipeImages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          onViewableItemsChanged={onViewableItemsChanged}
          renderItem={({ item }) => (
            <View style={{ width: SCREEN_WIDTH, height: CAROUSEL_HEIGHT }}>
              <Image 
                source={{ uri: item }} 
                style={{ width: SCREEN_WIDTH, height: CAROUSEL_HEIGHT }}
                resizeMode="cover"
              />
            </View>
          )}
        />
        
        {/* Nav Buttons */}
        <SafeAreaView className="absolute top-0 w-full flex-row justify-between px-6 z-10 pointer-events-box-none">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full items-center justify-center">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full items-center justify-center">
            <Ionicons name="heart-outline" size={24} color="white" />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Counter Badge */}
        {recipeImages.length > 1 && (
          <View className="absolute bottom-12 left-6 bg-black/50 px-3 py-1 rounded-full z-10">
            <Text className="text-white text-xs font-bold">{activeImageIndex + 1} / {recipeImages.length}</Text>
          </View>
        )}
      </View>

      {/* DETAILS CARD */}
      <View className="flex-1 bg-white -mt-8 rounded-t-[40px] px-6 pt-8 shadow-2xl overflow-hidden">
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          
          <View className="flex-row justify-between items-start mb-2">
            <TouchableOpacity className="p-2">
               {/* Placeholder for alignment */}
            </TouchableOpacity>
            <View className="items-center flex-1 mx-2">
              <Text className="text-2xl font-bodoni text-primaryText text-center mb-1">{recipe.title}</Text>
              <View className="flex-row items-center space-x-4 mt-1">
                <View className="bg-green-100 px-3 py-1 rounded-full flex-row items-center">
                   <Ionicons name="time-outline" size={14} color="#4CAF50" style={{marginRight:4}} />
                   <Text className="text-green-700 text-xs font-bold">{recipe.prepTime || "20 min"}</Text>
                </View>
                {recipe.calories && (
                  <Text className="text-secondaryText text-sm font-medium">{recipe.calories}</Text>
                )}
              </View>
            </View>
             <TouchableOpacity className="p-2">
               <Ionicons name="share-outline" size={24} color="#757575" />
            </TouchableOpacity>
          </View>
          
          <View className="h-[1px] bg-gray-100 my-4" />

          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-primaryText font-bodoni text-lg">{recipe.ingredients?.length || 0} Ingredients</Text>
            <TouchableOpacity className="bg-primary px-6 py-3 rounded-full shadow-md">
              <Text className="text-white font-bold">Start now</Text>
            </TouchableOpacity>
          </View>

          {/* Ingredients */}
          <View>
            {recipe.ingredients?.map((ing: any, index: number) => (
              <TouchableOpacity key={index} onPress={() => toggleIngredient(index)} className="flex-row items-center mb-4">
                <View className={`w-6 h-6 rounded border ${checkedIngredients[index] ? 'bg-primary border-primary' : 'border-gray-400'} items-center justify-center mr-4`}>
                  {checkedIngredients[index] && <Ionicons name="checkmark" size={16} color="white" />}
                </View>
                <Text className={`text-base flex-1 ${checkedIngredients[index] ? 'text-gray-400 line-through' : 'text-primaryText'}`}>
                  <Text className="font-bold">{ing.quantity}{ing.unit} </Text>{ing.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}