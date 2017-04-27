import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Author from 'components/author';
import s from './Blog.scss';

/**
 * Button Component
 * feel free to modify to fit the project.
 */
export default class Button extends Component {

  static propTypes = {
    single: PropTypes.bool, // showing a single entry
    id: PropTypes.string,
    title: PropTypes.string,
    intro: PropTypes.string,
    text: PropTypes.string,
    author: PropTypes.object,
    date: PropTypes.string,
  };

  render() {
    const { single, id, title, intro, text, author, date } = this.props;
    const link = `/blog/${id}`;
    const formattedDate = new Date(date).toString();

    return (
      <div
        className={s(s.blog, {
          [single]: single,
        })}
      >
        <div className={s.blog__author}>
          <Author data={author} />
        </div>
        <div className={s.blog__content}>
          <h3 className={s.blog__title}>
            {single ?
              title
            : (
              <Link
                className={s.blog__link}
                to={link}
              >
                {title}
              </Link>
            )}
          </h3>
          <div className={s.blog__date}>{formattedDate}</div>
          <div className={s.blog__intro}>{intro}</div>
          {!single ?
            <Link
              className={s.blog__more}
              to={link}
            >
              Continue reading
            </Link>
          : null}
          {text ? (
            <div className={s.blog__text}>
              <ReactMarkdown skipHtml source={text} />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
