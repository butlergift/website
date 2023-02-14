/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Head from 'next/head';
import { Container, Text, Spacer, Link } from '@nextui-org/react';
import Colors from '../components/colors';

const styles = {
  container: {
    '& h3': {
      color: Colors.grayDarkXX,
    },
    '& h4': {
      color: Colors.grayMediumX,
    },
    '& a': {
      color: Colors.grayMediumX,
    },
  },
  title: {
    color: Colors.grayDarkXX,
    textAlign: 'center',
  },
};

const Privacy = ({ classes }) => (
  <>
    <Head>
      <title>Butler Gift | Terms and Conditions</title>
      <meta name="keywords" content="gifts" />
    </Head>
    <Container fluid sm className={classes.container}>
      <Spacer y={1} />
      <h1 className={classes.title}>Terms and Conditions</h1>
      <Text h3>Introduction</Text>
      <Text h4>At ButlerGift, we are committed to protecting the privacy of our users. This privacy policy outlines the information we collect, how we use it, and the steps we take to ensure its security. Our goal is to provide our users with the best possible experience while using our platform, and this policy is designed to help achieve that goal.</Text>
      <Spacer y={1} />
      <Text h3>Information Collection:</Text>
      <Text h4>
        We collect basic information from our users to improve the performance of our platform and to provide a better user experience. This information may include:
        Contact information, such as name and email address.
        Information about your device and internet connection, including your IP address, browser type, and operating system.
        The information we collect is used solely for the purpose of improving our platform and is not sold or shared with third parties.
      </Text>
      <Spacer y={1} />
      <Text h3>Payment Processing:</Text>
      <Text h4>
        Monetary transactions are handled by our third-party payment processor, Stripe. We do not store or process any payment information on our servers. Stripe has its own privacy policy, which can be found at&nbsp;
        <Link color="text" href="https://stripe.com/privacy">Stripe&apos;s Policy</Link>
      </Text>
      <Spacer y={1} />
      <Text h3>User Login:</Text>
      <Text h4>
        We use Google Firebase to secure our user login and authentication workflows. Firebase is a secure and scalable platform for building and managing applications. By using Firebase, we are able to ensure the security and privacy of our users information. Firebase has its own privacy policy, which can be found at&nbsp;
        <Link color="text" href="https://firebase.google.com/support/privacy">Firebase&apos;s Policy</Link>
      </Text>
      <Spacer y={1} />
      <Text h3>Data Security:</Text>
      <Text h4>
        We take data security seriously and have implemented appropriate measures to protect the information we collect from unauthorized access, disclosure, and alteration. Our servers are securely stored in a controlled environment and are accessed only by authorized personnel.
      </Text>
      <Spacer y={1} />
      <Text h3>Changes to this Policy:</Text>
      <Text h4>
        We may update this policy from time to time to reflect changes to our privacy practices. If we make any material changes, we will provide notice to our users through our platform or by other means.
      </Text>
      <Spacer y={1} />
      <Text h3>Contact Us:</Text>
      <Text h4>
        If you have any questions or concerns about this privacy policy or the information we collect, please contact us at joinbutlergift@gmail.com.
      </Text>
      <Spacer y={3} />
      <Text h6>Effective Date: 2023/02/12</Text>
      <Spacer y={3} />
    </Container>
  </>
);

Privacy.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default injectSheet(styles)(Privacy);
