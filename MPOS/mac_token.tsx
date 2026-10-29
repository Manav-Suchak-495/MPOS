import * as Keychain from 'react-native-keychain';

async function saveToken(token: string): Promise<void> {
    await Keychain.setGenericPassword('auth_session', token);
    }

    async function getToken(): Promise<string | null> {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
        return credentials.password; // The token is stored in the password field
    }
    return null;
    }

    async function removeToken(): Promise<boolean> {
    return await Keychain.resetGenericPassword();
    }