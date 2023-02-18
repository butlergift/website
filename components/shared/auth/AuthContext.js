/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  browserLocalPersistence,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { auth } from '../../../firebase/index';

const AuthContext = createContext({
  user: null,
  signInWithGoogle: () => Promise,
  login: () => Promise,
  register: () => Promise,
  logout: () => Promise,
  forgotPassword: () => Promise,
  resetPassword: () => Promise,
});

export const useAuth = () => useContext(AuthContext);

// https://firebase.google.com/docs/auth/web/auth-state-persistence#supported_types_of_auth_state_persistence
setPersistence(auth, browserLocalPersistence);

export default function AuthContextProvider({ children }) {
  const [isUserLoading, setUserLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setUserLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  function login(email, password) {
    setUserLoading(true);
    return signInWithEmailAndPassword(auth, email, password)
      .then(() => setUserLoading(false))
      .catch((e) => {
        setUserLoading(false);
        throw e;
      });
  }

  function register(email, password) {
    setUserLoading(true);
    return createUserWithEmailAndPassword(auth, email, password)
      .then(() => setUserLoading(false))
      .catch((e) => {
        setUserLoading(false);
        throw e;
      });
  }

  function forgotPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function resetPassword(oobCode, newPassword) {
    return confirmPasswordReset(auth, oobCode, newPassword);
  }

  function logout() {
    setUserLoading(true);
    return signOut(auth)
      .then(() => setUserLoading(false))
      .catch((e) => {
        setUserLoading(false);
        throw e;
      });
  }

  function signInWithGoogle() {
    setUserLoading(true);
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
      .then(() => setUserLoading(false))
      .catch((e) => {
        setUserLoading(false);
        throw e;
      });
  }

  const value = {
    forgotPassword,
    isUserLoading,
    login,
    logout,
    register,
    resetPassword,
    signInWithGoogle,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
