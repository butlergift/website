import React, { useEffect } from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

const styles = {
  container: {},
};

const ItemPage = ({ classes, itemId }) => {
  // const itemPageState = useSelector((state) => state.listLandingPage) || {};

  useEffect(() => {
    console.log('>>> ItemPageState - TODO: Get Item Info');
  }, [itemId]);

  // console.log('>>> ItemPageState', itemPageState);

  return (
    <div className={classes.container}>
      TODO: itemId:
      {itemId}
    </div>
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
