import { Text, View, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const imageSource = require("../assets/images/welcome-screen/get_started.png");

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} />
        <LinearGradient
          colors={["transparent", "#ffffff"]}
          style={styles.gradient}
        />
      </View>
      <Text style={styles.text}>Get started</Text>
      <Text style={styles.text}>Let <Text style={styles.textColor}>Plan Eats </Text>plan <br /> your meals with ease.</Text>
      <Text style={styles.textSmall}>By signing up I accept the terms <br /> of use  and the data privacy policy.</Text>


      <Link href={"./signUp"} style={styles.button}> Sign up with email </Link>
            <Text style={styles.text}>Already have an account?</Text>
      <Link href={"./logIn"} style={styles.textColor} > Log In here </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "flex-start", // Align content to the top
    
  },
  imageContainer: {
    position: "relative",
    width: 400,
    height: 400,
    marginTop: 50,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "30%",

  },
  text: {
    color: "#000000",
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Bodoni",
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 50,
    borderColor: "#4CAF50",
    fontSize: 25,
    fontWeight: "light",
    paddingBlock: 15,
    paddingHorizontal: 20,
    color: "#ffffff",
    textAlign: "center",
    fontFamily: "Bodoni",
  },
  textColor: {
    color: "#4CAF50",
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Bodoni",
    fontWeight: "bold",
    marginBottom: 20,
  },
  textSmall: {
    color: "#000000",
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Bodoni",
    marginTop: 10,
    marginBottom: 20,
  
  },

});