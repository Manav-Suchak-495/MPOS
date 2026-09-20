import { Platform } from 'react-native';

const API_URL = Platform.select({
  ios: 'http://localhost:8000',
  web: 'http://localhost:8000',
  android: 'http://10.0.2.2:8000',
});

export const API_BASE_URL = API_URL;