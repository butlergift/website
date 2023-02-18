import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Head from 'next/head';
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

const Home = ({ classes }) => (
  <>
    <Head>
      <title>Butler Gift | Home</title>
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
      <h1 className={classes.title}>Home Page</h1>
      <Grid.Container gap={2} justify="center">
        <h3>Great things will happen here soon enough, stay tuned!</h3>
      </Grid.Container>
      <Spacer y={1} />
    </Container>
  </>
);

Home.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default injectSheet(styles)(Home);
