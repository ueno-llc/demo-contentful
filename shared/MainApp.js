import React from 'react';
import Helmet from 'react-helmet';
import { Switch, Route, Link } from 'react-router-dom';
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
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/about">About</Link>
          <Link to="/blog">Blog</Link>
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
