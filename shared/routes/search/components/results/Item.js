import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import s from './Item.scss';

export default class Group extends PureComponent {

  static propTypes = {
    url: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
  }

  render() {
    const { url, image, title, text } = this.props;

    return (
      <Link to={url} className={s.item}>
        <img className={s.item__image} src={image} alt={title} />

        <div className={s.item__infos}>
          <h4 className={s.item__title}>{title}</h4>
          <p className={s.item__text}>{text}</p>
        </div>
      </Link>
    );
  }
}
