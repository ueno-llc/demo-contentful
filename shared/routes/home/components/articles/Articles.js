import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import s from './Articles.scss';

export default class Articles extends Component {

  static propTypes = {
    title: PropTypes.string,
    subheading: PropTypes.string,
    articles: PropTypes.array,
    show: PropTypes.number,
  }

  render() {
    const { title, subheading, articles, show } = this.props;

    return (
      <div className={s.articles}>
        <div className={s.articles__container}>
          <div className={s.articles__row}>
            <div className={s.articles__header}>
              <h2 className={s.articles__headerTitle}>{title}</h2>
              <h2 className={s.articles__headerTitle}>{subheading}</h2>
            </div>

            {articles && (
              <ul className={s.articles__list}>
                {articles.slice(0, show).map((article, i) => (
                  <li
                    className={s.articles__item}
                    key={`article-${i}`} // eslint-disable-line
                  >
                    <Link className={s.articles__link} to={`/products/${article.id}`}>
                      <p className={s.articles__date}>— product {i + 1}</p>

                      <div className={s.articles__inner}>
                        <h2 className={s.articles__title}>{article.title}</h2>
                        <p className={s.articles__description}>{article.description}</p>

                        <img
                          className={s.articles__image}
                          src={article.image.file.url}
                          alt={article.title}
                        />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }
}
