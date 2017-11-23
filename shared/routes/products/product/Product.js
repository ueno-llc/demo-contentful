import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import Helmet from 'react-helmet';
import { inject } from 'mobx-react';
import { withJob } from 'react-jobs';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

import NotFound from 'routes/not-found';

import Copy from 'components/copy';

import Article from './components/article';
import Heading from './components/heading';
import Intro from './components/intro';
import Cover from './components/cover';
import Curator from './components/curator';

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

        <Article>
          <Heading>{article.title}</Heading>
          <Intro>{article.introduction}</Intro>
          <Cover>{article.coverImage}</Cover>
          <Copy>{article.description}</Copy>

          {article.curatorName && (
            <Curator
              name={article.curatorName}
              bio={article.curatorBio}
              image={get(article.curatorImage, 'file.url')}
            />
          )}
        </Article>
      </div>
    );
  }
}

const productWithJob = withJob({
  work: ({ contentful, match }) => contentful.fetchSingleByContentType('product', { 'sys.id': match.params.id }),
  LoadingComponent: () => (
    <Article>
      <Heading loading />
      <Intro loading />
    </Article>
  ),
})(Product);

export default inject('contentful')(productWithJob);
