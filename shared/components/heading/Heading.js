import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import s from './Heading.scss';

export default class Heading extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
  }

  static defaultProps = {
    children: undefined,
  }

  render() {
    const { children } = this.props;
    return (
      <div className={s.heading}>
        {children}
      </div>
    );
  }
}
