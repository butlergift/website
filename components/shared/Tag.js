import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { Button } from '@nextui-org/react';

import Colors from '../colors';
import CloseIcon from '../../public/CloseIcon';

const styles = {
  tag: {
    backgroundColor: Colors.primaryLight,
    color: Colors.black,
    cursor: 'auto',
    width: '100%',
  },
  tagCloseButton: {
    backgroundColor: Colors.primary,
    width: '25px !important',
    maxWidth: '25px !important',
    minWidth: '25px !important',
  },
};

function Tag({ classes, tagName, onPressTag, onPressClose, isClosable }) {
  return (
    // Adding color="success" to overwrite the active color. Todo: Find out how to replace this.
    <Button.Group size="xs" color="success">
      <Button
        flat
        size="xs"
        className={classes.tag}
        onPress={onPressTag}
        ripple={false}
        animated={false}
      >
        {tagName}
      </Button>
      {
        isClosable && (
          <Button
            size="xs"
            onPress={onPressClose}
            icon={<CloseIcon fill="currentColor" filled />}
            className={classes.tagCloseButton}
          />
        )
      }
    </Button.Group>
  );
}

Tag.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  tagName: PropTypes.string,
  onPressClose: PropTypes.func,
  onPressTag: PropTypes.func,
  isClosable: PropTypes.bool,
};

Tag.defaultProps = {
  tagName: '',
  onPressClose: () => {},
  onPressTag: () => {},
  isClosable: false,
};

export default injectSheet(styles)(Tag);
