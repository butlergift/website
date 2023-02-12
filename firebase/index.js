import * as firebaseApp from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import * as firebaseFirestore from 'firebase/firestore';

// import { getAnalytics } from 'firebase/analytics';
// https://firebase.google.com/docs/web/setup#available-libraries

import * as wishlists from './wishlists';
import * as wishlistItems from './wishlistItems';

let app = null;
try {
  app = firebaseApp.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
} catch (err) {
  app = firebaseApp.getApp(); // if already initialized, use that one
}

// const analytics = getAnalytics(app);
const firestore = firebaseFirestore.getFirestore(app);

export const getUserWishlists = (args) => wishlists.getUserWishlists(firebaseFirestore, firestore, args);
export const getListItemsById = (args) => wishlistItems.getListItemsById(firebaseFirestore, firestore, args);

// --------------------------------------------------
// AUTH
// --------------------------------------------------

export const auth = firebaseAuth.getAuth(app);

export async function signOut() {
  try {
    await firebaseAuth.signOut(auth);
    return {};
  } catch ({ name, message, stack }) {
    return { error: { name, message, stack } };
  }
}

export async function idTokenChangedListener(callbackListener) {
  try {
    return firebaseAuth.onIdTokenChanged(callbackListener);
  } catch ({ name, message, stack }) {
    return { error: { name, message, stack } };
  }
}

export const authProviders = {
  EmailAuthProvider: firebaseAuth.EmailAuthProvider.PROVIDER_ID,
  GoogleAuthProvider: firebaseAuth.GoogleAuthProvider.PROVIDER_ID,
};
