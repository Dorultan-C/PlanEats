import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  Modal,
  LogBox // <--- Import LogBox to silence warnings
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'; 
import IngredientPicker from '../components/IngredientPicker'; 
import "../global.css";

// --- SILENCE WARNINGS ---
// This hides the misleading "MediaTypeOptions" warning from Expo
LogBox.ignoreLogs(["MediaTypeOptions' have been deprecated"]);

export default function CreateRecipe() {
  const navigation = useNavigation();
  
  // --- STATE ---
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null); 
  const [modalVisible, setModalVisible] = useState(false);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [steps, setSteps] = useState<any[]>([
    { id: '1', title: '', description: '', timers: [], image: null } 
  ]);
  const [totalCalories, setTotalCalories] = useState(0); 

  // --- NEW STATE FOR IMAGE CONFIRMATION ---
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [tempImage, setTempImage] = useState<{ uri: string, target: 'cover' | 'step', stepId?: string } | null>(null);

  // --- LOGIC: Auto-Calculate Calories ---
  useEffect(() => {
    let sum = 0;
    ingredients.forEach((ing) => {
      const qty = parseFloat(ing.quantity); 
      const cals = parseFloat(ing.calories); 
      if (!isNaN(qty) && !isNaN(cals)) {
        if (ing.unit === 'pcs') sum += qty * cals; 
        else sum += (qty / 100) * cals; 
      }
    });
    setTotalCalories(Math.round(sum)); 
  }, [ingredients]); 

  // --- LOGIC: Image Picker (FIXED) ---
  const pickImage = async (target: 'cover' | 'step', stepId?: string) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to photos.");
      return;
    }

    // 1. Launch Picker with the SAFE option
    const result = await ImagePicker.launchImageLibraryAsync({
      // ✅ We revert to MediaTypeOptions because MediaType is not defined in your version
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing: true, 
      aspect: [4, 3],
      quality: 1,
    });

    // 2. If successful, open the confirmation modal
    if (!result.canceled) {
      setTempImage({ uri: result.assets[0].uri, target, stepId });
      setConfirmationModalVisible(true);
    }
  };

  // --- HANDLER: Confirm the Image ---
  const handleConfirmImage = () => {
    if (!tempImage) return;

    if (tempImage.target === 'cover') {
      setCoverImage(tempImage.uri);
    } else if (tempImage.target === 'step' && tempImage.stepId) {
      const updatedSteps = steps.map(step => 
        step.id === tempImage.stepId ? { ...step, image: tempImage.uri } : step
      );
      setSteps(updatedSteps);
    }
    // Close modal and reset temp state
    setConfirmationModalVisible(false);
    setTempImage(null);
  };

  // --- HANDLER: Re-open Cropper/Picker ---
  const handleCropAgain = async () => {
    if (!tempImage) return;
    setConfirmationModalVisible(false);
    // Re-launch picker immediately
    setTimeout(() => {
        pickImage(tempImage.target, tempImage.stepId);
    }, 500); 
  };


  // --- HANDLERS: Ingredients ---
  const handleAddIngredient = (ingredient: any) => {
    if (ingredients.find(i => i.id === ingredient.id)) return;
    setIngredients([...ingredients, { ...ingredient, quantity: '' }]); 
    setModalVisible(false);
  };

  const handleCreateNew = (name: string) => {
    const newIngredient = {
      id: Date.now().toString(),
      name: name || "New Ingredient",
      image: 'https://img.icons8.com/color/96/ingredients.png', 
      calories: 0, 
      unit: 'g',
      quantity: '' 
    };
    setIngredients([...ingredients, newIngredient]);
    setModalVisible(false);
  };

  const updateQuantity = (id: string, text: string) => {
    setIngredients(ingredients.map(ing => ing.id === id ? { ...ing, quantity: text } : ing));
  };

  const updateCalories = (id: string, text: string) => {
    setIngredients(ingredients.map(ing => ing.id === id ? { ...ing, calories: text } : ing));
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  // --- HANDLERS: Steps ---
  const addStep = () => {
    const newStep = { id: Date.now().toString(), title: '', description: '', timers: [], image: null };
    setSteps([...steps, newStep]);
  };
  const updateStepText = (id: string, field: 'title' | 'description', text: string) => {
    const updated = steps.map(step => step.id === id ? { ...step, [field]: text } : step);
    setSteps(updated);
  };
  const addTimerToStep = (stepId: string) => {
    const updated = steps.map(step => {
      if (step.id === stepId && step.timers.length < 3) return { ...step, timers: [...step.timers, ''] };
      return step;
    });
    setSteps(updated);
  };
  const updateTimerValue = (stepId: string, timerIndex: number, text: string) => {
    const updated = steps.map(step => {
      if (step.id === stepId) {
        const newTimers = [...step.timers];
        newTimers[timerIndex] = text;
        return { ...step, timers: newTimers };
      }
      return step;
    });
    setSteps(updated);
  };
  const removeTimer = (stepId: string, timerIndex: number) => {
    const updated = steps.map(step => {
      if (step.id === stepId) {
        const newTimers = step.timers.filter((_, i) => i !== timerIndex);
        return { ...step, timers: newTimers };
      }
      return step;
    });
    setSteps(updated);
  };
  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const handleSaveRecipe = () => {
    if (!title || ingredients.length === 0) {
      Alert.alert("Missing Info", "Please add a title and at least one ingredient.");
      return;
    }
    const recipeData = {
      title: title,
      cover_image: coverImage,
      total_calories: totalCalories,
      ingredients: ingredients,
      steps: steps.map((s, index) => ({
        step_number: index + 1,
        title: s.title,
        description: s.description,
        image: s.image,
        timers: s.timers.map((t: string) => parseFloat(t) || 0).filter((t: number) => t > 0)
      }))
    };
    console.log("FINAL JSON:", JSON.stringify(recipeData, null, 2));
    Alert.alert("Success", "Recipe saved! (Check Console)");
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View className="flex-1 bg-secondaryBackground">
        <SafeAreaView className="flex-1">
          
          {/* Header */}
          <View className="flex-row items-center px-6 py-4 bg-primaryBackground shadow-sm rounded-b-[30px] z-10">
            <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-secondaryBackground rounded-full">
              <Ionicons name="arrow-back" size={24} color="#212121" />
            </TouchableOpacity>
            <Text className="text-xl font-bodoni ml-4 text-primaryText">New Recipe</Text>
          </View>

          <ScrollView 
            className="px-6 mt-6" 
            contentContainerStyle={{ paddingBottom: 50 }} 
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            
            {/* Cover Photo */}
            <TouchableOpacity 
              className="w-full h-48 bg-gray-200 rounded-2xl items-center justify-center border-2 border-dashed border-gray-400 mb-6 overflow-hidden"
              onPress={() => pickImage('cover')}
            >
              {coverImage ? (
                <Image source={{ uri: coverImage }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <>
                  <Ionicons name="camera" size={40} color="gray" />
                  <Text className="text-secondaryText mt-2">Tap to upload cover</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Title */}
            <Text className="text-primaryText font-bold mb-2 ml-1">Recipe Title</Text>
            <TextInput 
              className="bg-white p-4 rounded-xl text-primaryText mb-6 shadow-sm"
              placeholder="e.g. Blueberry Pancakes"
              value={title}
              onChangeText={setTitle}
            />

            {/* Calories */}
            <View className="bg-primary/10 p-4 rounded-xl mb-6 border border-primary/20 flex-row justify-between items-center">
              <View>
                <Text className="text-primary font-bold text-lg">Total Calories</Text>
                <Text className="text-secondaryText text-xs">Auto-calculated</Text>
              </View>
              <Text className="text-3xl font-bodoni text-primary">
                {totalCalories} <Text className="text-base font-normal">kcal</Text>
              </Text>
            </View>

            {/* Ingredients */}
            <Text className="text-primaryText font-bold mb-2 ml-1">Ingredients</Text>
            {ingredients.map((ing) => (
              <View key={ing.id} className="flex-row items-center justify-between bg-white p-3 mb-2 rounded-xl shadow-sm">
                <View className="flex-row items-center flex-1">
                  <Image source={{ uri: ing.image }} className="w-8 h-8 rounded bg-gray-50 mr-3" />
                  <View>
                    <Text className="font-bold text-primaryText text-base">{ing.name}</Text>
                    <View className="flex-row items-center mt-1">
                      <TextInput 
                        className="text-xs text-primary font-bold border-b border-gray-200 min-w-[20px] text-center"
                        keyboardType="numeric"
                        placeholder="0"
                        value={String(ing.calories)}
                        onChangeText={(text) => updateCalories(ing.id, text)}
                      />
                      <Text className="text-xs text-secondaryText ml-1">kcal / 100{ing.unit}</Text>
                    </View>
                  </View>
                </View>
                <View className="flex-row items-center bg-secondaryBackground rounded-lg px-2 py-1 mr-3 border border-gray-200">
                  <TextInput 
                    className="w-12 text-center text-primaryText font-bold p-1"
                    placeholder="0"
                    keyboardType="numeric"
                    value={ing.quantity}
                    onChangeText={(text) => updateQuantity(ing.id, text)}
                  />
                  <Text className="text-secondaryText text-xs ml-1 mr-1">{ing.unit}</Text>
                </View>
                <TouchableOpacity onPress={() => removeIngredient(ing.id)} className="p-2">
                  <Ionicons name="trash-outline" size={20} color="#F44336" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity 
              className="flex-row items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-2 mb-8"
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add-circle" size={24} color="#4CAF50" />
              <Text className="ml-2 text-secondaryText font-medium">Add Ingredient</Text>
            </TouchableOpacity>


            {/* Cooking Steps */}
            <Text className="text-primaryText font-bold mb-2 ml-1">Cooking Steps</Text>
            {steps.map((step, index) => (
              <View key={step.id} className="bg-white p-5 mb-4 rounded-2xl shadow-sm border border-gray-100">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-xl font-bodoni text-primaryText">Step {index + 1}</Text>
                  <TouchableOpacity onPress={() => removeStep(step.id)}>
                    <Ionicons name="close-circle-outline" size={24} color="#E0E0E0" />
                  </TouchableOpacity>
                </View>
                <Text className="text-xs text-secondaryText font-bold uppercase mb-1">Title</Text>
                <TextInput 
                  className="font-bold text-lg text-primaryText mb-4 border-b border-gray-200 pb-2"
                  placeholder="e.g. Mix Dry Ingredients"
                  value={step.title}
                  onChangeText={(text) => updateStepText(step.id, 'title', text)}
                />
                <TouchableOpacity 
                  className="h-40 bg-secondaryBackground rounded-xl items-center justify-center border border-dashed border-gray-300 overflow-hidden mb-4"
                  onPress={() => pickImage('step', step.id)}
                >
                  {step.image ? (
                    <Image source={{ uri: step.image }} className="w-full h-full" resizeMode="cover" />
                  ) : (
                    <View className="items-center">
                      <Ionicons name="image-outline" size={28} color="gray" />
                      <Text className="text-xs text-secondaryText mt-1">Upload Visual</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <Text className="text-xs text-secondaryText font-bold uppercase mb-1">Instructions</Text>
                <TextInput 
                  className="text-secondaryText text-base bg-secondaryBackground p-3 rounded-xl min-h-[80px]"
                  placeholder="In a large bowl, whisk together the flour..."
                  multiline
                  textAlignVertical="top"
                  value={step.description}
                  onChangeText={(text) => updateStepText(step.id, 'description', text)}
                />
                <View className="mt-4">
                  <Text className="text-xs text-secondaryText font-bold uppercase mb-2">Timers (Optional)</Text>
                  {step.timers.map((timerValue: string, tIndex: number) => (
                    <View key={tIndex} className="flex-row items-center mb-2">
                       <View className="bg-green-50 p-2 rounded-lg mr-2">
                          <Ionicons name="timer-outline" size={20} color="#4CAF50" />
                       </View>
                       <TextInput
                         placeholder="0"
                         keyboardType="numeric"
                         className="bg-secondaryBackground px-4 py-2 rounded-lg font-bold text-primaryText min-w-[60px] text-center"
                         value={timerValue}
                         onChangeText={(text) => updateTimerValue(step.id, tIndex, text)}
                       />
                       <Text className="ml-2 text-secondaryText font-medium flex-1">Minutes</Text>
                       <TouchableOpacity onPress={() => removeTimer(step.id, tIndex)} className="p-2">
                          <Ionicons name="trash-outline" size={18} color="#E57373" />
                       </TouchableOpacity>
                    </View>
                  ))}
                  {step.timers.length < 3 && (
                    <TouchableOpacity 
                      className="flex-row items-center bg-secondaryBackground self-start px-3 py-2 rounded-lg mt-1"
                      onPress={() => addTimerToStep(step.id)}
                    >
                      <Ionicons name="add" size={16} color="#4CAF50" />
                      <Text className="text-primary font-bold ml-1 text-xs">Add Timer</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
            <TouchableOpacity 
              className="flex-row items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-2"
              onPress={addStep}
            >
              <Ionicons name="add" size={24} color="#2196F3" />
              <Text className="ml-2 text-secondaryText font-medium">Add Next Step</Text>
            </TouchableOpacity>

            {/* Save Button */}
            <View className="mt-8 mb-6">
              <TouchableOpacity 
                className="w-full bg-primary py-4 rounded-full items-center shadow-lg"
                onPress={handleSaveRecipe}
              >
                <Text className="text-white font-bold text-lg">Save Recipe</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>

          {/* Ingredient Picker Modal */}
          <IngredientPicker 
            isVisible={modalVisible} 
            onClose={() => setModalVisible(false)}
            onAddIngredient={handleAddIngredient}
            onCreateNew={handleCreateNew} 
          />

          {/* Image Confirmation Modal */}
          <Modal animationType="slide" transparent={false} visible={confirmationModalVisible}>
            <SafeAreaView className="flex-1 bg-primaryBackground">
              <View className="flex-1 relative">
                
                {/* Top Bar */}
                <View className="flex-row justify-between items-center px-6 py-4 z-10 absolute top-0 left-0 right-0 bg-black/20">
                   <TouchableOpacity 
                      onPress={() => {
                        setConfirmationModalVisible(false);
                        setTempImage(null);
                      }}
                      className="p-2 bg-black/40 rounded-full"
                    >
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCropAgain} className="p-2 bg-black/40 rounded-full">
                    <Ionicons name="crop" size={24} color="white" />
                  </TouchableOpacity>
                </View>
                
                {/* Image Preview */}
                {tempImage && (
                  <Image source={{ uri: tempImage.uri }} className="w-full h-full" resizeMode="contain" />
                )}

                {/* Bottom Action Bar */}
                <View className="absolute bottom-0 left-0 right-0 p-6 bg-white rounded-t-[30px] shadow-lg">
                  <View className="flex-row justify-between items-center">
                    <TouchableOpacity 
                      onPress={handleCropAgain}
                      className="flex-row items-center justify-center bg-secondaryBackground py-4 px-6 rounded-full mr-4"
                    >
                      <Ionicons name="crop-outline" size={20} color="#757575" style={{marginRight: 8}} />
                      <Text className="text-secondaryText font-bold">Crop / Retake</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={handleConfirmImage}
                      className="flex-1 bg-primary py-4 rounded-full items-center shadow-lg"
                    >
                      <Text className="text-white font-bold text-lg">Confirm</Text>
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
            </SafeAreaView>
          </Modal>

        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}