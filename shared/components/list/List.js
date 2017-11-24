import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loading from 'components/loading';

import s from './List.scss';

export default class List extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
    subheading: PropTypes.string,
    children: PropTypes.node,
    isLoading: PropTypes.bool,
  }

  get loading() {
    const { title, subheading } = this.props;

    if (title && subheading) {
      return [
        <Loading key="heading" width="40%" component="heading" />,
        <Loading key="subheading" width="30%" component="subheading" />,
        <Loading key="item1" component="portraitImage" />,
        <Loading key="item2" component="portraitImage" />,
        <Loading key="item3" component="portraitImage" />,
      ];
    }

    return [
      <Loading key="item1" component="portraitImage" />,
      <Loading key="item2" component="portraitImage" />,
      <Loading key="item3" component="portraitImage" />,
    ];
  }

  render() {
    const { title, subheading, children, isLoading } = this.props;

    const block = (
      <div className={s.list__items}>
        {title && subheading && (
          <div className={s.list__header}>
            <h2 className={s.list__headerTitle}>{title}</h2>
            <h2 className={s.list__headerTitle}>{subheading}</h2>
          </div>
        )}

        {children}
      </div>
    );

    return (
      <div className={s.list}>
        <div className={s.list__container}>
          {isLoading ? this.loading : block}
        </div>
      </div>
    );
  }
}
