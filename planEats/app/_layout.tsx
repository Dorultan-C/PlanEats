import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User, Auth } from 'firebase/auth'; // ✅ Added Auth type
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "../global.css";

// ✅ FIX: Use 'require' with linter disable to bypass the implicit-any error
// eslint-disable-next-line @typescript-eslint/no-require-imports
const auth = require('../firebaseConfig').auth as Auth;

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
    if (!initializing && fontsLoaded) {
      if (user) {
        router.replace('/homePage');
      }
    }
  }, [user, initializing, fontsLoaded, fontError]);

  // Prevent rendering until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcomeScreen" />      
        <Stack.Screen name="homePage" />
        <Stack.Screen name="logIn" />
        <Stack.Screen name="signUp" />
        <Stack.Screen name="forgotPassword" />
        <Stack.Screen name="menu" /> 
        <Stack.Screen name="CreateRecipe" />
        <Stack.Screen name="RecipeDetails" /> 
        <Stack.Screen name="CookingMode" />
        <Stack.Screen name="EditProfile" />
        <Stack.Screen name="Favourites" />
      </Stack>
    </SafeAreaProvider>
  );
}