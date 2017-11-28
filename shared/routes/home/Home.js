import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withJob } from 'react-jobs';
import { inject } from 'mobx-react';
import Helmet from 'react-helmet';

import Button from 'components/button';
import List, { Item } from 'components/list';
import Hero from 'components/hero';

import Intro from './components/intro';
import Articles from './components/articles';
import Cta from './components/cta';

class Home extends Component {

  static propTypes = {
    jobResult: PropTypes.object,
  }

  render() {
    const { jobResult: home } = this.props;

    const {
      intro,
      productsList,
      blogList,
      heroColor,
      heroTitle,
      heroSubheading,
      heroDescription,
    } = home;

    return (
      <div>
        <Helmet title="Home" />

        <Hero color="white" background={heroColor}>
          <h1>{heroTitle}</h1>
          <h2>{heroSubheading}</h2>
          <p>{heroDescription}</p>
        </Hero>

        <Intro
          heading="Who we are, and who we want to be"
          subheading="A few things you should know about Ueno"
          copy={intro}
        />

        <List
          title="Our products"
          subheading="We love them"
        >
          {productsList.map(({ id, title: productTitle, introduction, image }) => (
            <Item
              key={id}
              title={productTitle}
              intro={introduction}
              image={image}
              url={`/products/${id}`}
            />
          ))}
        </List>

        <Articles
          title="From our lovely people"
          subheading="They love to write"
          articles={blogList}
          show={4}
        />

        <Cta>
          <p>Want to talk more.</p>
          <Button to="/contact-us" large stroke>Contact us</Button>
        </Cta>
      </div>
    );
  }
}

const homeWithJob = withJob({
  work: ({ contentful }) => contentful.fetchSingleByContentType('home'),
  LoadingComponent: () => (
    <div>
      <Hero background="#93cfe3" isLoading />
      <Intro isLoading />
    </div>
  ),
})(Home);

export default inject('contentful')(homeWithJob);
