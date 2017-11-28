import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import Helmet from 'react-helmet';
import { inject } from 'mobx-react';
import { withJob } from 'react-jobs';
import isEmpty from 'lodash/isEmpty';

import NotFound from 'routes/not-found';

import Content, { Heading, Intro, Cover, Copy, Curator } from 'components/content';

class Product extends Component {

  static propTypes = {
    jobResult: PropTypes.object,
  };

  render() {
    const { jobResult: article } = this.props;

    if (isEmpty(article)) {
      return <Route component={NotFound} />;
    }

    return (
      <div>
        <Helmet title={article.title} />

        <Content>
          <Heading>{article.title}</Heading>
          <Intro>{article.introduction}</Intro>
          <Cover>{article.coverImage}</Cover>
          <Copy>{article.description}</Copy>

          {article.curator.name && (
            <Curator
              name={article.curator.name}
              bio={article.curator.title}
              image={`${article.curator.image.file.url}?w=80&h=80&fit=fill&f=face`}
            />
          )}
        </Content>
      </div>
    );
  }
}

const productWithJob = withJob({
  work: ({ contentful, match }) => contentful.fetchSingleByContentType('product', { 'sys.id': match.params.id }),
  LoadingComponent: () => (
    <Content>
      <Heading isLoading />
      <Intro isLoading />
      <Cover isLoading />
      <Copy isLoading />
    </Content>
  ),
})(Product);

export default inject('contentful')(productWithJob);
