import React from 'react';
import PropTypes from 'prop-types';

import s from './Content.scss';

const Content = ({ children }) => (
  <div className={s.content}>
    {children}
  </div>
);

Content.propTypes = {
  children: PropTypes.node,
};

export default Content;
