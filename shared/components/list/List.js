import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import s from './List.scss';

export default class List extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
    subheading: PropTypes.string,
    children: PropTypes.node,
  };

  render() {
    const { title, subheading, children } = this.props;

    return (
      <div className={s.list}>
        <div className={s.list__container}>
          <div className={s.list__items}>
            {title && subheading && (
              <div className={s.list__header}>
                <h2 className={s.list__headerTitle}>{title}</h2>
                <h2 className={s.list__headerTitle}>{subheading}</h2>
              </div>
            )}

            {children}
          </div>
        </div>
      </div>
    );
  }
}
