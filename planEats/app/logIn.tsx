import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import "../global.css"

// 1. ASSET IMPORTS
// Using the same safe logo as the SignUp page
const potImage = require("../assets/images/icons/logo.png");

// Social Media Icons
const googleIcon = require("../assets/images/socialMedia/google.png");
const appleIcon = require("../assets/images/socialMedia/apple.png");
const xIcon = require("../assets/images/socialMedia/x.png");
const facebookIcon = require("../assets/images/socialMedia/facebook.png");

export default function LogIn() {
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

            {/* 1. MAIN LOGO */}
            <View className="items-center mb-10">
               <Image 
                 source={potImage} 
                 className="w-40 h-40" 
                 style={{ width: 160, height: 160 }} 
                 resizeMode="contain" 
               />
            </View>

            {/* 2. FORM INPUTS */}
            <View className="w-full gap-4">
              <TextInput 
                placeholder="Email address"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                className="w-full border border-primary/40 rounded-full px-6 py-4 text-lg font-bodoni bg-white text-primary-text"
              />
              <TextInput 
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                className="w-full border border-primary/40 rounded-full px-6 py-4 text-lg font-bodoni bg-white text-primary-text"
              />
            </View>

            {/* 3. FORGOT PASSWORD LINK (Aligned Right) */}
            <View className="w-full items-end mt-3 pr-2">
                <Link href="./forgotPassword" className="text-secondary-text font-bodoni text-sm opacity-80">
                    Forgot password
                </Link>
            </View>

            {/* 4. LOG IN BUTTON */}
            <TouchableOpacity className="w-full bg-primary rounded-full py-4 mt-8 shadow-sm active:opacity-90 active:scale-95 transition-all">
              <Text className="text-white text-center text-3xl font-bodoni">
                Log in
              </Text>
            </TouchableOpacity>

            {/* 5. DIVIDER */}
            <View className="flex-row items-center w-full mt-10 mb-6">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="mx-4 text-gray-400 font-bodoni text-sm">
                Or Log in with
              </Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            {/* 6. SOCIAL ICONS */}
            <View className="flex-row gap-8 justify-center items-center mb-4">
              <TouchableOpacity>
                 <Image source={googleIcon} className="w-10 h-10" resizeMode="contain" />
              </TouchableOpacity>

              <TouchableOpacity>
                 <Image source={appleIcon} className="w-10 h-10" resizeMode="contain" />
              </TouchableOpacity>

              <TouchableOpacity>
                 <Image source={xIcon} className="w-10 h-10" resizeMode="contain" />
              </TouchableOpacity>

              <TouchableOpacity>
                 <Image source={facebookIcon} className="w-10 h-10" resizeMode="contain" />
              </TouchableOpacity>
            </View>
            
            {/* 7. SIGN UP LINK */}
            <View className="mt-8 flex-row">
                <Text className="text-secondary-text font-bodoni text-lg">Don&apos;t have an account? </Text>
                <Link href="./signUp" className="text-primary font-bodoni text-xl">Sign up</Link>
            </View>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}