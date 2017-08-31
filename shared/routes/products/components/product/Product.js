import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import s from './Product.scss';

export default class Product extends Component {

  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.object,
  };

  render() {
    const { title, description, image } = this.props;

    const hasUrl = image && image.file && image.file.url;

    return (
      <div className={s.product}>
        <h3 className={s.product__title}>{title}</h3>
        <div className={s.product__content}>
          <div className={s.product__description}>
            <ReactMarkdown
              skipHtml
              source={description}
              className={s.product__markdown}
            />
          </div>
          {hasUrl ? (
            <div className={s.product__image}>
              <img
                className={s.product__img}
                src={image.file.url}
                alt=""
                role="presentation"
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
