import React, { Component } from 'react';
import PropTypes from 'prop-types';

import s from './Author.scss';

export default class Author extends Component {

  static propTypes = {
    data: PropTypes.object,
  };

  render() {
    const { data } = this.props;
    const { name, title, image } = data;

    return (
      <div className={s.author}>
        {image && (
          <div className={s.author__image}>
            <img
              className={s.author__img}
              src={image.url}
              alt=""
              role="presentation"
            />
          </div>
        )}
        <div className={s.author__name}>{name}</div>
        <div className={s.author__title}>{title}</div>
      </div>
    );
  }
}
