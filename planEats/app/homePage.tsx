import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-secondary">
      
    
      <Text style={styles.text}>Hello! & Welcome to Home Page</Text>
      <Link href={"/welcomeScreen"} className="text-3xl font-bodoni text-primary ">Go to Welcome Screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  
  text:{
    color: "#000000",
    fontSize: 64,
    textAlign: "center",
    fontFamily: 'Bodoni',
    fontWeight: "bold",
  
  }
});