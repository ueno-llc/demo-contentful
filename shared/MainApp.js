import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Switch, Route, Link } from 'react-router-dom';
import config from 'utils/config';

// Layout
import AppLayout, { Content } from 'components/app-layout';
import Header from 'components/header';
import Navigation from 'components/navigation';
import Footer from 'components/footer';
import DevTools from 'components/devtools';
import Analytics from 'components/analytics';

// Routes
import Home from './routes/home';
import About from './routes/about';
import Products from './routes/products';
import Blog from './routes/blog';
import Contact from './routes/contact';
import Search from './routes/search';
import NotFound from './routes/not-found';

export default class App extends Component {

  get pages() {
    return [
      <Link key="home" to="/">Home</Link>,
      <Link key="products" to="/products">Products</Link>,
      <Link key="about" to="/about">About</Link>,
      <Link key="blog" to="/blog">Blog</Link>,
    ];
  }

  render() {
    return (
      <AppLayout>
        <Helmet {...config('helmet')} />

        <Header>
          <Navigation>
            {this.pages}
          </Navigation>
        </Header>

        <Content>
          <Route component={Analytics} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <Route path="/products" component={Products} />
            <Route path="/blog" component={Blog} />
            <Route path="/contact-us" component={Contact} />
            <Route path="/search/:q" component={Search} />
            <Route component={NotFound} />
          </Switch>

          <DevTools />
        </Content>

        <Footer>
          {this.pages}
        </Footer>
      </AppLayout>
    );
  }
}
