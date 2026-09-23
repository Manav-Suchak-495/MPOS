import React, { useState } from 'react';
import { StyleSheet, View, Alert, KeyboardAvoidingView, Platform, ImageBackground, TouchableOpacity, Image, Pressable } from 'react-native';
import { TextInput, Button, Text, PaperProvider } from 'react-native-paper';
import { API_BASE_URL } from './config';
import axios from 'axios';
import CustomDialog from './customdialog';
import ForgotPasswordDialog from './ForgotPasswordDialog';

export default function App() {

  const isMobileNative = Platform.OS === 'ios' || Platform.OS === 'android';
  const isElectron = Platform.OS === 'web';
  const [email, setEmail] = useState('');
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordDialog, setForgotPasswordDiallog] = useState(false);

  const LoginWebHover = Platform.OS === 'web' ? {
    onMouseEnter: () => setIsLoginHovered(true),
    onMouseLeave: () => setIsLoginHovered(false),
  } : {};

  const handleLogin = async ()=> {
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
    await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {email: email,password: password,}).then((response)=>{
      if(response.data?.Authenticated === true){
        if(isElectron){
          window.alert('Login Success')
        }
        else{
          Alert.alert('Success', 'Logged in!');
        }
      }
      else{
        if(isElectron){
          window.alert('Invalid Credentials')
        }
        else{
          Alert.alert('Invalid Credentials', 'Please Enter Valid Username or Password!!!');
        }
      }
    }).catch ((error) => {
      console.error('Axios Error Object:', error);
      const errorMessage = error.response?.data?.detail || 'Cannot connect to server';
      Alert.alert('Login Failed', errorMessage);
    }).finally(()=>{
      setLoading(false);
    })
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
        <View style={{
          display : forgotPasswordDialog ? 'none' : undefined,
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
            secureTextEntry
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
              setForgotPasswordDiallog(true)
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
          <Pressable
            onPress={() => handleLogin()}
            {...(LoginWebHover as any)}
            android_ripple={{
              color: '#811ccf',
              borderless: false
            }}
            style={({ pressed }) => [{
                    height : isElectron ? undefined : 50,
                    width: '100%',
                    elevation: 6,
                    marginTop: isElectron ? 40 : 50,
                    paddingVertical: 4,
                    borderRadius: 10,
                    backgroundColor: '#660eca',
                    borderColor: '#fff',
                    shadowColor: isLoginHovered ? '#2d2d2d' : 'transparent',
                    shadowOffset: { width: isLoginHovered ? 4 : 0, height: isLoginHovered ? 3 : 0 },
                    shadowOpacity: 0.4,
                    shadowRadius: 5,
                    overflow: 'hidden'
            },
              pressed && Platform.OS === 'ios' && { backgroundColor: '#811ccf' },
            ]}
            theme={{
              colors: { elevation: { level1: 'transparent' } }
            }}>
            <Text style={{
              color: '#ffffff',
              fontWeight: Platform.OS == 'web' ? '400' : '600',
              margin: 6,
              fontSize: isElectron ? 15 : 19,
              textAlign: 'center'
            }}>Login</Text>
          </Pressable>
        </View>
        {forgotPasswordDialog && <ForgotPasswordDialog
          forgotPasswordDialog = {forgotPasswordDialog} 
          setForgotPasswordDialog={setForgotPasswordDiallog} 
          setUserEmail={setEmail}/>}
        </ImageBackground>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}