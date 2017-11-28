import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import s from './Group.scss';

export default class Group extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
  }

  render() {
    const { children, title } = this.props;

    return (
      <div className={s.group}>
        <h2 className={s.group__heading}>{title}</h2>

        {children}
      </div>
    );
  }
}
