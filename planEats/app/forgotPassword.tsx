import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import "../global.css"

// 1. ASSET IMPORTS
// Using the same consistent logo
const potImage = require("../assets/images/icons/logo.png");

export default function ForgotPassword() {
  return (
    // OUTER CONTAINER
    <View className="flex-1 justify-center items-center bg-gray-100 dark:bg-black">
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 w-full justify-center items-center"
      >
        
        {/* PHONE CARD CONTAINER */}
        <View className="flex-1 w-full max-w-md h-full max-h-[850px] bg-white rounded-3xl web:shadow-2xl overflow-hidden">
          
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }} 
            showsVerticalScrollIndicator={false}
            className="w-full px-8"
          >

            {/* 1. IMAGE */}
            <View className="items-center mb-6">
               <Image 
                 source={potImage} 
                 className="w-40 h-40" 
                 style={{ width: 160, height: 160 }} 
                 resizeMode="contain" 
               />
            </View>

            {/* 2. HEADER TEXT */}
            <View className="w-full items-center mb-8 gap-2">
                <Text className="text-3xl font-bodoni text-primary-text text-center mb-8">
                    Forgot Password?
                </Text>
                <Text className="text-secondary-text font-bodoni text-center text-lg px-2">
                    Don&apos;t worry! It happens. Please enter the email associated with your account.
                </Text>
            </View>

            {/* 3. INPUT FIELD */}
            <View className="w-full gap-4">
              <TextInput 
                placeholder="Enter your email address"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                className="w-full border border-primary/40 rounded-full px-6 py-4 text-lg font-bodoni bg-white text-primary-text"
              />
            </View>

            {/* 4. SEND BUTTON */}
            <TouchableOpacity className="w-full bg-primary rounded-full py-4 mt-8 shadow-sm active:opacity-90 active:scale-95 transition-all">
              <Text className="text-white text-center text-3xl font-bodoni">
                Send
              </Text>
            </TouchableOpacity>

            {/* 5. BACK TO LOGIN */}
            {/* Using absolute positioning logic or just margin to push it down if needed, 
                but here standard flex flow works best. */}
            <View className="mt-10">
                <Link href="./logIn" className="text-secondary-text font-bodoni text-xl opacity-80">
                    Remember password? <Text className="text-primary text-2xl">Log in</Text>
                </Link>
            </View>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}