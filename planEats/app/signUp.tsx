import { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
import "../global.css";

const potImage = require("../assets/images/icons/logo.png");
const googleIcon = require("../assets/images/socialMedia/google.png");
const appleIcon = require("../assets/images/socialMedia/apple.png");
const xIcon = require("../assets/images/socialMedia/x.png");
const facebookIcon = require("../assets/images/socialMedia/facebook.png");

WebBrowser.maybeCompleteAuthSession();

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- GOOGLE CONFIG ---
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '818297580059-k560b8cgleoh60gsgbpgrgh8uhjie5sj.apps.googleusercontent.com',
      scopes: ['openid', 'profile', 'email'],
      responseType: ResponseType.IdToken,
      redirectUri: makeRedirectUri(),
      usePKCE: false,
    },
    {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
    }
  );

  // --- GOOGLE LISTENER ---
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      setLoading(true);
      signInWithCredential(auth, credential)
        .then(() => {
          router.replace('/homePage');
        })
        .catch((error) => Alert.alert("Login Error", error.message))
        .finally(() => setLoading(false));
    }
  }, [response]);

  // --- EMAIL SIGN UP ---
  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace('/homePage'); 
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 dark:bg-black">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 w-full justify-center items-center">
        <View className="flex-1 w-full max-w-md h-full max-h-[850px] bg-white rounded-3xl web:shadow-2xl overflow-hidden">
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }} showsVerticalScrollIndicator={false} className="w-full px-8">
            
            <View className="items-center mb-8">
               <Image source={potImage} className="w-40 h-40" style={{ width: 160, height: 160 }} resizeMode="contain" />
            </View>

            <View className="w-full gap-4">
              <TextInput placeholder="Name" value={name} onChangeText={setName} placeholderTextColor="#9ca3af" className="w-full border border-primary/40 rounded-full px-6 py-4 text-lg font-bodoni bg-white text-primary-text" />
              <TextInput placeholder="Email address" value={email} onChangeText={setEmail} placeholderTextColor="#9ca3af" keyboardType="email-address" autoCapitalize="none" className="w-full border border-primary/40 rounded-full px-6 py-4 text-lg font-bodoni bg-white text-primary-text" />
              <TextInput placeholder="Password" value={password} onChangeText={setPassword} placeholderTextColor="#9ca3af" secureTextEntry className="w-full border border-primary/40 rounded-full px-6 py-4 text-lg font-bodoni bg-white text-primary-text" />
              <TextInput placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} placeholderTextColor="#9ca3af" secureTextEntry className="w-full border border-primary/40 rounded-full px-6 py-4 text-lg font-bodoni bg-white text-primary-text" />
            </View>

            <TouchableOpacity onPress={handleSignUp} disabled={loading} className={`w-full bg-primary rounded-full py-4 mt-8 shadow-sm ${loading ? 'opacity-70' : 'active:opacity-90'}`}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-center text-2xl font-bodoni">Sign up</Text>}
            </TouchableOpacity>

            <View className="flex-row items-center w-full mt-8 mb-6">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="mx-4 text-gray-400 font-bodoni text-sm">Or Sign up with</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            <View className="flex-row gap-8 justify-center items-center">
              <TouchableOpacity disabled={!request} onPress={() => promptAsync()}>
                 <Image source={googleIcon} className="w-10 h-10" resizeMode="contain" />
              </TouchableOpacity>
              <TouchableOpacity><Image source={appleIcon} className="w-10 h-10" resizeMode="contain" /></TouchableOpacity>
              <TouchableOpacity><Image source={xIcon} className="w-10 h-10" resizeMode="contain" /></TouchableOpacity>
              <TouchableOpacity><Image source={facebookIcon} className="w-10 h-10" resizeMode="contain" /></TouchableOpacity>
            </View>

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