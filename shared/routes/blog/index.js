import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import NotFound from 'routes/not-found';

import BlogList from './BlogList';
import BlogEntry from './BlogEntry';

const BlogRoutes = ({ match }) => (
  <div>
    <Switch>
      <Route exact path={`${match.url}/:id`} component={BlogEntry} />
      <Route exact path={`${match.url}`} component={BlogList} />
      <Route component={NotFound} />
    </Switch>
  </div>
);

BlogRoutes.propTypes = {
  match: PropTypes.object,
};

export default BlogRoutes;
