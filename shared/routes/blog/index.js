import React, { PropTypes } from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from 'routes/not-found';

import BlogList from './blog-list';
import Blog from './blog';

const BlogsRoutes = ({ match }) => (
  <div>
    <Switch>
      <Route exact path={`${match.url}/:id`} component={Blog} />
      <Route exact path={`${match.url}`} component={BlogList} />
      <Route component={NotFound} />
    </Switch>
  </div>
);

BlogsRoutes.propTypes = {
  match: PropTypes.object,
};

export default BlogsRoutes;
