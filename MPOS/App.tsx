import React, { useState } from 'react';
import { StyleSheet, View, Alert, KeyboardAvoidingView, Platform, ImageBackground, TouchableOpacity, Image, Pressable } from 'react-native';
import { TextInput, Button, Text, PaperProvider } from 'react-native-paper';
import { API_BASE_URL } from './config';
import axios from 'axios';
import LoadingOverlay from './LoadingOverlay';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import Login from './Login'

export default function App() {

  const isMobileNative = Platform.OS === 'ios' || Platform.OS === 'android';
  const [user_email, setUserEmail] = useState('');
  const isElectron = Platform.OS === 'web';
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false)
  const [forgotPasswordDialog, setForgotPasswordDialog] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpVerification, setIsOtpVerification] = useState(false);

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
          setIsSignUp = {setIsSignUp}/>
        
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
          isSignUp = {isSignUp}/>}
        
        {isLoading && <LoadingOverlay/>}
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}