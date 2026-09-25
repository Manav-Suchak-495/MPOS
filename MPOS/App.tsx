import React, { useState } from 'react';
import { StyleSheet, View, Alert, KeyboardAvoidingView, Platform, ImageBackground, TouchableOpacity, Image, Pressable } from 'react-native';
import { TextInput, Button, Text, PaperProvider } from 'react-native-paper';
import { API_BASE_URL } from './config';
import axios from 'axios';
import CustomDialog from './customdialog';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import Login from './Login'

export default function App() {

  const isMobileNative = Platform.OS === 'ios' || Platform.OS === 'android';
  const isElectron = Platform.OS === 'web';
  const [loading, setLoading] = useState(false);
  const [forgotPasswordDialog, setForgotPasswordDialog] = useState(false);

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
        {!forgotPasswordDialog && <Login 
          forgotPasswordDialog={forgotPasswordDialog} 
          setForgotPasswordDialog={setForgotPasswordDialog} 
          API_BASE_URL={API_BASE_URL || ''} 
          setLoading={setLoading}/>}
        
        {forgotPasswordDialog && <ForgotPasswordDialog
          forgotPasswordDialog = {forgotPasswordDialog} 
          setForgotPasswordDialog={setForgotPasswordDialog} />}
        </ImageBackground>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}