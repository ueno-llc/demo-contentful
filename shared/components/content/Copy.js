import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import s from './Copy.scss';

const Copy = ({ children }) => (
  <div className={s.copy}>
    <div className={s.copy__container}>
      <div className={s.copy__row}>
        <div className={s.copy__col}>
          <ReactMarkdown
            skipHtml
            className={s.copy__text}
            source={children}
          />
        </div>
      </div>
    </div>
  </div>
);

Copy.propTypes = {
  children: PropTypes.node,
};

export default Copy;
