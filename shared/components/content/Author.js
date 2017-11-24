import React from 'react';
import PropTypes from 'prop-types';

import s from './Author.scss';

const Author = ({ name, bio, image, loading }) => (
  <div className={s(s.author, { loading })}>
    <div className={s.author__container}>
      <div className={s.author__row}>
        <div className={s.author__col}>
          <div className={s.author__block}>
            <div className={s.author__image}>
              {image && <img alt={name} src={image} />}
            </div>

            <div className={s.author__text}>
              <p className={s.author__paragraph}>{name}</p>
              <p className={s.author__paragraph}>{bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

Author.propTypes = {
  name: PropTypes.string,
  bio: PropTypes.string,
  image: PropTypes.string,
  loading: PropTypes.bool,
};

export default Author;
