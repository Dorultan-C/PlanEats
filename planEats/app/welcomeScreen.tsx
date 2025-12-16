import { Text, View, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const imageSource = require("../assets/images/welcome-screen/get_started.png");

export default function WelcomeScreen() {
  return (
    // 1. OUTER WRAPPER (Web Centering)
    <View className="flex-1 justify-center items-center bg-white dark:bg-black">
      
      {/* 2. MAIN CARD (The "Phone" View) */}
      {/* flex-col: Stacks items vertically */}
      <View className="flex-1 w-full max-w-md h-full max-h-[850px] bg-white overflow-hidden rounded-3xl web:shadow-2xl flex-col">
        
        {/* 3. IMAGE SECTION (Top) */}
        {/* flex-1: Allows image to grow and fill empty space, but shrink if text needs room */}
        <View className="relative w-full flex-1">
          <Image 
            source={imageSource} 
            className="w-full h-full" 
            resizeMode="cover" 
          />
          {/* Gradient blends image into the white background below */}
          <LinearGradient
            colors={["transparent", "#ffffff"]}
            style={styles.gradient}
          />
        </View>

        {/* 4. CONTENT SECTION (Bottom) */}
        {/* px-8: Horizontal padding for breathing room */}
        {/* pb-12: Bottom padding so buttons don't touch the edge */}
        {/* pt-4: Top padding to separate from image */}
        {/* gap-6: Adds even spacing between all items automatically */}
        <View className="w-full items-center px-8 pb-12 pt-4 gap-6 bg-white">
          
          {/* Header Text */}
          <View className="items-center">
            <Text className="text-primary-text text-5xl font-bodoni text-center">
              Get started
            </Text>

            <Text className="text-secondary-text text-3xl font-bodoni text-center mt-2 leading-tight">
              Let <Text className="text-primary font-bodoni">PlanEats</Text>
              {"\n"}plan your meals.
            </Text>
          </View>
          
          {/* Action Buttons */}
          <View className="w-full items-center gap-4">
            <Link 
              href={"./signUp"} 
              className="bg-primary w-full py-4 rounded-full text-white text-2xl font-bodoni text-center overflow-hidden shadow-sm"
            > 
              Sign up with email 
            </Link>
            
            <Text className="text-secondary-text text-xs font-bodoni text-center px-4 leading-5 opacity-80">
              By signing up I accept the terms of use and the data privacy policy.
            </Text>

            <View className="items-center mt-2">
              <Text className="text-secondary-text text-lg font-bodoni">
                Already have an account?
              </Text>
              <Link 
                href={"./logIn"} 
                className="text-primary text-2xl font-bodoni mt-1"
              > 
                Log in here 
              </Link>
            </View>
          </View>

        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "30%", // Adjust how high the white fade goes up the image
  },
});