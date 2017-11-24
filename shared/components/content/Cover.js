import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import Image from 'components/image';

import s from './Cover.scss';

export default class Cover extends Component {

  static propTypes = {
    children: PropTypes.object,
    isLoading: PropTypes.bool,
  }

  render() {
    const { children, isLoading } = this.props;

    if (!children) {
      return null;
    }

    return (
      <div className={s.cover}>
        <div className={s.cover__container}>
          <Image
            src={get(children, 'file.url')}
            className={s.cover__img}
            width={1290}
            height={860}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }
}
