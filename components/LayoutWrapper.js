/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, Button, Card, Loading, Navbar, Popover } from '@nextui-org/react';
import { AiOutlineUser } from 'react-icons/ai';

import srcLogoIcon from '../public/logo.svg';
import Colors from './colors';
import { useAuth } from './shared/auth/AuthContext';

const styles = {
  loginBtn: {
    backgroundColor: Colors.white,
    color: Colors.black,
    margin: '10px',
    padding: 0,
  },
  rightMenuBtn: {
    backgroundColor: Colors.white,
    color: Colors.black,
    margin: '10px',
    padding: 0,
    '&:hover': {
      backgroundColor: Colors.grayMedium,
    },
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    border: `1px solid ${Colors.grayMediumX}`,
  },
  defaultUserPhoto: {
    color: Colors.grayDarkXX,
  },
};

const LayoutWrapper = ({ children, classes }) => {
  const router = useRouter();
  const { user, logout, isUserLoading } = useAuth();

  let content = null;

  // Hide content if we are on login page
  if (router.pathname === '/login') {
    content = (
      <Navbar.Content>
        <Navbar.Item>
          <Button auto className={classes.loginBtn} as={Link} href="/">Home</Button>
        </Navbar.Item>
      </Navbar.Content>
    );
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
              <Avatar
                src={user.photoURL}
                className={classes.userAvatar}
                text={user.displayName}
                icon={<AiOutlineUser size={40} className={classes.defaultUserPhoto} />}
              />
            </Popover.Trigger>
            <Popover.Content>
              <Card>
                <Card.Body css={{ padding: 0, margin: 0 }}>
                  <Button className={classes.rightMenuBtn} as={Link} href="/login">Profile</Button>
                  <Card.Divider css={{ alignSelf: 'center', width: '75%' }} />
                  <Button onPress={logout} className={classes.rightMenuBtn}>Logout</Button>
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
          <Button auto className={classes.loginBtn} as={Link} href="/login">Login</Button>
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
