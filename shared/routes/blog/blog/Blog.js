import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import Helmet from 'react-helmet';
import { inject } from 'mobx-react';
import { withJob } from 'react-jobs';
import isEmpty from 'lodash/isEmpty';

import NotFound from 'routes/not-found';

import Content, { Heading, Intro, Cover, Copy, Author } from 'components/content';

class Blog extends Component {

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

        <Content>
          <Author
            name={blog.author.name}
            bio={blog.author.title}
            image={`${blog.author.image.file.url}?w=80&h=80&fit=fill&f=face`}
          />

          <Heading>{blog.title}</Heading>
          <Intro>{blog.intro}</Intro>
          <Cover>{blog.image}</Cover>
          <Copy>{blog.text}</Copy>
        </Content>
      </div>
    );
  }
}

const blogWithJob = withJob({
  work: ({ contentful, match }) => contentful.fetchSingleByContentType('blog', { 'sys.id': match.params.id }),
  LoadingComponent: () => (
    <Content>
      <Author isLoading />
      <Heading isLoading />
      <Intro isLoading />
      <Cover isLoading />
      <Copy isLoading />
    </Content>
  ),
})(Blog);

export default inject('contentful')(blogWithJob);
