import React from 'react';
import Helmet from 'react-helmet';
import { Switch, Route, NavLink } from 'react-router-dom';
import config from 'utils/config';

// Layout
import AppLayout, { Content } from 'components/app-layout';
import Header from 'components/header';
import Navigation from 'components/navigation';
import DevTools from 'components/devtools';
import Analytics from 'components/analytics';

// Routes
import Home from './routes/home';
import Grid from './routes/grid';
import About from './routes/about';
import Products from './routes/products';
import Planets from './routes/planets';
import Blog from './routes/blog';
import NotFound from './routes/not-found';

export default function App() {
  return (
    <AppLayout>
      <Helmet {...config('helmet')} />
      <Header>
        <Navigation>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/blog">Blog</NavLink>
        </Navigation>
      </Header>
      <Content>
        <Route component={Analytics} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/grid" component={Grid} />
          <Route exact path="/about" component={About} />
          <Route exact path="/products" component={Products} />
          <Route path="/blog" component={Blog} />
          <Route path="/planets" component={Planets} />
          <Route component={NotFound} />
        </Switch>
        <DevTools />
      </Content>
    </AppLayout>
  );
}
