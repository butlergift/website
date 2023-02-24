import React, { useEffect } from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Card, Container, Loading, Text } from '@nextui-org/react';
import { useSelector, useDispatch } from 'react-redux';

import { actions as actionsItemLP } from '../../redux/sliceItemLandingPage';

import Tag from '../../components/shared/Tag';
import Colors from '../../components/colors';

const styles = {
  container: {
    width: '100%',
    margin: '25px',
  },
  title: {},
  containerItem: {
    width: '100%',
    height: '600px',
    flexDirection: 'row',
    border: `1px solid ${Colors.grayMedium}`,
  },
  containerImage: {
    padding: '0px',
    borderRight: `1px solid ${Colors.grayMedium}`,
    overflowX: 'scroll',
    overflowY: 'scroll',
  },
  containerOptions: {
    padding: '20px',
    width: '35%',
  },
};

const ItemPage = ({ classes, itemId }) => {
  const listLPState = useSelector((state) => state.listLandingPage) || {};
  const itemLPState = useSelector((state) => state.itemLandingPage) || {};
  const item = itemLPState.item || {};
  const dispatch = useDispatch();

  useEffect(() => {
    // Find item from existing list
    const itm = listLPState.items.find((i) => i.productId === itemId);
    if (itm && Object.keys(itm).length > 0) {
      dispatch(actionsItemLP.setItem({ itemId, item: itm }));
      return;
    }

    // Fetch item if none present
    if (Object.keys(item).length === 0) {
      dispatch(actionsItemLP.getUserItemById({ itemId }));
    }
  }, [item]);

  let content = null;
  if (itemLPState.loading) {
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
      <div className={classes.container}>
        <Text h1 size={30} weight="bold" color={Colors.grayDarkXX} className={classes.title}>
          Item Details
        </Text>
        <Card className={classes.containerItem}>
          <Card.Body className={classes.containerImage}>
            <Card.Image
              src={item.imageUrl}
              objectFit="cover"
              width="100%"
              height="100%"
              alt={(item.productTags || []).join(',')}
            />
          </Card.Body>
          <Card.Body className={classes.containerOptions}>
            <Text size={12} weight="bold" transform="uppercase" color={Colors.grayDarkX}>
              Tags:
            </Text>
            {
              (item.productTags || []).map((tag) => <Tag key={tag} tagName={tag} />)
            }
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Butler Gift | Item</title>
        <meta name="keywords" content="gifts" />
      </Head>
      <Container
        fluid
        display="flex"
        direction="column"
        alignContent="center"
        alignItems="center"
        xl
      >
        {content}
      </Container>
    </>
  );
};

ItemPage.getInitialProps = async ({ query }) => {
  const { itemId } = query;
  return { itemId };
};

ItemPage.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  itemId: PropTypes.string,
};

ItemPage.defaultProps = {
  itemId: '',
};

export default injectSheet(styles)(ItemPage);
