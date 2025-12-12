import { Text, View, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";

const imageSource = require("../assets/images/welcome-screen/get_started.png");

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Image source={imageSource} style={{ width: 400, height: 350, marginTop: 20, }} />
    <Text style={styles.text}>Welcome Screen</Text>
        <Link href={".."} style={styles.button}>Home</Link>
      

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
    fontSize: 24,
    textAlign: "center",
    fontFamily: 'Bodoni',
    fontWeight: "bold",
  
  },
  button:{
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#4CAF50",
    fontWeight: "bold",
    fontSize: 24,
  },
  buttonText:{
    color: "#f1f",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: 'Bodoni',
  }, 
  image:{
    width: 400,
    height: 350,
    marginBottom: 20,
  }
});