import express from 'express';
import Network from 'store/Network';

import config from '../../config';

const space = config('contentfulSpace');
const accessToken = config('contentfulAccessToken');
const endpoint = config('contentfulEndpoint');

const apiUrl = `https://${endpoint}/spaces/${space}/entries`;

const app = express();

app.get('/:contentType',
  async (req, res) => {
    const type = req.params.contentType;

    const query = Object.entries(req.query)
      .map(q => q.map(encodeURIComponent).join('=')).join('&');

    try {
      res.set('content-type', 'application/json; charset=utf-8');

      const url = `${apiUrl}?content_type=${type}&${query}`;

      new Network({}).fetch(url, { accessToken, stream: true })
        .then((resp) => {
          resp.data.pipe(res);
        })
        .catch((err) => {
          console.error('Error fetching', err);
          res.status(500).end();
        });
    } catch (e) {
      console.error('Error while fetching contentful', e);
      res.status(500).end();
    }
  },
);

app.get('/search/:q',
  async (req, res) => {
    const query = req.params.q;

    try {
      res.set('content-type', 'application/json; charset=utf-8');

      const url = `${apiUrl}?query=${query}`;

      new Network({}).fetch(url, { accessToken, stream: true })
        .then((resp) => {
          resp.data.pipe(res);
        })
        .catch((err) => {
          console.error('Error searching', err);
          res.status(500).end();
        });
    } catch (e) {
      console.error('Error while searching contentful', e);
      res.status(500).end();
    }
  },
);

export default app;
