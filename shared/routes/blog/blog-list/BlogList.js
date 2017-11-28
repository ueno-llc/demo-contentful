import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { inject } from 'mobx-react';
import { withJob } from 'react-jobs';

import Hero from 'components/hero';
import List, { Item } from 'components/list';

class BlogList extends Component {

  static propTypes = {
    jobResult: PropTypes.arrayOf(PropTypes.object),
  }

  render() {
    const { jobResult: blogs } = this.props;

    return (
      <div>
        <Helmet title="Blog" />

        <Hero>
          <h1>Words of wisdom</h1>
          <h2>More than you ever wanted to know</h2>
          <p>Here’s the thing. As Ueno has gone from one bearded guy in his living
          room to more than 50 people of 20 nationalities in four offices with
          real tables and chairs, we’ve started thinking about how we can keep
          being ourselves, even as we grow and change.</p>
        </Hero>

        <List>
          {blogs.map(({ id, title, intro, thumbnail }) => (
            <Item
              key={id}
              title={title}
              intro={intro}
              image={thumbnail}
              url={`/blog/${id}`}
            />
          ))}
        </List>
      </div>
    );
  }
}

const blogListWithJob = withJob({
  work: ({ contentful }) => contentful.fetchByContentType('blog'),
  LoadingComponent: () => (
    <div>
      <Hero isLoading />
      <List isLoading />
    </div>
  ),
})(BlogList);

export default inject('contentful')(blogListWithJob);
