import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withJob } from 'react-jobs';
import Helmet from 'react-helmet';
import { inject } from 'mobx-react';

import Segment from 'components/segment';
import Intro from 'components/intro';

import List, { Item } from './components/list';

class Home extends Component {

  static propTypes = {
    jobResult: PropTypes.shape({
      title: PropTypes.string,
      products: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        image: PropTypes.object,
      })),
    }),
  }

  render() {
    const { jobResult: productsPage } = this.props;
    const { title, intro, products } = productsPage;
    console.log('-products', products);

    return (
      <div>
        <Helmet title={title} />

        <Intro>
          <h1>Our products</h1>
          <h2>More than you ever wanted to see</h2>
          <p>Here’s the thing. As Ueno has gone from one bearded guy in his living room to more than 50 people of 20 nationalities in four offices with real tables and chairs, we’ve started thinking about how we can keep being ourselves, even as we grow and change.</p>
        </Intro>

        <List>
          {products.map(({ id, title, introduction, image }) => (
            <Item
              key={id}
              title={title}
              intro={introduction}
              image={image}
              url={`/products/${id}`}
            />
          ))}
        </List>
      </div>
    );
  }
}

const homeWithJob = withJob({
  work: ({ contentful }) => contentful.fetchSingleByContentType('pageProducts'),
  LoadingComponent: () => (
    <Intro isLoading />
  ),
})(Home);

export default inject('contentful')(homeWithJob);
