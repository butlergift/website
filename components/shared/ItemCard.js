import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { useRouter } from 'next/router';
import { Card, Text } from '@nextui-org/react';

import Tag from './Tag';
import Colors from '../colors';

const styles = {
  tagsContainer: {
    overflowX: 'scroll',
    overflowY: 'hidden',
  },
};

const ItemCard = ({ classes, item }) => {
  const router = useRouter();

  return (
    <Card
      isPressable
      css={{ w: '100%', h: '400px' }}
      onPress={() => router.push(`/item/${item.productId}`)}
    >
      <Card.Body css={{ p: 0 }}>
        <Card.Image
          src={item.imageUrl}
          objectFit="cover"
          width="100%"
          height="100%"
          alt={item.productTags.join(',')}
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
};

ItemCard.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  item: PropTypes.instanceOf(Object),
};

ItemCard.defaultProps = {
  item: {},
};

export default injectSheet(styles)(ItemCard);
