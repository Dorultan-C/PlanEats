import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, Image, TouchableOpacity, ScrollView, StatusBar, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // ✅ Import this
import "../global.css";

export default function CookingMode() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // ✅ Get Safe Area Insets (Notch, Nav Bar heights)
  const insets = useSafeAreaInsets(); 

  // --- DATA SETUP ---
  const recipe = params.recipeData ? JSON.parse(params.recipeData as string) : null;
  const steps = recipe?.steps || [];
  
  // State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  // Timer State
  const [activeTimers, setActiveTimers] = useState<{[key: number]: number}>({}); 
  const timerIntervalRef = useRef<any>(null);

  // --- TIMER ENGINE ---
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      setActiveTimers(prevTimers => {
        const nextTimers = { ...prevTimers };
        let hasChanges = false;
        
        Object.keys(nextTimers).forEach(key => {
          const index = parseInt(key);
          if (nextTimers[index] > 0) {
            nextTimers[index] -= 1;
            hasChanges = true;
          } else {
            delete nextTimers[index];
            hasChanges = true;
            Alert.alert("Timer Done!", "Your timer has finished.");
          }
        });
        
        return hasChanges ? nextTimers : prevTimers;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const toggleTimer = (durationMin: number, index: number) => {
    if (activeTimers[index] !== undefined) {
      const newTimers = { ...activeTimers };
      delete newTimers[index];
      setActiveTimers(newTimers);
    } else {
      setActiveTimers(prev => ({ ...prev, [index]: durationMin * 60 }));
    }
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else {
      router.back(); 
    }
  };

  // ---------------------------------------------------------
  // RENDER: BON APPETIT SCREEN (Completion)
  // ---------------------------------------------------------
  if (isFinished) {
    return (
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        <View className="flex-1 justify-between pb-8">
           <View className="items-center px-6 pt-10">
              <Text className="text-secondaryText uppercase tracking-widest text-xs mb-8">All Steps Complete</Text>
              
              <View className="w-full h-64 rounded-3xl overflow-hidden shadow-lg mb-8 bg-gray-100">
                 <Image 
                   source={{ uri: recipe.image }} 
                   className="w-full h-full" 
                   resizeMode="cover"
                 />
              </View>

              <Text className="text-3xl font-bodoni text-primaryText mb-4 text-center">Bon Appetit!</Text>
              <Text className="text-gray-500 text-center leading-6 px-4">
                Your <Text className="font-bold text-gray-800">{recipe.title}</Text> is ready. We hope you enjoy your meal!
              </Text>

              <View className="mt-8 bg-green-50 px-4 py-2 rounded-full border border-green-100 flex-row items-center">
                 <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                 <Text className="ml-2 text-green-700 font-bold">Logged {recipe.calories || "Meal"}</Text>
              </View>
           </View>

           {/* Home Button with Bottom Inset */}
           <View className="px-6 w-full" style={{ paddingBottom: insets.bottom + 20 }}>
             <TouchableOpacity 
               onPress={() => router.navigate('/homePage')} 
               className="bg-primary h-14 rounded-full items-center justify-center shadow-md"
             >
               <Text className="text-white font-bold text-lg">Back to Home</Text>
             </TouchableOpacity>
           </View>
        </View>
      </View>
    );
  }

  // ---------------------------------------------------------
  // RENDER: STEP WIZARD
  // ---------------------------------------------------------
  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    // ✅ ADDED PADDING TOP FOR CAMERA/NOTCH
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* HEADER */}
      <View className="flex-row items-center justify-between px-6 py-4">
         <TouchableOpacity onPress={handleBack} className="p-2">
           <Ionicons name="arrow-back" size={24} color="#333" />
         </TouchableOpacity>
         <Text className="font-bodoni text-lg text-primaryText">Cooking Mode</Text>
         <TouchableOpacity onPress={() => router.back()} className="p-2">
           <Ionicons name="close" size={24} color="#333" />
         </TouchableOpacity>
      </View>

      {/* PROGRESS BAR */}
      <View className="w-full h-1 bg-gray-100">
         <View 
           className="h-full bg-primary" 
           style={{ width: `${progress}%` }} 
         />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 150 }} className="flex-1" showsVerticalScrollIndicator={false}>
        
        <View className="px-6 pt-6">
          {/* Step Count */}
          <Text className="text-secondaryText text-xs uppercase font-bold tracking-widest mb-2">
             Step {currentStepIndex + 1} of {steps.length}
          </Text>

          {/* Title */}
          <Text className="text-3xl font-bodoni text-primaryText leading-9 mb-6">
            {currentStep.title || `Step ${currentStepIndex + 1}`}
          </Text>

          {/* Step Image */}
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

          {/* ⏱️ ACTIVE TIMER BUTTONS */}
          {currentStep.timers && currentStep.timers.length > 0 && (
            <View className="flex-row flex-wrap gap-3 mt-2">
               {currentStep.timers.map((time: number, index: number) => {
                 const remainingSeconds = activeTimers[index];
                 const isRunning = remainingSeconds !== undefined;

                 return (
                   <TouchableOpacity 
                     key={index}
                     onPress={() => toggleTimer(time, index)}
                     activeOpacity={0.7}
                     className={`flex-row items-center px-6 py-4 rounded-2xl border shadow-sm ${isRunning ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}
                   >
                     <MaterialCommunityIcons 
                       name={isRunning ? "timer-sand" : "timer-outline"} 
                       size={24} 
                       color={isRunning ? "#F57C00" : "#4CAF50"} 
                     />
                     <View className="ml-3">
                       <Text className={`text-xs font-bold uppercase ${isRunning ? 'text-orange-400' : 'text-green-600'}`}>
                          {isRunning ? "Time Left" : "Start Timer"}
                       </Text>
                       <Text className={`text-lg font-bold ${isRunning ? 'text-orange-800' : 'text-green-800'}`}>
                         {isRunning ? formatTime(remainingSeconds) : `${time} Min`}
                       </Text>
                     </View>
                   </TouchableOpacity>
                 );
               })}
            </View>
          )}

        </View>
      </ScrollView>

      {/* ✅ BOTTOM BUTTON WITH SAFE AREA PADDING */}
      <View 
        className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-50"
        style={{ paddingBottom: insets.bottom + 20 }} 
      >
        <TouchableOpacity 
          onPress={handleNext}
          className="w-full h-14 bg-primary rounded-full items-center justify-center shadow-lg active:opacity-90"
        >
          <Text className="text-white font-bold text-lg">
             {currentStepIndex === steps.length - 1 ? "Finish Cooking" : "Next Step"}
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}