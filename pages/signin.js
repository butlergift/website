import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Container, Text, Row } from '@nextui-org/react';

import StyledFirebaseAuth from '../components/shared/auth/StyledFirebaseAuth';
import { setUserCookie } from '../components/shared/auth/userCookie';
import { mapUserData } from '../components/shared/auth/useUser';

import Colors from '../components/colors';
import { authProviders, auth } from '../firebase/index';

const firebaseAuthConfig = ({ signInSuccessUrl, router }) => ({
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: authProviders.EmailAuthProvider,
      requireDisplayName: true,
    },
    authProviders.GoogleAuthProvider,
  ],
  // signInSuccessUrl: '/some_private_url',
  credentialHelper: 'none',
  callbacks: {
    signInSuccessWithAuthResult: ({ user }) => {
      if (!user) {
        router.push('/signin');
        return false; // to prevent redirect on success
      }

      // Using .then since async/await will make this return true causing a redirect
      mapUserData(user).then((userData) => {
        setUserCookie(userData);
        router.push(signInSuccessUrl);
      });

      return false; // to prevent redirect on success
    },
    signInFailure: () => {},
  },
});

const FirebaseAuth = ({ signInSuccessUrl }) => {
  const router = useRouter();
  const uiConfig = firebaseAuthConfig({ signInSuccessUrl, router });
  return (
    <Container fluid>
      <Row justify="center" align="center">
        <Text
          h1
          size={60}
          css={{
            color: Colors.grayDarkXX,
          }}
          weight="bold"
        >
          Login to ButlerGift
        </Text>
      </Row>
      <Row justify="center" align="center">
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={auth}
        />
      </Row>
    </Container>
  );
};

FirebaseAuth.propTypes = {
  signInSuccessUrl: PropTypes.string,
};

FirebaseAuth.defaultProps = {
  signInSuccessUrl: '/', // Home page default
};

export default FirebaseAuth;
