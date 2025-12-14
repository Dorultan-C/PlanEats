import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function signUp() {
  return (
    <View style={styles.container}>
      
    
      <Text style={styles.text}>Hello! & Welcome to Sign up</Text>
      <Link href={"../welcomeScreen"}>Go to Welcome Screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFC107", 
    
    alignItems: "center",
    justifyContent: "center",
  },
  text:{
    color: "#000000",
    fontSize: 64,
    textAlign: "center",
    fontFamily: 'Bodoni',
    fontWeight: "bold",
  
  }
});