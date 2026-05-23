import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// ─── DEBUG: Log Firebase config to verify .env values are loaded ───
console.log('🔧 Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? '✅ loaded' : '❌ MISSING',
  authDomain: firebaseConfig.authDomain || '❌ MISSING',
  projectId: firebaseConfig.projectId || '❌ MISSING',
  storageBucket: firebaseConfig.storageBucket || '❌ MISSING',
  messagingSenderId: firebaseConfig.messagingSenderId || '❌ MISSING',
  appId: firebaseConfig.appId ? '✅ loaded' : '❌ MISSING',
});

const app = initializeApp(firebaseConfig);
console.log('🔥 Firebase app initialized:', app.name);

export const db = getFirestore(app);
console.log('📦 Firestore instance created for project:', firebaseConfig.projectId);
