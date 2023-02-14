/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Card, Loading, Navbar, Popover, User } from '@nextui-org/react';

import srcLogoIcon from '../public/logo.svg';
import Colors from './colors';
import { useAuth } from './shared/auth/AuthContext';

const styles = {
  logoutBtn: {
    backgroundColor: Colors.primaryLight,
    color: Colors.black,
    width: '100%',
  },
};

const LayoutWrapper = ({ children, classes }) => {
  const [isLoading, setLoading] = useState(true);
  const { currentUser, logout, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setLoading(true);
      return;
    }
    setLoading(false);
  }, [currentUser]);

  let content = null;
  if (isLoading) {
    content = (
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
    );
  } else if (currentUser) {
    content = (
      <Popover>
        <Popover.Trigger>
          <User
            as="button"
            pointer
            src={currentUser.photoURL}
            name={currentUser.displayName}
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
    );
  } else {
    content = (
      <Button auto className={classes.logoutBtn} onPress={() => signInWithGoogle()}>Login</Button>
      // <Button auto flat as={Link} href="/signin">Login</Button>
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
        <Navbar.Content>
          <Navbar.Item>
            { content }
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
      { children }
    </div>
  );
};

LayoutWrapper.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default injectSheet(styles)(LayoutWrapper);
