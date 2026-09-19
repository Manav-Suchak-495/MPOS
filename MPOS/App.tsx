import React, { useState } from 'react';
import { StyleSheet, View, Alert, KeyboardAvoidingView, Platform, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Text, PaperProvider } from 'react-native-paper';
import axios from 'axios';

const API_BASE_URL: string = Platform.OS === 'android' 
  ? 'http://10.0.2.2:8000' 
  : 'http://localhost:8000';

export default function App() {

  const isMobileNative = Platform.OS === 'ios' || Platform.OS === 'android';
  const isElectron = Platform.OS === 'web';
  const [email, setEmail] = useState<string>('');
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const LoginWebHover = Platform.OS === 'web' ? {
    onMouseEnter: () => setIsLoginHovered(true),
    onMouseLeave: () => setIsLoginHovered(false),
  } : {};

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      if(isElectron){
        window.alert(`${'Validation Error'}\n\n${'Please enter username and password'}`);
      }
      else{
        Alert.alert('Validation Error', 'Please enter username and password.');
      }
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
        username: email,
        password: password,
      });

      setLoading(false);
      Alert.alert('Success', `Logged in! Token: ${response.data.access_token}`);
    } catch (error: any) {
      setLoading(false);
      const errorMessage = error.response?.data?.detail || 'Cannot connect to server';
      Alert.alert('Login Failed', errorMessage);
    }
  };

  return (
    <PaperProvider>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          alignItems: isElectron ? 'center' : 'stretch',
          height: '100vh' as any,
          backgroundColor: '#000000',
          justifyContent: 'center',
        }}
      >
        <ImageBackground
          source={require('./icons/MPOS_Logo_Black_Final.png')}
          imageStyle={{
            width: '100%',
            height: '100%'
          }}
          style={{
            flex: 1,
            alignItems: isElectron ? 'center' : 'stretch',
            width: isElectron ? '50%' : '100%',
            height: isElectron ? '50%' : '100%',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}
          resizeMode="contain"
        >
        {Platform.OS === 'android' || Platform.OS === 'ios' ? (
          <Image
            source={require('./icons/MPOS_Logo_Black_Final.png')}
            resizeMode="contain"
            style={{
              position: 'absolute',
              top: 24,
              left: 24,
              zIndex: 1000,
              height: 120,
              width: 100,
              backgroundColor: '#000000',
            }}
          />
        ) : null}
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: isElectron ? 'center' : 'stretch',
          minHeight: isElectron ? 355 :'100vh' as any,
          maxHeight: isElectron ? 355 :'100vh' as any,
          minWidth: isElectron ? 320 : undefined,
          backgroundColor: isElectron ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0)',
          borderWidth: 1.5,
          borderColor: isElectron ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
          paddingHorizontal: isElectron ? 30 : 24,
          borderRadius: isElectron ? 18 : 0,
          ...(isElectron ? {
            backdropFilter: 'blur(24px)',
          } as any : {}),
          
        }}>
          <Text
            style={{
              fontWeight: 400,
              textAlign: 'center',
              color: '#ffffff',
              fontSize: isElectron ? 44 : 50,
              marginBottom: 33
            }}
          >
              Login
          </Text>

          <TextInput
            placeholder='Email'
            placeholderTextColor='#f0f0f0'
            textColor='#f0f0f0'
            value={email}
            onChangeText={(text: string) => setEmail(text)}
            mode='outlined'
            outlineColor='rgba(255, 255, 255, 0.24)'
            activeOutlineColor='#ffffff'
            outlineStyle={{
              borderRadius: isElectron ? 9:12,
              borderWidth: 1.1
            }}
            contentStyle={{
              fontSize: isElectron ? 14 : 18,
            }}
            style={{
              height: isElectron ? 40 : undefined,
              minWidth: isElectron ? '100%' : undefined,
              marginBottom: isElectron ? 20.5 : 31,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            }}
          />

          <TextInput
            placeholder='Password'
            placeholderTextColor='#f0f0f0'
            textColor='#f0f0f0'
            value={password}
            onChangeText={(text: string) => setPassword(text)}
            mode='outlined'
            outlineColor='rgba(255, 255, 255, 0.24)'
            activeOutlineColor='#ffffff'
            outlineStyle={{
              borderRadius: isElectron ? 9 : 12,
              borderWidth: 1
            }}
            contentStyle={{
              fontSize: isElectron ? 14 : 18
            }}
            style={{
              height: isElectron ? 40 : undefined,
              minWidth: isElectron ? '100%' : undefined,
              marginBottom: isElectron ? 7 : 7,
              backgroundColor: 'rgba(255, 255, 255, 0.15)'
            }}
          />

          <TouchableOpacity
            onPress={() => {
              // Handle navigation or alert here
              console.log('Navigate to Forgot Password');
            }}
            activeOpacity={0.7}
          >
            <Text style={{
              fontSize: isElectron ? 14 : 17,
              width: isElectron ? 255 : undefined,
              color: '#ffffff',
              textAlign: 'right',
              marginRight: isElectron ? 6 : 9
            }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <Button 
            mode="contained" 
            onPress={handleLogin} 
            loading={loading}
            textColor='#ffffff'
            {...(LoginWebHover as any)}
            labelStyle={{
              margin: 6,
              fontSize: isElectron ? 15 : 19,
            }}
            style={{
              height : isElectron ? undefined : 50,
              width: '100%',
              elevation: 6,
              marginTop: isElectron ? 40 : 50,
              paddingVertical: 4,
              borderRadius: 10,
              backgroundColor: '#660eca',
              borderColor: '#fff',
              shadowColor: isLoginHovered ? '#000000' : 'transparent',
              shadowOffset: { width: isLoginHovered ? 4 : 0, height: isLoginHovered ? 3 : 0 },
              shadowOpacity: 0.4,
              shadowRadius: 5,
            }}
            theme={{
              colors: { elevation: { level1: 'transparent' } }
            }}
          >
            Login
          </Button>
        </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}