import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';

import s from './ProductList.scss';

export default class ProductList extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const { children } = this.props;

    const childrenAsArray = Children.toArray(children);

    return (
      <div className={s.productList}>
        <h2 className={s.productList__title}>Our products</h2>
        <div className={s.productList__products}>
          {childrenAsArray.map((child, i) => {
            const key = `product-${i}`;

            return (
              <div
                key={key}
                className={s.productList__product}
              >
                {child}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
