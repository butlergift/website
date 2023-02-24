import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { Card, Text } from '@nextui-org/react';

import Tag from './Tag';
import Colors from '../colors';

const styles = {
  tagsContainer: {
    overflowX: 'scroll',
    overflowY: 'hidden',
  },
  image: {
    '& img': {
      height: '125%',
    },
  },
};

const ItemCard = ({ classes, item, onPress }) => (
  <Card
    isPressable
    css={{ w: '100%', h: '400px', border: `1px solid ${Colors.grayMedium}` }}
    onPress={onPress}
  >
    <Card.Body css={{ p: 0 }}>
      <Card.Image
        src={item.imageUrl}
        objectFit="fill"
        width="100%"
        height="100%"
        alt={item.productTags.join(',')}
        className={classes.image}
      />
    </Card.Body>
    <Card.Divider />
    <Card.Footer className={classes.tagsContainer}>
      <Text size={12} weight="bold" transform="uppercase" color={Colors.grayDarkX}>
        Tags:
      </Text>
      {
        item.productTags.map((tag) => <Tag key={tag} tagName={tag} />)
      }
    </Card.Footer>
  </Card>
);

ItemCard.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  item: PropTypes.instanceOf(Object),
  onPress: PropTypes.func,
};

ItemCard.defaultProps = {
  item: {},
  onPress: () => {},
};

export default injectSheet(styles)(ItemCard);
