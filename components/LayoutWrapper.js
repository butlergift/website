/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Card, Loading, Navbar, Popover, User } from '@nextui-org/react';

import srcLogoIcon from '../public/logo.svg';
import Colors from './colors';
import { useAuth } from './shared/auth/AuthContext';

const DEFAULT_USER_PROFILE = 'https://firebasestorage.googleapis.com/v0/b/butlergift-dev-fdebd.appspot.com/o/images%2Fcompany_default_profile_512.png?alt=media&token=04afffe7-7162-424c-819c-8364e7afbf3f';
const styles = {
  logoutBtn: {
    backgroundColor: Colors.primaryLight,
    color: Colors.black,
    width: '100%',
  },
};

const LayoutWrapper = ({ children, classes }) => {
  const router = useRouter();
  const { user, logout, isUserLoading } = useAuth();

  let content = null;

  // Hide content if we are on login page
  if (router.pathname === '/login') {
    content = null;
  } else if (isUserLoading) {
    content = (
      <Navbar.Content>
        <Navbar.Item>
          <Loading
            css={{
              display: 'flex',
              justifyContent: 'center',
              margin: '50px',
            }}
            loadingCss={{
              $$loadingSize: '40px',
              $$loadingBorder: '2px',
              $$loadingColor: Colors.primary,
            }}
          />
        </Navbar.Item>
      </Navbar.Content>
    );
  } else if (user) {
    content = (
      <Navbar.Content>
        <Navbar.Item>
          <Popover>
            <Popover.Trigger>
              <User
                as="button"
                pointer
                src={user.photoURL || DEFAULT_USER_PROFILE}
                name={user.displayName}
                bordered
              />
            </Popover.Trigger>
            <Popover.Content>
              <Card>
                <Card.Body>
                  <Button onPress={logout} className={classes.logoutBtn}>Logout</Button>
                </Card.Body>
              </Card>
            </Popover.Content>
          </Popover>
        </Navbar.Item>
      </Navbar.Content>
    );
  } else {
    content = (
      <Navbar.Content>
        <Navbar.Item>
          <Button auto className={classes.logoutBtn} as={Link} href="/login">Login</Button>
        </Navbar.Item>
      </Navbar.Content>
    );
  }

  return (
    <div>
      <Navbar variant="static">
        <Navbar.Brand as={Link} href="/">
          <Image
            priority
            src={srcLogoIcon}
            height={42}
            width={42}
            alt="ButlerGift"
          />
        </Navbar.Brand>
        {content}
      </Navbar>
      { children }
    </div>
  );
};

LayoutWrapper.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default injectSheet(styles)(LayoutWrapper);
