import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, Animated, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import * as Font from 'expo-font';
import * as Google from 'expo-auth-session/providers/google';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'; 

const Login = () => {
  const navigation = useNavigation();
  const [googleUser, setGoogleUser] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    redirectUri: Platform.select({
      ios: 'exp://localhost:19000', 
      android: 'exp://localhost:19000', 
    }),
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const fetchUserInfo = async () => {
        try {
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${response.authentication.accessToken}` },
          });
          const userInfo = await res.json();
          setGoogleUser(userInfo);
  
          // Redirigir a Home después de un login exitoso
          
          navigation.navigate('Home');  
        } catch (error) {
          console.error('Error fetching Google user info:', error);
        }
      };
      fetchUserInfo();
    }
  }, [response]);
  

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'BasketFont': require('../assets/fonts/SpaceMono-Regular.ttf'), 
        });
        setFontsLoaded(true);
        setTimeout(() => setLoading(false), 2000);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();

        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();

        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="orange" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.main}>
          {/* Logotipo con animación de escala y función para ir al Home */}
          <TouchableOpacity
  onPress={() => {
    console.log('Navigation object:', navigation);
    if (navigation) {
      console.log('Navigating to Home');
      navigation.navigate('Home');
    } else {
      console.error('Navigation is undefined');
    }
  }}
>
            <Animated.Image
             source={require('../assets/images/Logito.png')}
             style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
              />
             </TouchableOpacity>



          {/* Texto "Score" con animación de desvanecimiento */}
          <Animated.Text style={[styles.scoreText, { opacity: fadeAnim }]}>
            Score
          </Animated.Text>
        </View>
        <View style={styles.buttonContainer}>
          {/* Botón con animación de deslizamiento */}
          <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => promptAsync({ useProxy: true, showInRecents: true })}
            >
              <FontAwesome name="google" size={24} color="black" style={styles.icon} />
              <Text style={styles.buttonText}>Continue with Google</Text>
            </TouchableOpacity>
          </Animated.View>

          {googleUser && <Text style={styles.userInfo}>Logged in as: {googleUser.name}</Text>}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  overlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: 300,
    height: 180,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 45,
    color: '#cb5e1d',
    fontFamily: 'BasketFont', 
    textAlign: 'center',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 8,
    width: '80%',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'black',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    position: 'absolute',
    left: 20,
  },
  userInfo: {
    marginTop: 20,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: 'orange',
  },
});

export default Login;
