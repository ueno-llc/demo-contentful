import React, { Component } from 'react';
import PropTypes from 'prop-types';

import s from './Hero.scss';

export default class Hero extends Component {

  static propTypes = {
    children: PropTypes.node,
    image: PropTypes.object,
  };

  render() {
    const { children, image } = this.props;

    const hasUrl = image && image.file && image.file.url;

    const style = {
      backgroundImage: hasUrl ? `url(${image.file.url})` : null,
    };

    return (
      <div className={s.hero} style={style}>
        {children}
      </div>
    );
  }
}
