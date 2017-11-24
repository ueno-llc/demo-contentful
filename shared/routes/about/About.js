import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withJob } from 'react-jobs';
import { inject } from 'mobx-react';
import ReactMarkdown from 'react-markdown';

import Hero from 'components/hero';

class About extends Component {

  static propTypes = {
    jobResult: PropTypes.object,
  }

  render() {
    const { jobResult: about } = this.props;
    const { title, text } = about;

    return (
      <div>
        <Helmet title={title} />

        <Hero>
          <h1>Such Ueno.</h1>
          <h2>Very digital. Much agency.</h2>
          <p>Ueno is a full-service, first-rate, all-singing, all-dancing, fast-growing,
          flame-haired, bull-chested, fun-loving, not-quite-bourgeois,
          not-quite-bohemian agency, busy designing and building beautiful
          digital products, brands, and experiences.</p>
        </Hero>

        <ReactMarkdown skipHtml source={text} />
      </div>
    );
  }
}

const aboutWithJob = withJob({
  work: ({ contentful }) => contentful.fetchSingleByContentType('about'),
  LoadingComponent: () => (
    <div>
      <Hero isLoading />
    </div>
  ),
})(About);

export default inject('contentful')(aboutWithJob);
