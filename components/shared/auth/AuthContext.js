/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { httpsCallable } from 'firebase/functions';
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
  updateProfile,
} from 'firebase/auth';

import { auth, functions } from '../../../firebase/index';
import { actions as actionsUserDetails } from '../../../redux/sliceUserDetails';

const AuthContext = createContext({
  forgotPassword: () => Promise,
  isUserLoading: false,
  login: () => Promise,
  logout: () => Promise,
  register: () => Promise,
  resetPassword: () => Promise,
  signInWithGoogle: () => Promise,
  updateUserProfile: () => Promise,
  user: null,
});

export const useAuth = () => useContext(AuthContext);

// https://firebase.google.com/docs/auth/web/auth-state-persistence#supported_types_of_auth_state_persistence
setPersistence(auth, browserLocalPersistence);

export default function AuthContextProvider({ children }) {
  const [isUserLoading, setUserLoading] = useState(false);

  const userDetailsState = useSelector((state) => state.userDetails) || {};
  const dispatch = useDispatch();

  // Not needed since we will use Redux which will be controlled by all actions below
  // const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(actionsUserDetails.setUser({
          userId: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
        }));
        dispatch(actionsUserDetails.getUserDetails({ userId: auth.currentUser.uid }));
      }
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

  function register(email, password, birthday) {
    setUserLoading(true);
    return createUserWithEmailAndPassword(auth, email, password)
      .then(async ({ user: newUser }) => httpsCallable(functions, 'Users_onUpdate')({ userId: newUser.uid, birthday }))
      .then(() => dispatch(actionsUserDetails.setUserDetails({ birthday })))
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
      .then(() => dispatch(actionsUserDetails.resetState()))
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

  function updateUserProfile({ displayName, birthday }) {
    setUserLoading(true);
    const promise1 = displayName ? updateProfile(auth.currentUser, { displayName }) : Promise.resolve();
    const promise2 = birthday ? httpsCallable(functions, 'Users_onUpdate')({ userId: auth.currentUser.uid, birthday }) : Promise.resolve();
    return Promise.all([promise1, promise2])
      .then(() => setUserLoading(false))
      .then(() => dispatch(actionsUserDetails.setUserDetails({ displayName, birthday })))
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
    updateUserProfile,
    user: userDetailsState.user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
