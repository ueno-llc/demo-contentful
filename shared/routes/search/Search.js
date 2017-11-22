import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withJob } from 'react-jobs';
import { inject } from 'mobx-react';
import { Link } from 'react-router-dom';

import Results, { Group, Item } from './components/results';

class Search extends Component {
  static propTypes = {
    history: PropTypes.object,
    jobResult: PropTypes.object,
    match: PropTypes.object,
  }

  render() {
    const { history, jobResult, match } = this.props;
    const { q } = match.params;
    const { count, ...results } = jobResult;

    return (
      <div>
        <Helmet title="Search" />

        <Results
          query={q}
          count={count}
          onSearch={(value) => history.push(`/search/${value}`)}
        >
          {Object.keys(results).map(key => (
            <Group key={key} title={key}>
              {results[key].map(r => (
                <Item
                  key={r.id}
                  to={r.to}
                  title={r.title}
                  text={r.description}
                />
              ))}
            </Group>
          ))}
        </Results>
      </div>
    );
  }
}

const searchWithJob = withJob({
  work: ({ contentful, match }) => contentful.search(match.params.q),
  shouldWorkAgain: (prevProps, nextProps, jobStatus) => prevProps.match.params.q !== nextProps.match.params.q,
})(Search);

export default inject('contentful')(searchWithJob);
