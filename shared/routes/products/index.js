import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withJob } from 'react-jobs';
import Helmet from 'react-helmet';
import ReactMarkdown from 'react-markdown';

import Segment from 'components/segment';
import Heading from 'components/heading';

import Store from 'store';

import ProductList from './components/product-list';
import Product from './components/product';

class Products extends Component {

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

    return (
      <div>
        <Helmet title={title} />

        <Segment>
          <Heading>{title}</Heading>
          {intro && (
            <ReactMarkdown skipHtml source={intro} />
          )}
          <ProductList>
            {products.map(product =>
              <Product
                key={product.id}
                title={product.title}
                description={product.description}
                image={product.image}
              />,
            )}
          </ProductList>
        </Segment>
      </div>
    );
  }
}

const contentful = new Store().contentful;
export default withJob({
  work: () => contentful.fetchSingleByContentType('pageProducts'),
})(Products);
