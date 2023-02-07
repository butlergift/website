import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Head from 'next/head';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Grid, Pagination, Spacer } from '@nextui-org/react';

import ItemCard from '../../components/shared/ItemCard';
import Colors from '../../components/colors';

import { actions as actionsListLP } from '../../redux/sliceListLandingPage';

const styles = {
  title: {
    color: Colors.grayDarkXX,
  },
  pagination: {
    '& div': {
      backgroundColor: Colors.primary,
    },
  },
};

const List = ({ classes, listId }) => {
  const listLPState = useSelector((state) => state.listLandingPage) || {};
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actionsListLP.getUserList({ listId }));
  }, [listId]);

  console.log('>>> listLPState', listLPState);

  return (
    <>
      <Head>
        <title>Butler Gift | List</title>
        <meta name="keywords" content="gifts" />
      </Head>
      <Container
        fluid
        display="flex"
        direction="column"
        alignContent="center"
        alignItems="center"
      >
        <Spacer y={1} />
        <h1 className={classes.title}>{listLPState.listTitle}</h1>
        <Grid.Container gap={2} justify="center">
          {
            listLPState.list.map((item) => (
              <Grid xs={12} sm={4} key={item.productId}>
                <ItemCard item={item} />
              </Grid>
            ))
          }
        </Grid.Container>
        <Spacer y={1} />
        {
          listLPState.list.length > 0 && (
            <Pagination
              color="success"
              total={listLPState.list.length}
              initialPage={1}
              className={classes.pagination}
              onChange={() => console.log('>>> TODO Pagination!')}
            />
          )
        }
        <Spacer y={1} />
      </Container>
    </>
  );
};

List.getInitialProps = async ({ query }) => {
  const { listId } = query;
  return { listId };
};

List.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  listId: PropTypes.string,
};

List.defaultProps = {
  listId: '',
};

export default injectSheet(styles)(List);
