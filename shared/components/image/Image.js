import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import s from './Image.scss';

export default class Image extends PureComponent {

  static propTypes = {
    src: PropTypes.string.isRequired,
    src2x: PropTypes.string,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    alt: PropTypes.string,
    className: PropTypes.string,
    isLoading: PropTypes.bool,
  }

  static defaultProps = {
    alt: '',
  }

  state = {
    loaded: false,
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.onLoad();
    }, 200);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  onLoad = () => {
    if (this.image) {
      const loaded = this.image.complete;

      if (loaded) {
        clearTimeout(this.timer);
      }

      this.setState({
        loaded,
      });
    }
  }

  render() {
    const { width, height, src, src2x, alt, className, isLoading } = this.props;
    const { loaded } = this.state;
    const srcSet = src2x ? `${src} 1x, ${src2x} 2x` : undefined;

    return (
      <div className={s(s.image, className, { loaded: !isLoading && loaded })}>
        <div
          className={s.image__ratio}
          style={{ paddingBottom: `${(height / width) * 100}%` }}
        />

        <img
          ref={(el) => { this.image = el; }}
          className={s.image__image}
          src={src}
          srcSet={srcSet}
          alt={alt}
        />
      </div>
    );
  }
}
