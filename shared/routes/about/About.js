import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withJob } from 'react-jobs';
import { inject } from 'mobx-react';

import Hero from 'components/hero';
import List, { Item } from 'components/list';

class About extends Component {

  static propTypes = {
    jobResult: PropTypes.object,
  }

  render() {
    const { title, people } = this.props.jobResult;

    return (
      <div>
        <Helmet title={title} />

        <Hero>
          <h1>Such Ueno.</h1>
          <h2>Very digital. Much agency.</h2>
          <p>Ueno is a full-service, first-rate, all-singing, all-dancing, fast-growing,
          flame-haired, bull-chested, fun-loving, not-quite-bourgeois,
          not-quite-bohemian agency, busy designing and building beautiful
          digital products, brands, and experiences.</p>
        </Hero>

        <List>
          {people.map(({ id, name, title: PeopleBio, image }) => (
            <Item
              key={id}
              title={name}
              intro={PeopleBio}
              image={image}
            />
          ))}
        </List>
      </div>
    );
  }
}

const aboutWithJob = withJob({
  work: ({ contentful }) => contentful.fetchSingleByContentType('about'),
  LoadingComponent: () => (
    <div>
      <Hero isLoading />
      <List isLoading />
    </div>
  ),
})(About);

export default inject('contentful')(aboutWithJob);
