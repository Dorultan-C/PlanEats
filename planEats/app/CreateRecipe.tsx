import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, 
  KeyboardAvoidingView, Platform, Modal, ActivityIndicator, LogBox 
} from 'react-native';
// 1. Updated Imports: Added useSafeAreaInsets
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'; 
import * as FileSystem from 'expo-file-system';
import IngredientPicker from '../components/IngredientPicker'; 
import "../global.css";

// --- FIREBASE IMPORTS ---
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig'; 

LogBox.ignoreLogs(["MediaTypeOptions"]);

// --- CONSTANTS ---
const MEAL_BASES = [
  "Beef", "Pork", "Poultry", "Fish", "Seafood", 
  "Beans & Legumes", "Vegetarian", "Vegan", "Halal", "Kosher", "Gluten Free"
];

const MEAL_CATEGORIES = ["Breakfast", "Brunch", "Lunch", "Dinner", "Snack", "Dessert"];

const ALLERGENS = [
  { id: 'gluten', name: 'Gluten', icon: 'https://img.icons8.com/color/96/bread.png' },
  { id: 'crustaceans', name: 'Crustaceans', icon: 'https://img.icons8.com/color/96/prawn.png' },
  { id: 'eggs', name: 'Eggs', icon: 'https://img.icons8.com/color/96/eggs.png' },
  { id: 'fish', name: 'Fish', icon: 'https://img.icons8.com/color/96/whole-fish.png' },
  { id: 'peanuts', name: 'Peanuts', icon: 'https://img.icons8.com/color/96/peanuts.png' },
  { id: 'soy', name: 'Soy', icon: 'https://img.icons8.com/color/96/soy.png' },
  { id: 'milk', name: 'Milk', icon: 'https://img.icons8.com/color/96/milk-bottle.png' },
  { id: 'nuts', name: 'Tree Nuts', icon: 'https://img.icons8.com/color/96/hazelnut.png' },
  { id: 'celery', name: 'Celery', icon: 'https://img.icons8.com/color/96/celery.png' },
  { id: 'mustard', name: 'Mustard', icon: 'https://img.icons8.com/color/96/mustard.png' },
  { id: 'sesame', name: 'Sesame', icon: 'https://img.icons8.com/color/96/sesame.png' },
  { id: 'sulphites', name: 'Sulphites', icon: 'https://img.icons8.com/color/96/wine-glass.png' },
  { id: 'lupin', name: 'Lupin', icon: 'https://img.icons8.com/color/96/flower.png' },
  { id: 'molluscs', name: 'Molluscs', icon: 'https://img.icons8.com/color/96/mussel.png' },
];

export default function CreateRecipe() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); 
  
  // 2. Initialize Insets Hook
  const insets = useSafeAreaInsets();

  // --- MASTER INGREDIENT LIST ---
  const [masterIngredients, setMasterIngredients] = useState<any[]>([]);
  
  // --- CORE DATA ---
  const [title, setTitle] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null); 
  const [totalCalories, setTotalCalories] = useState(0); 
  
  // --- METADATA ---
  const [servings, setServings] = useState(2);
  const [selectedMealBases, setSelectedMealBases] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState('');
  const [winePairing, setWinePairing] = useState('');
  const [notes, setNotes] = useState('');
  
  // --- EQUIPMENT ---
  const [equipmentInput, setEquipmentInput] = useState('');
  const [equipmentList, setEquipmentList] = useState<string[]>([]);

  // --- INGREDIENTS & STEPS ---
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [steps, setSteps] = useState<any[]>([
    { id: '1', title: '', description: '', timers: [], image: null } 
  ]);

  // --- MODAL STATES ---
  const [pickerVisible, setPickerVisible] = useState(false);
  const [ingredientConfigModalVisible, setIngredientConfigModalVisible] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState<any>(null); 
  const [allergenModalVisible, setAllergenModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [tempImage, setTempImage] = useState<{ uri: string, target: 'cover' | 'step', stepId?: string } | null>(null);

  // --- FETCH MASTER INGREDIENTS ---
  useEffect(() => {
    const fetchMasterIngredients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ingredients"));
        const fetchedList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        if (fetchedList.length > 0) setMasterIngredients(fetchedList);
      } catch (e) {
        console.error("Error fetching ingredients:", e);
      }
    };
    fetchMasterIngredients();
  }, []);

  // --- CALCULATE CALORIES ---
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

  // --- HANDLERS ---
  const toggleMealBase = (base: string) => {
    if (selectedMealBases.includes(base)) {
      setSelectedMealBases(selectedMealBases.filter(b => b !== base));
    } else {
      setSelectedMealBases([...selectedMealBases, base]);
    }
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const adjustServings = (delta: number) => {
    setServings(prev => Math.max(1, prev + delta));
  };

  const handleSelectFromPicker = (ingredient: any) => {
    if (ingredients.find(i => i.id === ingredient.id)) { Alert.alert("Already Added", "This ingredient is already in your list."); return; }
    setCurrentIngredient({ ...ingredient, quantity: '', calories: ingredient.calories || '', allergens: ingredient.allergens || [], isNew: false });
    setPickerVisible(false); setTimeout(() => setIngredientConfigModalVisible(true), 300);
  };

  const handleCreateNewIngredient = (name: string) => {
    setCurrentIngredient({ id: `custom_${Date.now()}`, name, image: 'https://img.icons8.com/color/96/ingredients.png', unit: 'g', quantity: '', calories: '', allergens: [], isNew: true });
    setPickerVisible(false); setTimeout(() => setIngredientConfigModalVisible(true), 300);
  };

  const confirmAddIngredient = async () => {
    if (!currentIngredient?.quantity) { Alert.alert("Quantity Missing", "Please enter a quantity."); return; }
    setIngredients([...ingredients, currentIngredient]);
    if (currentIngredient.isNew) {
        try { const { isNew, quantity, ...ingredientData } = currentIngredient; await addDoc(collection(db, "ingredients"), ingredientData); setMasterIngredients([...masterIngredients, ingredientData]); } catch (e) { console.error("Failed to save new ingredient globally", e); }
    }
    setIngredientConfigModalVisible(false); setCurrentIngredient(null);
  };

  const toggleAllergen = (allergenId: string) => {
    if (!currentIngredient) return;
    const currentList = currentIngredient.allergens || [];
    setCurrentIngredient({ ...currentIngredient, allergens: currentList.includes(allergenId) ? currentList.filter((id: string) => id !== allergenId) : [...currentList, allergenId] });
  };

  const removeIngredient = (id: string) => setIngredients(ingredients.filter(i => i.id !== id));
  
  const addEquipment = () => { if (equipmentInput.trim().length > 0) { setEquipmentList([...equipmentList, equipmentInput.trim()]); setEquipmentInput(''); } };
  const removeEquipment = (index: number) => setEquipmentList(equipmentList.filter((_, i) => i !== index));

  const uploadImageToFirebase = async (uri: string) => {
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
    const filename = `recipes/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const storageRef = ref(storage, filename);
    await uploadString(storageRef, base64, 'base64', { contentType: 'image/jpeg' });
    return await getDownloadURL(storageRef);
  };

  const pickImage = async (target: 'cover' | 'step', stepId?: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.7 });
    if (!result.canceled) { setTempImage({ uri: result.assets[0].uri, target, stepId }); setConfirmationModalVisible(true); }
  };

  const handleConfirmImage = () => {
    if (!tempImage) return;
    if (tempImage.target === 'cover') setCoverImage(tempImage.uri);
    else if (tempImage.target === 'step' && tempImage.stepId) { const updatedSteps = steps.map(step => step.id === tempImage.stepId ? { ...step, image: tempImage.uri } : step); setSteps(updatedSteps); }
    setConfirmationModalVisible(false); setTempImage(null);
  };

  const handleCropAgain = async () => { if (!tempImage) return; setConfirmationModalVisible(false); setTimeout(() => pickImage(tempImage.target, tempImage.stepId), 500); };
  
  const addStep = () => setSteps([...steps, { id: Date.now().toString(), title: '', description: '', timers: [], image: null }]);
  const updateStepText = (id: string, field: 'title' | 'description', text: string) => setSteps(steps.map(step => step.id === id ? { ...step, [field]: text } : step));
  const removeStep = (id: string) => setSteps(steps.filter(step => step.id !== id));

  const handleSaveRecipe = async () => {
    if (!title || ingredients.length === 0 || !prepTime) {
      Alert.alert("Missing Info", "Title, Ingredients, and Prep Time are required.");
      return;
    }
    setLoading(true); 
    try {
      let remoteCoverUrl = null;
      if (coverImage) remoteCoverUrl = await uploadImageToFirebase(coverImage);

      const updatedSteps = await Promise.all(steps.map(async (step) => {
        let remoteStepUrl = null;
        if (step.image) remoteStepUrl = await uploadImageToFirebase(step.image);
        return {
          step_number: parseInt(step.id),
          title: step.title,
          description: step.description,
          image: remoteStepUrl, 
          timers: step.timers.map((t: string) => parseFloat(t) || 0).filter((t: number) => t > 0)
        };
      }));

      const recipeData = {
        title,
        prep_time: prepTime,
        cover_image: remoteCoverUrl,
        total_calories: totalCalories,
        created_at: new Date(),
        servings,
        meal_bases: selectedMealBases, 
        categories: selectedCategories,
        cuisine,
        equipment: equipmentList,
        notes,
        wine_pairing: winePairing,
        ingredients: ingredients.map(ing => ({
           name: ing.name,
           quantity: parseFloat(ing.quantity) || 0,
           unit: ing.unit,
           calories_per_100: parseFloat(ing.calories) || 0,
           allergens: ing.allergens || []
        })),
        steps: updatedSteps
      };

      await addDoc(collection(db, "recipes"), recipeData);
      setLoading(false);
      Alert.alert("Success!", "Recipe saved fully!", [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch (error: any) {
      setLoading(false);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View className="flex-1 bg-secondaryBackground">
        {/* 3. Removed the <SafeAreaView> Wrapper that was here */}
          
          {/* Header with Custom Padding */}
          <View 
            className="flex-row items-center px-6 pb-4 bg-primaryBackground shadow-sm rounded-b-[30px] z-10"
            // 4. Added padding top based on insets to support edge-to-edge
            style={{ paddingTop: insets.top + 16 }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-secondaryBackground rounded-full">
              <Ionicons name="arrow-back" size={24} color="#212121" />
            </TouchableOpacity>
            <Text className="text-xl font-bodoni ml-4 text-primaryText">Create Recipe</Text>
          </View>

          <ScrollView className="px-6 mt-6" contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Cover Image */}
            <TouchableOpacity 
              className="w-full h-48 bg-gray-200 rounded-2xl items-center justify-center border-2 border-dashed border-gray-400 mb-6 overflow-hidden"
              onPress={() => pickImage('cover')}
            >
              {coverImage ? <Image source={{ uri: coverImage }} className="w-full h-full" resizeMode="cover" /> : (
                <View className="items-center"><Ionicons name="camera" size={40} color="gray" /><Text className="text-secondaryText mt-2">Cover Photo</Text></View>
              )}
            </TouchableOpacity>

            {/* Basic Info */}
            <Text className="section-title">Basic Info</Text>
            <TextInput className="input mb-4" placeholder="Recipe Title (e.g. Beef Wellington)" value={title} onChangeText={setTitle} />
            <View className="flex-row justify-between mb-4">
               <View className="flex-1 mr-2"><Text className="label">Prep Time</Text><TextInput className="input" placeholder="e.g. 45 min" value={prepTime} onChangeText={setPrepTime} /></View>
               <View className="flex-1 ml-2"><Text className="label">Cuisine</Text><TextInput className="input" placeholder="e.g. Italian" value={cuisine} onChangeText={setCuisine} /></View>
            </View>

            {/* Servings */}
            <View className="bg-white p-4 rounded-xl mb-6 flex-row justify-between items-center shadow-sm">
               <Text className="font-bold text-primaryText">Servings</Text>
               <View className="flex-row items-center">
                 <TouchableOpacity onPress={() => adjustServings(-1)} className="bg-gray-200 p-2 rounded-full"><Ionicons name="remove" size={20} /></TouchableOpacity>
                 <Text className="mx-4 text-xl font-bold">{servings}</Text>
                 <TouchableOpacity onPress={() => adjustServings(1)} className="bg-primary p-2 rounded-full"><Ionicons name="add" size={20} color="white" /></TouchableOpacity>
               </View>
            </View>

            {/* Meal Base */}
            <Text className="section-title">Meal Base</Text>
            <View className="flex-row flex-wrap mb-4">
              {MEAL_BASES.map(base => (
                <TouchableOpacity 
                  key={base} 
                  onPress={() => toggleMealBase(base)}
                  className={`px-3 py-2 rounded-full mr-2 mb-2 border ${selectedMealBases.includes(base) ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}
                >
                  <Text className={selectedMealBases.includes(base) ? 'text-white font-bold' : 'text-secondaryText'}>{base}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Categories */}
            <Text className="section-title">Categories</Text>
            <View className="flex-row flex-wrap mb-6">
              {MEAL_CATEGORIES.map(cat => (
                <TouchableOpacity 
                  key={cat} 
                  onPress={() => toggleCategory(cat)}
                  className={`px-3 py-1 rounded-full mr-2 mb-2 border ${selectedCategories.includes(cat) ? 'bg-secondary border-secondary' : 'bg-white border-gray-200'}`}
                >
                  <Text className={selectedCategories.includes(cat) ? 'text-white font-bold' : 'text-secondaryText'}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Ingredients */}
            <View className="flex-row justify-between items-center mb-2"><Text className="section-title mb-0">Ingredients</Text><Text className="text-secondaryText text-xs font-bold">{totalCalories} kcal Total</Text></View>
            {ingredients.map((ing) => (
              <View key={ing.id} className="bg-white p-3 mb-2 rounded-xl shadow-sm flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                   <Image source={{ uri: ing.image }} className="w-10 h-10 rounded mr-3 bg-gray-50" />
                   <View>
                     <Text className="font-bold text-primaryText">{ing.name}</Text>
                     <Text className="text-xs text-secondaryText">{ing.quantity} {ing.unit} • {ing.calories} kcal</Text>
                     <View className="flex-row mt-1">
                       {ing.allergens?.map((aId: string) => <Image key={aId} source={{ uri: ALLERGENS.find(al => al.id === aId)?.icon }} className="w-4 h-4 mr-1" />)}
                     </View>
                   </View>
                </View>
                <TouchableOpacity onPress={() => removeIngredient(ing.id)} className="p-2"><Ionicons name="trash-outline" size={20} color="red" /></TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity className="flex-row items-center justify-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-2 mb-8" onPress={() => setPickerVisible(true)}>
              <Ionicons name="add-circle" size={24} color="#4CAF50" />
              <Text className="ml-2 text-primary font-bold">Add Ingredient</Text>
            </TouchableOpacity>

            {/* Equipment */}
            <Text className="section-title">Equipment Needed</Text>
            <View className="flex-row mb-3">
              <TextInput className="flex-1 bg-white p-3 rounded-l-xl border-y border-l border-gray-200" placeholder="Add tool (e.g. Blender)" value={equipmentInput} onChangeText={setEquipmentInput} />
              <TouchableOpacity onPress={addEquipment} className="bg-secondary px-4 justify-center rounded-r-xl"><Ionicons name="add" size={24} color="white" /></TouchableOpacity>
            </View>
            <View className="flex-row flex-wrap mb-6">
              {equipmentList.map((item, index) => (
                <View key={index} className="bg-gray-200 px-3 py-1 rounded-lg mr-2 mb-2 flex-row items-center"><Text className="text-gray-700 mr-2">{item}</Text><TouchableOpacity onPress={() => removeEquipment(index)}><Ionicons name="close-circle" size={16} color="gray" /></TouchableOpacity></View>
              ))}
            </View>

            {/* Steps */}
            <Text className="section-title">Preparation Steps</Text>
            {steps.map((step, index) => (
              <View key={step.id} className="bg-white p-4 mb-4 rounded-2xl shadow-sm border border-gray-100">
                <View className="flex-row justify-between mb-2"><Text className="font-bold text-primaryText">Step {index + 1}</Text><TouchableOpacity onPress={() => removeStep(step.id)}><Ionicons name="close" size={20} color="gray" /></TouchableOpacity></View>
                <TextInput className="input mb-2 font-bold" placeholder="Step Title" value={step.title} onChangeText={(t) => updateStepText(step.id, 'title', t)} />
                <TouchableOpacity className="h-32 bg-secondaryBackground rounded-xl items-center justify-center border border-dashed border-gray-300 mb-2 overflow-hidden" onPress={() => pickImage('step', step.id)}>
                  {step.image ? <Image source={{ uri: step.image }} className="w-full h-full" resizeMode="cover" /> : <View className="items-center"><Ionicons name="image-outline" size={24} color="gray" /><Text className="text-xs text-secondaryText">Upload Step Photo</Text></View>}
                </TouchableOpacity>
                <TextInput className="input min-h-[80px]" placeholder="Describe the step..." multiline value={step.description} onChangeText={(t) => updateStepText(step.id, 'description', t)} />
              </View>
            ))}
            <TouchableOpacity onPress={addStep} className="bg-secondaryBackground p-3 rounded-xl items-center mb-6"><Text className="text-primary font-bold">+ Add Step</Text></TouchableOpacity>

            {/* Notes & Wine */}
            <Text className="section-title">Additional Info</Text>
            <Text className="label">Hygiene & Prep Notes</Text>
            <TextInput className="input min-h-[80px] mb-4" multiline placeholder="Wash hands..." value={notes} onChangeText={setNotes} />
            <Text className="label">Wine Pairing</Text>
            <TextInput className="input mb-8" placeholder="e.g. Sauvignon Blanc" value={winePairing} onChangeText={setWinePairing} />

            <TouchableOpacity className="w-full bg-primary py-4 rounded-full items-center shadow-lg mb-10" onPress={handleSaveRecipe} disabled={loading}>
              {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Save Full Recipe</Text>}
            </TouchableOpacity>
          </ScrollView>

          {/* Modals */}
          <IngredientPicker isVisible={pickerVisible} onClose={() => setPickerVisible(false)} onAddIngredient={handleSelectFromPicker} onCreateNew={handleCreateNewIngredient} availableIngredients={masterIngredients} />
          
          <Modal visible={ingredientConfigModalVisible} animationType="slide" transparent>
            <View className="flex-1 bg-black/60 justify-end">
              <View className="bg-white rounded-t-[30px] p-6 h-[85%]">
                <View className="flex-row justify-between items-center mb-6"><Text className="text-2xl font-bodoni text-primaryText">Ingredient Details</Text><TouchableOpacity onPress={() => setIngredientConfigModalVisible(false)}><Ionicons name="close-circle" size={30} color="#ccc" /></TouchableOpacity></View>
                {currentIngredient && (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="items-center mb-6"><Image source={{ uri: currentIngredient.image }} className="w-20 h-20 bg-gray-100 rounded-full mb-2" /><Text className="text-xl font-bold">{currentIngredient.name}</Text></View>
                    <Text className="label">Quantity & Unit</Text>
                    <View className="flex-row mb-4"><TextInput className="flex-1 input mr-2 text-center font-bold text-lg" placeholder="0" keyboardType="numeric" value={currentIngredient.quantity} onChangeText={(t) => setCurrentIngredient({ ...currentIngredient, quantity: t })} autoFocus /><View className="bg-gray-100 justify-center px-4 rounded-xl"><Text className="font-bold text-gray-600">{currentIngredient.unit}</Text></View></View>
                    <Text className="label">Calories (per 100{currentIngredient.unit} or pcs)</Text><TextInput className="input mb-6" placeholder="0" keyboardType="numeric" value={String(currentIngredient.calories)} onChangeText={(t) => setCurrentIngredient({ ...currentIngredient, calories: t })} />
                    <Text className="label">Allergy Awareness</Text>
                    <TouchableOpacity className="bg-red-50 border border-red-100 p-4 rounded-xl flex-row items-center justify-between mb-6" onPress={() => setAllergenModalVisible(true)}>
                      <View className="flex-row items-center flex-1 flex-wrap"><Ionicons name="warning-outline" size={24} color="#D32F2F" style={{ marginRight: 8 }} />{currentIngredient.allergens?.length > 0 ? (currentIngredient.allergens.map((a: string) => <Image key={a} source={{ uri: ALLERGENS.find(al => al.id === a)?.icon }} className="w-6 h-6 mr-1" />)) : <Text className="text-red-800">Does this contain allergens?</Text>}</View><Ionicons name="chevron-forward" size={20} color="#D32F2F" />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-primary py-4 rounded-full items-center mt-4" onPress={confirmAddIngredient}><Text className="text-white font-bold text-lg">Confirm & Add</Text></TouchableOpacity>
                  </ScrollView>
                )}
              </View>
            </View>
          </Modal>

          <Modal visible={allergenModalVisible} animationType="fade" transparent>
            <View className="flex-1 bg-black/80 justify-center p-6">
              <View className="bg-white rounded-3xl p-6">
                <Text className="text-xl font-bold text-center mb-4 text-red-600">Identify Allergens</Text>
                <View className="flex-row flex-wrap justify-between">{ALLERGENS.map((allergen) => { const isSelected = (currentIngredient?.allergens || []).includes(allergen.id); return (<TouchableOpacity key={allergen.id} className={`w-[30%] items-center mb-4 p-2 rounded-xl border ${isSelected ? 'bg-red-50 border-red-500' : 'border-transparent'}`} onPress={() => toggleAllergen(allergen.id)}><Image source={{ uri: allergen.icon }} className="w-10 h-10 mb-1" resizeMode="contain" /><Text className={`text-xs text-center ${isSelected ? 'font-bold text-red-600' : 'text-gray-600'}`}>{allergen.name}</Text></TouchableOpacity>); })}</View>
                <TouchableOpacity className="bg-primary py-3 rounded-full mt-4" onPress={() => setAllergenModalVisible(false)}><Text className="text-center text-white font-bold">Done</Text></TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal animationType="slide" transparent={false} visible={confirmationModalVisible}>
            <SafeAreaView className="flex-1 bg-primaryBackground">
               <View className="flex-1 relative">
                 <View className="absolute top-4 right-4 z-10"><TouchableOpacity onPress={() => setConfirmationModalVisible(false)} className="bg-black/40 p-2 rounded-full"><Ionicons name="close" size={24} color="white" /></TouchableOpacity></View>
                 {tempImage && <Image source={{ uri: tempImage.uri }} className="w-full h-full" resizeMode="contain" />}
                 <View className="absolute bottom-10 w-full px-6 flex-row justify-between"><TouchableOpacity onPress={handleCropAgain} className="bg-white px-6 py-3 rounded-full"><Text className="font-bold">Retake</Text></TouchableOpacity><TouchableOpacity onPress={handleConfirmImage} className="bg-primary px-8 py-3 rounded-full"><Text className="text-white font-bold">Confirm</Text></TouchableOpacity></View>
               </View>
            </SafeAreaView>
          </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}