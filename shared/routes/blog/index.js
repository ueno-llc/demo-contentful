import React, { PropTypes } from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from 'routes/not-found';

import BlogList from './BlogList';
import BlogEntry from './BlogEntry';

const PlanetsRoutes = ({ match }) => (
  <div>
    <Switch>
      <Route exact path={`${match.url}/:id`} component={BlogEntry} />
      <Route exact path={`${match.url}`} component={BlogList} />
      <Route component={NotFound} />
    </Switch>
  </div>
);

PlanetsRoutes.propTypes = {
  match: PropTypes.object,
};

export default PlanetsRoutes;
