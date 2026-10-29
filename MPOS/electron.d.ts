export {};

declare global {
  interface Window {
    electronAPI: {
      encryptToken: (token: string) => Promise<string>;
      decryptToken: (encryptedBase64: string) => Promise<string>;
    };
  }
}