import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, User } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, getDocFromServer } from "firebase/firestore";

// Your web app's Firebase configuration provided by user
export const firebaseConfig = {
  apiKey: "AIzaSyD7DNPYvIH0Erwxnp4ZEwpMgBmz0dHHImQ",
  authDomain: "truthlens-ai-59eea.firebaseapp.com",
  projectId: "truthlens-ai-59eea",
  storageBucket: "truthlens-ai-59eea.firebasestorage.app",
  messagingSenderId: "769473836686",
  appId: "1:769473836686:web:9c6e111b5c630cfc4dfbdf"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Stores or updates the authenticated user's profile information in Firestore
 */
export async function saveUserProfile(user: User, additionalData?: { fullName?: string }) {
  if (!user) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    const userData = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || additionalData?.fullName || user.email?.split('@')[0] || 'TruthLens User',
      photoURL: user.photoURL || '',
      providerId: user.providerData?.[0]?.providerId || 'password',
      lastLoginAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!snap.exists()) {
      await setDoc(userRef, {
        ...userData,
        createdAt: new Date().toISOString(),
        role: 'user',
        scanCount: 0
      });
    } else {
      await setDoc(userRef, userData, { merge: true });
    }
  } catch (err) {
    console.error('Error saving user profile to Firestore:', err);
  }
}

// Validate connection to Firestore
async function testConnection() {
  try {
    await getDocFromServer(doc(db, '_connection_test_', 'init'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.warn("Firestore connection check: Client is offline or initializing.");
    }
  }
}

testConnection();
