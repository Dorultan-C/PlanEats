import { Link, Stack } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    
    <>
     <Stack.Screen options={{ title: "404"}} />
     <View style={styles.container}>
       <Text style={styles.text}>Oops! Page not found!</Text>
       <Link href={"/"}>Go back to Home screen!
       </Link>
    </View>
    </>
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
  
  }
});