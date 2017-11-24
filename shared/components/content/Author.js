import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Image from 'components/image';
import Loading from 'components/loading';

import s from './Author.scss';

export default class Author extends Component {

  static propTypes = {
    name: PropTypes.string,
    bio: PropTypes.string,
    image: PropTypes.string,
    isLoading: PropTypes.bool,
  }

  get loading() {
    return <Loading component="user" />;
  }

  render() {
    const { name, bio, image, isLoading } = this.props;

    const block = (
      <div className={s.author__block}>
        {image && (
          <div className={s.author__image}>
            <Image src={image} alt={name} width={60} height={60} />
          </div>
        )}

        <div className={s.author__text}>
          <p className={s.author__paragraph}>{name}</p>
          <p className={s.author__paragraph}>{bio}</p>
        </div>
      </div>
    );

    return (
      <div className={s(s.author, { isLoading })}>
        <div className={s.author__container}>
          <div className={s.author__row}>
            <div className={s.author__col}>
              {isLoading ? this.loading : block}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
