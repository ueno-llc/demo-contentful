import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withJob } from 'react-jobs';
import { inject } from 'mobx-react';
import Helmet from 'react-helmet';
import config from 'utils/config';

import Segment from 'components/segment';
import Button from 'components/button';

import Hero from './components/hero';
import IntroText from './components/intro-text';
import Articles from './components/articles';
import Cta from './components/cta';

class Home extends Component {

  static propTypes = {
    jobResult: PropTypes.object,
  }

  render() {
    const { jobResult: home } = this.props;
    const { intro, productsList, ...rest } = home;

    console.log('-home', home);

    return (
      <div>
        <Helmet title="Home" />

        <Hero {...rest} />

        <Segment>
          <IntroText>{intro}</IntroText>
        </Segment>

        <Articles
          title="Our products"
          subheading="We love them"
          articles={productsList}
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
      <Hero isLoading />
      <Segment />
      <Segment />
    </div>
  ),
})(Home);

export default inject('contentful')(homeWithJob);
