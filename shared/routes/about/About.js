import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withJob } from 'react-jobs';
import ReactMarkdown from 'react-markdown';

import Segment from 'components/segment';
import Heading from 'components/heading';
import Store from 'store';

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
        <Segment>
          <Heading>{title}</Heading>
          <ReactMarkdown skipHtml source={text} />
        </Segment>
      </div>
    );
  }
}

const contentful = new Store().contentful;
export default withJob({
  work: () => contentful.fetchSingleByContentType('about'),
})(About);
