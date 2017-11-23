import React from 'react';
import PropTypes from 'prop-types';

import s from './Intro.scss';

const Intro = ({ children, loading }) => (
  <div className={s.intro}>
    <div className={s.intro__container}>
      <div className={s.intro__row}>
        <div className={s.intro__col}>
          <h4 className={s(s.intro__title, { loading })}>{children}</h4>
        </div>
      </div>
    </div>
  </div>
);

Intro.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool,
};

export default Intro;
