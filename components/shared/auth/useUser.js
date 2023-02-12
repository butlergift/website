import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signOut, idTokenChangedListener } from '../../../firebase/index';

import {
  removeUserCookie,
  setUserCookie,
  getUserFromCookie,
} from './userCookie';

export const mapUserData = async (user) => {
  const { uid, email } = user;
  const token = await user.getIdToken(true);
  return { id: uid, email, token };
};

const useUser = () => {
  const [user, setUser] = useState();
  const router = useRouter();

  const logout = async () => signOut()
    .then(() => {
      router.push('/');
    })
    .catch(() => {
      router.push('/');
    });

  useEffect(() => {
    const cancelAuthListener = idTokenChangedListener(async (userToken) => {
      if (userToken) {
        const userData = await mapUserData(userToken);
        setUserCookie(userData);
        setUser(userData);
      } else {
        removeUserCookie();
        setUser();
      }
    });

    const userFromCookie = getUserFromCookie();
    if (!userFromCookie) {
      return () => {};
    }
    setUser(userFromCookie);
    return () => cancelAuthListener;
  }, []);

  return { user, logout };
};

export { useUser };
