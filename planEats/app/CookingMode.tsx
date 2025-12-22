import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, Image, TouchableOpacity, ScrollView, Dimensions, SafeAreaView, StatusBar, Animated 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import "../global.css";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CookingMode() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // --- DATA SETUP ---
  const recipe = params.recipeData ? JSON.parse(params.recipeData as string) : null;
  const steps = recipe?.steps || [];
  
  // State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  // Timer State (Tracks active countdowns for the current step)
  const [activeTimers, setActiveTimers] = useState<{[key: number]: number}>({}); 
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- TIMER LOGIC ---
  const toggleTimer = (durationMin: number, index: number) => {
    // If running, stop it. If stopped, start it.
    if (activeTimers[index] !== undefined) {
      // Stop
      const newTimers = { ...activeTimers };
      delete newTimers[index];
      setActiveTimers(newTimers);
    } else {
      // Start (Convert min to seconds)
      setActiveTimers(prev => ({ ...prev, [index]: durationMin * 60 }));
    }
  };

  useEffect(() => {
    // Global ticker for all active timers
    timerIntervalRef.current = setInterval(() => {
      setActiveTimers(prev => {
        const nextState = { ...prev };
        let hasChanges = false;
        
        Object.keys(nextState).forEach(key => {
          const k = parseInt(key);
          if (nextState[k] > 0) {
            nextState[k] -= 1;
            hasChanges = true;
          } else {
            // Timer finished! (Optional: Play sound here)
            delete nextState[k];
            hasChanges = true;
          }
        });
        
        return hasChanges ? nextState : prev;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- NAVIGATION LOGIC ---
  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setActiveTimers({}); // Reset timers for new step
    } else {
      setIsFinished(true); // Go to Bon Appetit screen
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else {
      router.back(); // Exit if on step 1
    }
  };

  // --- RENDER: BON APPETIT SCREEN ---
  if (isFinished) {
    return (
      <View className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />
        <SafeAreaView className="flex-1 justify-between pb-8">
           <View className="items-center px-6 pt-10">
              {/* Header */}
              <Text className="text-secondaryText uppercase tracking-widest text-xs mb-8">Bon Appetit Screen</Text>
              
              {/* Hero Image */}
              <View className="w-full h-64 rounded-3xl overflow-hidden shadow-lg mb-8">
                 <Image 
                   source={{ uri: recipe.image }} 
                   className="w-full h-full" 
                   resizeMode="cover"
                 />
              </View>

              {/* Celebration Text */}
              <Text className="text-3xl font-bodoni text-primaryText mb-4 text-center">Bon Appetit!</Text>
              <Text className="text-gray-500 text-center leading-6 px-4">
                Your <Text className="font-bold text-gray-800">{recipe.title}</Text> is ready and has been logged to your daily plan.
              </Text>

              {/* Badge */}
              <View className="mt-8 bg-green-50 px-4 py-2 rounded-full border border-green-100 flex-row items-center">
                 <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                 <Text className="ml-2 text-green-700 font-bold">Meal Logged +{recipe.calories}</Text>
              </View>
           </View>

           {/* Home Button */}
           <View className="px-6 w-full">
             <TouchableOpacity 
               onPress={() => router.navigate('/homePage')} 
               className="bg-primary h-14 rounded-full items-center justify-center shadow-md"
             >
               <Text className="text-white font-bold text-lg">Back to Home</Text>
             </TouchableOpacity>
           </View>
        </SafeAreaView>
      </View>
    );
  }

  // --- RENDER: STEP SCREEN ---
  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        
        {/* HEADER */}
        <View className="flex-row items-center justify-between px-6 py-2">
           <TouchableOpacity onPress={handleBack} className="p-2">
             <Ionicons name="arrow-back" size={24} color="#333" />
           </TouchableOpacity>
           <Text className="font-bodoni text-lg text-primaryText">Cooking Mode</Text>
           <TouchableOpacity onPress={() => router.back()} className="p-2">
             <Ionicons name="close" size={24} color="#333" />
           </TouchableOpacity>
        </View>

        {/* PROGRESS BAR */}
        <View className="w-full h-1 bg-gray-100 mt-2">
           <View 
             className="h-full bg-primary" 
             style={{ width: `${progress}%` }} 
           />
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} className="flex-1" showsVerticalScrollIndicator={false}>
          
          <View className="px-6 pt-6">
            {/* Step Count */}
            <Text className="text-secondaryText text-xs uppercase font-bold tracking-widest mb-2">
               Step {currentStepIndex + 1} of {steps.length}
            </Text>

            {/* Title */}
            <Text className="text-3xl font-bodoni text-primaryText leading-9 mb-6">
              {currentStep.title || `Step ${currentStepIndex + 1}`}
            </Text>

            {/* Image */}
            <View className="w-full h-56 bg-gray-50 rounded-2xl overflow-hidden mb-6 shadow-sm border border-gray-100">
               {currentStep.image ? (
                 <Image source={{ uri: currentStep.image }} className="w-full h-full" resizeMode="cover" />
               ) : (
                 <View className="flex-1 items-center justify-center">
                    <Ionicons name="restaurant-outline" size={40} color="#ccc" />
                    <Text className="text-gray-400 mt-2">No image for this step</Text>
                 </View>
               )}
            </View>

            {/* Description */}
            <Text className="text-lg text-gray-700 leading-8 mb-6">
              {currentStep.description}
            </Text>

            {/* TIMERS SECTION */}
            {currentStep.timers && currentStep.timers.length > 0 && (
              <View className="flex-row flex-wrap gap-3 mt-2">
                 {currentStep.timers.map((time: number, index: number) => {
                   const isRunning = activeTimers[index] !== undefined;
                   return (
                     <TouchableOpacity 
                       key={index}
                       onPress={() => toggleTimer(time, index)}
                       className={`flex-row items-center px-5 py-3 rounded-full border shadow-sm ${isRunning ? 'bg-orange-50 border-orange-200' : 'bg-primary border-primary'}`}
                     >
                       <MaterialCommunityIcons 
                         name={isRunning ? "timer-sand" : "timer-outline"} 
                         size={20} 
                         color={isRunning ? "#F57C00" : "white"} 
                       />
                       <Text className={`ml-2 font-bold ${isRunning ? 'text-orange-700' : 'text-white'}`}>
                         {isRunning ? formatTime(activeTimers[index]) : `Start ${time} Min`}
                       </Text>
                     </TouchableOpacity>
                   );
                 })}
              </View>
            )}

          </View>
        </ScrollView>

        {/* BOTTOM BUTTON */}
        <View className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-50">
          <TouchableOpacity 
            onPress={handleNext}
            className="w-full h-14 bg-primary rounded-full items-center justify-center shadow-lg active:opacity-90"
          >
            <Text className="text-white font-bold text-lg">
               {currentStepIndex === steps.length - 1 ? "Finish Cooking" : "Next Step"}
            </Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}