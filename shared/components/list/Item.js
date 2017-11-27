import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import get from 'lodash/get';

import s from './Item.scss';

export default class Item extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
    intro: PropTypes.string,
    image: PropTypes.object,
    url: PropTypes.string,
  }

  render() {
    const { title, intro, image, url } = this.props;

    const block = [
      <div key="top" className={s.item__top}>
        <div className={s.item__image}>
          {image ? (
            <img src={get(image, 'file.url')} alt={title} />
          ) : (
            <div className={s.item__placeholder} />
          )}
        </div>
      </div>,

      <div key="middle" className={s.item__middle}>
        <div className={s.item__title}>{title}</div>
        <div className={s.item__description}>{intro}</div>
      </div>,
    ];

    const content = url ? (
      <Link to={url} className={s.item__block}>
        {block}

        <div className={s.item__bottom}>
          <div className={s.item__link}>View more</div>
        </div>
      </Link>
    ) : (
      <div className={s.item__block}>
        {block}
      </div>
    );

    return (
      <li className={s.item}>
        {content}
      </li>
    );
  }
}
