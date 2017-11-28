import React from 'react';
import PropTypes from 'prop-types';

import s from './Loading.scss';

const Item = ({ width, height, component, loaded }) => (
  <div style={{ width, height }} className={s(`loading__${component}`, { loaded })}>
    <span className={s.loading__inner} />
  </div>
);

Item.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  loaded: PropTypes.bool,
  component: PropTypes.oneOf(['heading', 'subheading', 'paragraph', 'image', 'portraitImage', 'user']),
};

Item.defaultProps = {
  component: 'paragraph',
};

export default Item;
