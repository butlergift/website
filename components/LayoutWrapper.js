/* eslint-disable react/prop-types */
import Image from 'next/image';
import Link from 'next/link';
import { Navbar, Button } from '@nextui-org/react';
import srcLogoIcon from '../public/logo.svg';

const LayoutWrapper = ({ children }) => (
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
        <Navbar.Link color="inherit" as={Link} href="/signin">
          Login
        </Navbar.Link>
        <Navbar.Item>
          <Button auto flat as={Link} href="#">
            Sign Up
          </Button>
        </Navbar.Item>
      </Navbar.Content>
    </Navbar>
    { children }
  </div>
);

export default LayoutWrapper;
