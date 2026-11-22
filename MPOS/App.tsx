import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, KeyboardAvoidingView, Platform, ImageBackground, TouchableOpacity, Image, Pressable } from 'react-native';
import { TextInput, Button, Text, PaperProvider } from 'react-native-paper';
import { API_BASE_URL } from './config';
import axios from 'axios';
import LoadingOverlay from './LoadingOverlay';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import Login from './Login'
import PinVerification from './PinVerification';
import * as SecureStore from 'expo-secure-store';
import * as Keychain from 'react-native-keychain';

export default function App() {

  const isMobileNative = Platform.OS === 'ios' || Platform.OS === 'android';
  const [user_email, setUserEmail] = useState('');
  const isElectron = Platform.OS === 'web';
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [forgotPasswordDialog, setForgotPasswordDialog] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpVerification, setIsOtpVerification] = useState(false);
  const [isPinVerification, setIsPinVerification] = useState(false);
  const [isPinCheck, setIsPinCheck] = useState(false);

  async function getToken(TokenKey: string): Promise<string | null> {
    const credentials = await Keychain.getGenericPassword({service: TokenKey});
    if (credentials) {
        return credentials.password;
    }
    return null;
  }
  
  const checkToken = async () => {
      if(isElectron) {
        if(window.electronAPI){
          try {
              if(!localStorage.getItem('LongToken')) {
                setIsLogin(true)
                setIsPinVerification(false)
                return;
              }
              if (!localStorage.getItem('ShortToken')) {
                setIsPinVerification(true);
                return;
              }
          } catch (error) {
              console.error('Failed to encrypt fetch token:', error);
              setIsPinVerification(false)
              setIsLogin(true)
          }
        }
        else{
          try {
            if(getToken('LongToken') === null) {
              setIsPinVerification(false)
              setIsLogin(true)
              return;
            }
            if (getToken('ShortToken') === null) {
              setIsPinVerification(true);
              return;
            }
          } catch (error) {
            console.error('Failed to encrypt fetch token:', error);
            setIsLogin(true)
          }
        }
      }
      else{
        try{
          if(await SecureStore.getItemAsync('ShortToken') === null) {
            setIsPinVerification(false)
            setIsLogin(true)
            return;
          }
          if(await SecureStore.getItemAsync('LongToken') === null) {
            setIsPinVerification(true);
            return;
          }
        }
        catch(error) {
            console.error('Failed to encrypt fetch token:', error);
            setIsLogin(true)
        }
      }
    }
  useEffect(() => {
      checkToken();
    }, []);
  

  return (
    <PaperProvider>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          alignItems: isElectron ? 'center' : 'stretch',
          height: '100vh' as any,
          backgroundColor: '#FAFAFF',
          justifyContent: 'center',
        }}
      >
        {isPinVerification && (
          <PinVerification
            isPinCheck={isPinCheck}
            correctPin="123456"
            onSuccess={() => {
              Alert.alert('PIN Verified', 'You have successfully entered the correct PIN.');
            }}
          />
        )}
          <Login 
          user_email={user_email}
          setUserEmail={setUserEmail}
          forgotPasswordDialog={forgotPasswordDialog} 
          setForgotPasswordDialog={setForgotPasswordDialog} 
          isForgotPassword = {isForgotPassword}
          setIsForgotPassword = {setIsForgotPassword}
          API_BASE_URL={API_BASE_URL || ''} 
          setLoading={setIsLoading}
          isElectron={isElectron}
          isOtpVerification={isOtpVerification}
          setIsOtpVerification={setIsOtpVerification}
          isSignUp = {isSignUp}
          setIsSignUp = {setIsSignUp}
          setIsPinCheck = {setIsPinCheck}
          />
        
        {forgotPasswordDialog && <ForgotPasswordDialog
          forgotPasswordDialog = {forgotPasswordDialog} 
          setForgotPasswordDialog = {setForgotPasswordDialog} 
          isForgotPassword = {isForgotPassword}
          setIsForgotPassword = {setIsForgotPassword}
          user_email = {user_email}
          setUserEmail = {setUserEmail}
          API_BASE_URL = {API_BASE_URL || ''}
          setLoading = {setIsLoading}
          isElectron = {isElectron}
          isOtpVerification = {isOtpVerification}
          setIsOtpVerification = {setIsOtpVerification} 
          isSignUp = {isSignUp}
          setIsPinCheck = {setIsPinCheck}
          setIsPinVerification={setIsPinVerification}
          />}

        {isLoading && <LoadingOverlay/>}
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}