import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withJob } from 'react-jobs';
import Helmet from 'react-helmet';
import Segment from 'components/segment';

import Store from 'store';

import ProductList from './components/product-list';
import Product from './components/product';

class Home extends Component {

  static propTypes = {
    jobResult: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      image: PropTypes.object,
    })),
  }

  render() {
    const { jobResult: products } = this.props;

    return (
      <div>
        <Helmet title="Products" />

        <Segment>
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
  work: () => contentful.fetchByContentType('product', { order: 'fields.order' }),
})(Home);
