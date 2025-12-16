// app/_layout.tsx
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import "../global.css"; // Import CSS here ONLY

// ERROR FIX: This must be OUTSIDE the component function
SplashScreen.preventAutoHideAsync(); //

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Ensure this matches the string in tailwind.config.js exactly
    'BodoniModa': require('../assets/fonts/BodoniModa.ttf'), 
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcomeScreen" />      
      <Stack.Screen name="homePage" />
      <Stack.Screen name="logIn" />
      <Stack.Screen name="signUp" />
      <Stack.Screen name="forgotPassword" />
    </Stack>
  );
}