import * as firebaseApp from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import * as firebaseFirestore from 'firebase/firestore';
import * as firebaseFunctions from 'firebase/functions';

// import { getAnalytics } from 'firebase/analytics';
// https://firebase.google.com/docs/web/setup#available-libraries

import * as userDetails from './userDetails';
import * as wishlistItems from './wishlistItems';
import * as wishlists from './wishlists';

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
export const auth = firebaseAuth.getAuth(app);
export const firestore = firebaseFirestore.getFirestore(app);
export const functions = firebaseFunctions.getFunctions(app);

export const getUserItemById = (args) => wishlistItems.getUserItemById(firebaseFirestore, firestore, args);
export const getUserListItemsById = (args) => wishlistItems.getUserListItemsById(firebaseFirestore, firestore, args);
export const getUserWishlists = (args) => wishlists.getUserWishlists(firebaseFirestore, firestore, args);
export const getUserDetails = (args) => userDetails.getUserDetails(firebaseFirestore, firestore, args);
