import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.setOptions({
  duration: 3000,
  fade: true,
});

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="welcomeScreen"
        options={{
          headerShown: false,
        }}
      />      
      <Stack.Screen
        name="homePage"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="logIn"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signUp"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="forgotPassword"
        options={{
          headerShown: false,
        }}
      />

    </Stack>
  )
  ;
}
