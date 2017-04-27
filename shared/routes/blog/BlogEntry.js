import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import Segment from 'components/segment';
import Helmet from 'react-helmet';
import { withJob } from 'react-jobs';
import Store from 'store';
import isEmpty from 'lodash/isEmpty';

import NotFound from 'routes/not-found';
import Blog from 'components/blog';

class BlogEntry extends Component {

  static propTypes = {
    jobResult: PropTypes.object,
  }

  render() {
    const { jobResult: blog } = this.props;

    if (isEmpty(blog)) {
      return <Route component={NotFound} />;
    }

    return (
      <div>
        <Helmet title={blog.title} />
        <Segment>
          <Blog
            single
            key={blog.id}
            id={blog.id}
            title={blog.title}
            intro={blog.intro}
            text={blog.text}
            author={blog.author}
            date={blog.date}
          />

          <p><Link to="/blog">Back to blog</Link></p>
        </Segment>
      </div>
    );
  }
}

const contentful = new Store().contentful;
export default withJob({
  work: ({ match }) => contentful.fetchSingleByContentType('blog', { 'sys.id': match.params.id }),
})(BlogEntry);
