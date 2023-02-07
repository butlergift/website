/* eslint-disable react/prop-types */
import Image from 'next/image';
import { Navbar, Button, Link } from '@nextui-org/react';
import srcLogoIcon from '../public/logo.svg';

const LayoutWrapper = ({ children }) => (
  <div>
    <Navbar variant="static">
      <Navbar.Brand>
        <Image
          priority
          src={srcLogoIcon}
          height={42}
          width={42}
          alt="ButlerGift"
        />
      </Navbar.Brand>
      {/* <Navbar.Content hideIn="xs" variant="highlight-rounded">
        <Navbar.Link href="#">Features</Navbar.Link>
        <Navbar.Link isActive href="#">Customers</Navbar.Link>
        <Navbar.Link href="#">Pricing</Navbar.Link>
        <Navbar.Link href="#">Company</Navbar.Link>
      </Navbar.Content> */}
      <Navbar.Content>
        <Navbar.Link color="inherit" href="#">
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
