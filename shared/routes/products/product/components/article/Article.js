import React, { cloneElement, Children } from 'react';
import PropTypes from 'prop-types';

import s from './Article.scss';


const Article = ({ children }) => (
  <div className={s.article}>
    {children}
  </div>
);

Article.propTypes = {
  children: PropTypes.node,
};

export default Article;
