import React, { Component } from 'react';
import PropTypes from 'prop-types';

import s from './Blogs.scss';

export default class Blogs extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const { children } = this.props;

    return (
      <div className={s.blogs}>
        {children}
      </div>
    );
  }
}
