import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 
import "../global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 1. STATE: Fonts
  const [fontsLoaded, fontError] = useFonts({
    // Ensure the path matches your project structure
    'BodoniModa': require('../assets/fonts/BodoniModa.ttf'), 
  });

  // 2. STATE: User Auth
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // 3. EFFECT: Listen for Firebase Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("👤 User detected:", currentUser ? currentUser.email : "None");
      setUser(currentUser);
      // FIX: We simply set this to false every time the listener fires initially.
      // We removed the 'if (initializing)' check to satisfy the useEffect warning.
      setInitializing(false);
    });

    return unsubscribe; // Cleanup on unmount
  }, []);

  // 4. EFFECT: Hide Splash Screen & Navigate
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }

    // "Traffic Cop" Logic:
    // Only run this if we are done initializing Auth AND fonts are ready
    if (!initializing && fontsLoaded) {
      if (user) {
        // ✅ User is logged in -> Go straight to Home
        // We use 'replace' so they can't swipe back to the login screen
        router.replace('/homePage');
      }
      // ❌ User is NOT logged in -> The app naturally shows the first screen (WelcomeScreen)
    }
  }, [user, initializing, fontsLoaded, fontError]);

  // Prevent rendering until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Define all your screens here so the Router knows about them */}
      <Stack.Screen name="welcomeScreen" />      
      <Stack.Screen name="homePage" />
      <Stack.Screen name="logIn" />
      <Stack.Screen name="signUp" />
      <Stack.Screen name="forgotPassword" />
      <Stack.Screen name="menu" /> 
      <Stack.Screen name="CreateRecipe" />
    </Stack>
  );
}