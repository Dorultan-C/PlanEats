import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
// Firebase Imports
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import "../global.css"

// Reuse the logo asset
const potImage = require("../assets/images/icons/logo.png");

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      
      // Success Alert
      Alert.alert(
        "Check your email",
        `We have sent a password reset link to ${email}.`,
        [
            { 
                text: "Back to Login", 
                onPress: () => router.back() // Takes user back to Login screen
            }
        ]
      );
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("user-not-found")) msg = "No account exists with this email.";
      else if (msg.includes("invalid-email")) msg = "Please enter a valid email address.";
      
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 dark:bg-black">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 w-full justify-center items-center"
      >
        <View className="flex-1 w-full max-w-md h-full max-h-[850px] bg-white rounded-3xl web:shadow-2xl overflow-hidden">
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }} 
            showsVerticalScrollIndicator={false}
            className="w-full px-8"
          >
            
            {/* LOGO */}
            <View className="items-center mb-6">
               <Image 
                 source={potImage} 
                 className="w-40 h-40" 
                 style={{ width: 140, height: 140 }} 
                 resizeMode="contain" 
               />
            </View>

            {/* HEADER TEXT */}
            <Text className="text-3xl font-bodoni font-bold text-primary-text mb-2">
                Forgot Password?
            </Text>
            <Text className="text-gray-400 font-bodoni text-center mb-8 px-4">
                Enter your email address and we&apos;ll send you a link to reset your password.
            </Text>

            {/* INPUT */}
            <View className="w-full gap-4">
              <TextInput 
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                className="w-full border border-primary/40 rounded-full px-6 py-4 text-lg font-bodoni bg-white text-primary-text"
              />
            </View>

            {/* RESET BUTTON */}
            <TouchableOpacity 
              onPress={handleResetPassword}
              disabled={loading}
              className={`w-full bg-primary rounded-full py-4 mt-8 shadow-sm ${loading ? 'opacity-70' : 'active:opacity-90'}`}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center text-xl font-bodoni font-bold">
                  Send Reset Link
                </Text>
              )}
            </TouchableOpacity>

            {/* BACK TO LOGIN LINK */}
            <TouchableOpacity 
                onPress={() => router.back()}
                className="mt-8"
            >
                <Text className="text-gray-400 font-bodoni text-lg">
                    Back to <Text className="text-primary font-bold">Log In</Text>
                </Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}