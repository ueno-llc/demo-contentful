import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/button';

import s from './IntroText.scss';

const buttonType = (<Button />).type;

export default class IntroText extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const { children } = this.props;
    const childrenAsArray = Children.toArray(children);

    return (
      <div className={s.introText}>
        {childrenAsArray.map((child) => {
          if (child.type === buttonType) {
            return (
              <div key={`button-${child.to}`} className={s.introText__button}>{child}</div>
            );
          }

          return child;
        })}
      </div>
    );
  }
}
