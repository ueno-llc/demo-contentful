import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Segment from 'components/segment';
import Helmet from 'react-helmet';
import { withJob } from 'react-jobs';
import Store from 'store';

import Blog from 'components/blog';
import Blogs from './components/blogs';

class BlogList extends Component {

  static propTypes = {
    jobResult: PropTypes.arrayOf(PropTypes.object),
  }

  render() {
    const { jobResult: blogs } = this.props;

    return (
      <div>
        <Helmet title="Blog" />
        <Segment>
          <Blogs>
            {blogs.map(blog =>
              <Blog
                key={blog.id}
                id={blog.id}
                title={blog.title}
                intro={blog.intro}
                author={blog.author}
                date={blog.date}
              />,
            )}
          </Blogs>
        </Segment>
      </div>
    );
  }
}

const contentful = new Store().contentful;
export default withJob({
  work: () => contentful.fetchByContentType('blog'),
})(BlogList);
