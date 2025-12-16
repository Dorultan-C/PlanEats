import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import "../global.css"

// 1. Setup your Asset Imports
// Using .png for the main logo (Safe)
const potImage = require("../assets/images/icons/logo.png");

// Social Icons (Assuming you have configured SVG support, otherwise rename these to .png versions)
const googleIcon = require("../assets/images/socialMedia/google.png");
const appleIcon = require("../assets/images/socialMedia/apple.png");
const xIcon = require("../assets/images/socialMedia/x.png");
const facebookIcon = require("../assets/images/socialMedia/facebook.png");

export default function SignUp() {
  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-black">
      
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

            {/* 1. MAIN LOGO (Updated to use potColor.png) */}
            <View className="items-center mb-8 ">
               <Image 
                 source={potImage} 
                 className="w-40 h-40" 
                 resizeMode="contain" 
               />
            </View>

            {/* 2. FORM INPUTS */}
            <View className="w-full gap-4">
              <TextInput 
                placeholder="Name"
                placeholderTextColor="#9ca3af"
                className="w-full border border-primary/40 rounded-full px-6 py-4 text-lg font-bodoni bg-white text-primary-text"
              />
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
              <TextInput 
                placeholder="Confirm Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                className="w-full border border-primary/40 rounded-full px-6 py-4 text-lg font-bodoni bg-white text-primary-text"
              />
            </View>

            {/* 3. SIGN UP BUTTON */}
            <TouchableOpacity className="w-full bg-primary rounded-full py-4 mt-8 shadow-sm active:opacity-90">
              <Text className="text-white text-center text-2xl font-bodoni">
                Sign up
              </Text>
            </TouchableOpacity>

            {/* 4. DIVIDER */}
            <View className="flex-row items-center w-full mt-8 mb-6">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="mx-4 text-gray-400 font-bodoni text-sm">
                Or Sign up with
              </Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            {/* 5. SOCIAL ICONS (Updated to use local Assets) */}
            <View className="flex-row gap-8 justify-center items-center">
              {/* Google */}
              <TouchableOpacity>
                 <Image source={googleIcon} className="w-10 h-10" resizeMode="contain" />
              </TouchableOpacity>

              {/* Apple */}
              <TouchableOpacity>
                 <Image source={appleIcon} className="w-10 h-10" resizeMode="contain" />
              </TouchableOpacity>

              {/* X (Twitter) */}
              <TouchableOpacity>
                 <Image source={xIcon} className="w-10 h-10" resizeMode="contain" />
              </TouchableOpacity>

              {/* Facebook */}
              <TouchableOpacity>
                 <Image source={facebookIcon} className="w-10 h-10" resizeMode="contain" />
              </TouchableOpacity>
            </View>

            {/* Back to Login Link */}
            <View className="mt-8 flex-row">
                <Text className="text-secondary-text font-bodoni text-lg">Already have an account? </Text>
                <Link href="./logIn" className="text-primary font-bold font-bodoni text-lg">Log in</Link>
            </View>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}