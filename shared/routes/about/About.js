import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withJob } from 'react-jobs';
import { inject } from 'mobx-react';
import ReactMarkdown from 'react-markdown';

import Intro from 'components/intro';
import Segment from 'components/segment';

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

        <Intro>
          <h1>Such Ueno.</h1>
          <h2>Very digital. Much agency.</h2>
          <p>Ueno is a full-service, first-rate, all-singing, all-dancing, fast-growing,
          flame-haired, bull-chested, fun-loving, not-quite-bourgeois,
          not-quite-bohemian agency, busy designing and building beautiful
          digital products, brands, and experiences.</p>
        </Intro>

        <Segment>
          <ReactMarkdown skipHtml source={text} />
        </Segment>
      </div>
    );
  }
}

const aboutWithJob = withJob({
  work: ({ contentful }) => contentful.fetchSingleByContentType('about'),
  LoadingComponent: () => (
    <div>
      <Intro isLoading />
      <Segment />
      <Segment />
    </div>
  ),
})(About);

export default inject('contentful')(aboutWithJob);
