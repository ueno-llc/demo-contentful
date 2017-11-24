import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Image from 'components/image';
import Loading from 'components/loading';

import s from './Curator.scss';

export default class Curator extends Component {

  static propTypes = {
    name: PropTypes.string,
    bio: PropTypes.string,
    image: PropTypes.string,
  }

  get loading() {
    return <Loading component="user" />;
  }

  render() {
    const { name, bio, image, isLoading } = this.props;

    const block = (
      <div className={s.curator__block}>
        {image && (
          <div className={s.curator__image}>
            <Image src={image} alt={name} width={60} height={60} />
          </div>
        )}

        <div className={s.curator__text}>
          <p className={s.curator__paragraph}>{name}</p>
          <p className={s.curator__paragraph}>{bio}</p>
          <span className={s.curator__tag}>The curator</span>
        </div>
      </div>
    );

    return (
      <div className={s.curator}>
        <div className={s.curator__container}>
          <div className={s.curator__row}>
            <div className={s.curator__col}>
              {isLoading ? this.loading : block}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
