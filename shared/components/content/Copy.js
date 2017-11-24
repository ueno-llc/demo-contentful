import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import Loading from 'components/loading';

import s from './Copy.scss';

export default class Copy extends Component {

  static propTypes = {
    children: PropTypes.node,
    isLoading: PropTypes.bool,
  }

  get loading() {
    return (
      <div>
        <Loading component="heading" />
        <Loading height="38vh" />
        <Loading height="34vh" />
        <Loading />
      </div>
    );
  }

  render() {
    const { children, isLoading } = this.props;

    return (
      <div className={s(s.copy, { isLoading })}>
        <div className={s.copy__container}>
          <div className={s.copy__row}>
            <div className={s.copy__col}>
              {isLoading
                ? this.loading
                : (
                  <ReactMarkdown
                    skipHtml
                    className={s.copy__text}
                    source={children}
                  />
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
