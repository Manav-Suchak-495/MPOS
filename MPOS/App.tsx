import React, { useState } from 'react';
import { StyleSheet, View, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, PaperProvider } from 'react-native-paper';
import axios from 'axios';

const API_BASE_URL: string = Platform.OS === 'android' 
  ? 'http://10.0.2.2:8000' 
  : 'http://localhost:8000';

export default function App() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter username and password.');
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
        style={styles.container}
      >
        <View style={styles.card}>
          <Text variant="headlineMedium" style={styles.title}>MPOS System</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Sign in to start billing</Text>

          <TextInput
            label="Username"
            value={email}
            onChangeText={(text: string) => setEmail(text)}
            mode="outlined"
            style={styles.input}
            autoCapitalize="none"
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={(text: string) => setPassword(text)}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <Button 
            mode="contained" 
            onPress={handleLogin} 
            loading={loading}
            style={styles.button}
          >
            Login
          </Button>
        </View>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100vh' as any,
    backgroundColor: '#eceff1',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a252c',
  },
  subtitle: {
    textAlign: 'center',
    color: '#607d8b',
    marginBottom: 20,
  },
  input: {
    marginBottom: 14,
  },
  button: {
    marginTop: 8,
    paddingVertical: 4,
  },
});