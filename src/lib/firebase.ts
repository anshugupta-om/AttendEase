import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const cleanFirebaseUrl = (val: string | undefined): string | undefined => {
  if (!val) return val;
  return val.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: cleanFirebaseUrl(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: cleanFirebaseUrl(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase only if the config values exist (helps gracefully handle missing config)
const isFirebaseConfigured = !!firebaseConfig.apiKey;

if (!isFirebaseConfigured) {
  console.warn(
    'Firebase environment variables are missing. Auth features will fail until VITE_FIREBASE_* env vars are set.'
  );
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// Set custom parameters if needed
googleProvider.setCustomParameters({
  prompt: 'select_account',
});
