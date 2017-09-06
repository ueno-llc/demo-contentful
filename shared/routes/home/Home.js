import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withJob } from 'react-jobs';
import Helmet from 'react-helmet';
import config from 'utils/config';

import Segment from 'components/segment';
import Button from 'components/button';
import Store from 'store';

import Hero from './components/hero';
import IntroText from './components/intro-text';

class Home extends Component {

  static propTypes = {
    jobResult: PropTypes.object,
  }

  render() {
    const { jobResult: home } = this.props;
    const { hero, intro } = home;

    return (
      <div>
        <Helmet title="Home" />
        <Hero image={hero} />

        <Segment>
          <IntroText>
            <p>{intro}</p>
            <Button to="/products">See our products</Button>
          </IntroText>
        </Segment>
      </div>
    );
  }
}

// so hot reloading works 😫
const contentful = new Store().contentful;
export default withJob({
  work: () => contentful.fetchSingleByContentType('home'),
})(Home);
