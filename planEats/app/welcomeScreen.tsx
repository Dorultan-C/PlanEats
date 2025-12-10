import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";



export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      
    
        <Link href={".."} style={styles.button}>Go Back Home</Link>
      <Text style={styles.text}>Welcome Screen</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  text:{
    color: "#000000",
    fontSize: 64,
    textAlign: "center",
    fontFamily: 'Bodoni',
    fontWeight: "bold",
  
  },
  button:{
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  buttonText:{
    color: "#f1f",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: 'Bodoni',
  }
});