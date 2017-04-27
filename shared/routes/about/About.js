import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Segment from 'components/segment';
import Helmet from 'react-helmet';
import { withJob } from 'react-jobs';
import Store from 'store';
import ReactMarkdown from 'react-markdown';

class About extends Component {

  static propTypes = {
    jobResult: PropTypes.object,
  }

  render() {
    const { jobResult: about } = this.props;

    return (
      <div>
        <Helmet title="About" />
        <Segment>
          <ReactMarkdown skipHtml source={about.text} />
        </Segment>
      </div>
    );
  }
}

const contentful = new Store().contentful;
export default withJob({
  work: () => contentful.fetchSingleByContentType('about'),
})(About);
