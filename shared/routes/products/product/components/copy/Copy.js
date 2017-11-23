import React from 'react';
import PropTypes from 'prop-types';
import Marked from 'marked';

import s from './Copy.scss';

const Copy = ({ children }) => (
  <div className={s.copy}>
    <div className={s.copy__container}>
      <div className={s.copy__row}>
        <div className={s.copy__col}>
          <p
            className={s.copy__text}
            dangerouslySetInnerHTML={{ __html: Marked(children) }} // eslint-disable-line
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
