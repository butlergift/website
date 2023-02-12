import cookies from 'js-cookie';

const USER_COOKIE = 'auth';

export const getUserFromCookie = () => {
  const cookie = cookies.get(USER_COOKIE);
  if (!cookie) {
    return {};
  }
  try {
    const parsedCookie = JSON.parse(cookie);
    return parsedCookie;
  } catch ({ name, message, stack }) {
    return {};
  }
};

export const setUserCookie = (user) => {
  if (Object.keys(user).length === 0) {
    return;
  }
  // TODO: Set for 1 hour?
  cookies.set(USER_COOKIE, JSON.stringify(user), {
    expires: 1 / 24,
  });
};

export const removeUserCookie = () => cookies.remove(USER_COOKIE);
