import React from 'react';
import PropTypes from 'prop-types';

import s from './Curator.scss';

const Curator = ({ name, bio, image }) => (
  <div className={s.curator}>
    <div className={s.curator__container}>
      <div className={s.curator__row}>
        <div className={s.curator__col}>
          <div className={s.curator__block}>
            <div className={s.curator__image}>
              {image && (
                <img src={image} role="presentation" />
              )}
            </div>

            <div className={s.curator__text}>
              <p className={s.curator__paragraph}>{name}</p>
              <p className={s.curator__paragraph}>{bio}</p>
              <span className={s.curator__tag}>The curator</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

Curator.propTypes = {
  name: PropTypes.string,
  bio: PropTypes.string,
  image: PropTypes.string,
};

export default Curator;
