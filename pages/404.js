import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Grid, Spacer } from '@nextui-org/react';
import Colors from '../components/colors';

const styles = {
  container: {
    color: Colors.grayDark,
  },
  title: {
    color: Colors.grayDarkXX,
  },
};

const NotFound = ({ classes }) => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      // router.go(-1)
      // router.go(1)
      router.push('/');
    }, 3000);
  }, []);

  return (
    <>
      <Head>
        <title>Butler Gift | 404</title>
        <meta name="keywords" content="gifts" />
      </Head>
      <Container
        fluid
        display="flex"
        direction="column"
        alignContent="center"
        alignItems="center"
        className={classes.container}
      >
        <Spacer y={1} />
        <h1 className={classes.title}>Ooops...</h1>
        <Grid.Container gap={2} justify="center">
          <h3>That page cannot be found :(</h3>
        </Grid.Container>
        <Grid.Container gap={2} justify="center">
          <p>
            Going back to the
            <Link href="/"> Homepage </Link>
            in 3 seconds...
          </p>
        </Grid.Container>
        <Spacer y={1} />
      </Container>
    </>
  );
};

NotFound.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default injectSheet(styles)(NotFound);
