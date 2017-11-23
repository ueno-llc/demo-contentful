import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import Intro from 'components/intro';
import Segment from 'components/segment';

import Success from './components/success';
import ContactForm from './components/form';

@observer
export default class Contact extends PureComponent {

  @observable
  success = false;

  onSend = (form) => {
    fetch('https://formkeep.com/f/37771b24266b', {
      method: 'POST',
      body: form,
    }).then((res) => {
      if (res.status === 200) { // success
        this.success = true;
      }
    });
  }

  render() {
    return (
      <div>
        <Helmet title="Contact us" />

        <Intro>
          <h1>Contact us</h1>
          <h2>We are kind</h2>
          <p>Go ahead. We’re all ears.</p>
        </Intro>

        <Segment>
          {this.success ? (
            <Success
              title="Success!"
              text="Your message has been successfully sent."
            />
          ) : (
            <ContactForm onSend={this.onSend} />
          )}
        </Segment>
      </div>
    );
  }
}
