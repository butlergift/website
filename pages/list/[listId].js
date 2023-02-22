import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Head from 'next/head';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Grid, Loading, Pagination, Spacer } from '@nextui-org/react';

import ItemCard from '../../components/shared/ItemCard';
import Colors from '../../components/colors';

import { actions as actionsListLP } from '../../redux/sliceListLandingPage';

const NUM_ITEMS_PER_PAGE = 10;

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
  const [currPage, setCurrPage] = useState(0);
  const listLPState = useSelector((state) => state.listLandingPage) || {};
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actionsListLP.getUserList({ listId }));
  }, [listId]);

  let content = null;
  if (listLPState.loading) {
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
  } else {
    content = (
      <>
        <Spacer y={1} />
        <h1 className={classes.title}>{listLPState.listTitle}</h1>
        <Grid.Container gap={2} justify="center">
          {
            listLPState.list.slice(NUM_ITEMS_PER_PAGE * currPage, NUM_ITEMS_PER_PAGE * (currPage + 1)).map((item) => (
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
              total={Math.ceil(listLPState.list.length / NUM_ITEMS_PER_PAGE)}
              initialPage={1}
              className={classes.pagination}
              onChange={(page) => setCurrPage(page - 1)}
            />
          )
        }
        <Spacer y={1} />
      </>
    );
  }

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
        {content}
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
