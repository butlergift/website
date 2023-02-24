import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Head from 'next/head';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Container, Grid, Loading, Pagination, Modal, Image, Row, Spacer, Text } from '@nextui-org/react';

import Tag from '../../components/shared/Tag';
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
  modalBody: {
    borderBottom: `1px solid ${Colors.grayMedium}`,
    '& ::-webkit-scrollbar': { // Safari and Chrome
      width: '2px',
      height: '0px',
      background: Colors.grayLight,
    },
    '& ::-webkit-scrollbar-thumb': { // Safari and Chrome
      background: Colors.primary,
    },
    '-ms-overflow-style': 'none', // Internet Explorer 10+
    scrollbarWidth: 'none', // Firefox
  },
  modalImage: {
    overflow: 'scroll',
  },
  modalHeader: {
    paddingTop: '0px',
    paddingBottom: '0px',
    marginTop: '0px',
    marginBottom: '0px',
  },
  modalTags: {
    overflowX: 'scroll',
    overflowY: 'hidden',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  modalCloseBtn: {
    width: '20%',
    height: '40px',
    background: Colors.grayMedium,
    color: Colors.grayDark,
  },
  modalBuyBtn: {
    width: '20%',
    height: '40px',
    background: Colors.primary,
    color: Colors.white,
  },
};

const List = ({ classes, listId }) => {
  const [currPage, setCurrPage] = useState(0);
  const listLPState = useSelector((state) => state.listLandingPage) || {};
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(actionsListLP.getUserListItemsById({ listId }));
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
        <h1 className={classes.title}>
          {`${listLPState?.listDetails?.name}${listLPState?.listDetails?.name?.toLowerCase().indexOf('list') > 0 ? '' : ' List'}`}
        </h1>
        <Grid.Container gap={2} justify="center">
          {
            listLPState.items.slice(NUM_ITEMS_PER_PAGE * currPage, NUM_ITEMS_PER_PAGE * (currPage + 1)).map((item) => (
              <Grid xs={12} sm={4} key={item.productId}>
                <ItemCard item={item} onPress={() => setSelectedItem(item)} />
              </Grid>
            ))
          }
        </Grid.Container>
        <Spacer y={1} />
        {
          listLPState.items.length > 0 && (
            <Pagination
              color="success"
              total={Math.ceil(listLPState.items.length / NUM_ITEMS_PER_PAGE)}
              initialPage={1}
              className={classes.pagination}
              onChange={(page) => setCurrPage(page - 1)}
            />
          )
        }
        <Spacer y={1} />
        <Modal
          scroll
          closeButton
          aria-labelledby="modal-item"
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          width="80%"
        >
          <Modal.Header className={classes.modalHeader}>
            <Row className={classes.modalTags}>
              <Text size={12} weight="bold" transform="uppercase" color={Colors.grayDarkX}>
                Tags:
              </Text>
              {
                (selectedItem?.productTags || []).map((tag) => <Tag key={tag} tagName={tag} />)
              }
            </Row>
          </Modal.Header>
          <Modal.Body className={classes.modalBody}>
            <Image
              src={selectedItem?.imageUrl}
              width="100%"
              height="100%"
              alt={(selectedItem?.productTags || []).join(',')}
              objectFit="fill"
              className={classes.modalImage}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button className={classes.modalCloseBtn} onPress={() => setSelectedItem(null)}>
              Close
            </Button>
            <Button
              className={classes.modalBuyBtn}
              onPress={() => {
                // eslint-disable-next-line no-undef
                window.open(selectedItem?.productUrl, '_blank');
              }}
            >
              Purchase
            </Button>
          </Modal.Footer>
        </Modal>
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
