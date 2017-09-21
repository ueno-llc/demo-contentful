import express from 'express';
import Network from 'store/Network';

import {
  cacheEnabled,
  fetchFromCache,
  cache,
  cacheWriteThrough,
} from 'utils/contentful-cache';
import config from '../../config';

const space = config('contentfulSpace');
const accessToken = config('contenfulAccessToken');
const endpoint = config('contentfulEndpoint');
const apiUrl = `https://${endpoint}/spaces/${space}/entries`;

const network = new Network({});
const app = express();

function fetchContentful(type, id) {
  const urlId = id ? `&sys.id=${id}` : '';

  console.info('Fetching from Contentful', type, id);
  return network.fetch(`${apiUrl}?content_type=${type}${urlId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    stream: true,
    maxAge: 0,
  });
}

// parse contentful metadata from route and request
function prepare(req, res, next) {
  res.set('Content-Type', 'application/json; charset=utf-8');

  req.contentful = {
    contentType: req.params.contentType,
    id: req.query && req.query.id,
  };

  next();
}

async function fromCache(req, res, next) {
  // try and read from the cache but if anything goes wrong, get fresh data
  try {
    const cachedData = await fetchFromCache(req.contentful);

    if (cachedData) {
      console.info('Serving from cache', req.contentful);
      return res.send(cachedData);
    }
  } catch (e) {
    console.error('Error reading from cache', e);
  }

  return next();
}

async function fromContentfulAndCache(req, res) {
  const contentful = req.contentful;

  let resp = null;
  try {
    resp = await fetchContentful(contentful.contentType, contentful.id);
  } catch (e) {
    console.error('Error fetching from contentful', e);
    return res.status(500).send('500 Internal Error');
  }

  if (cacheEnabled()) {
    try {
      // if something fails here we'll still be able to serve the data w/o cache
      resp.data.pipe(cacheWriteThrough(contentful));
    } catch (e) {
      console.info('Error writing to cache', e);
    }
  }

  resp.data.pipe(res);
}

// recieves topics from contentful and caches topics we know how to cache
async function webhookHandler(req, res) {
  const topic = req.headers['x-contentful-topic'];

  if (!cacheEnabled()) {
    return res.status(501).send('501 Not Implemented');
  }

  try {
    if (await cache(topic, req.body)) {
      console.info('Cached request from Contentful', topic);
      return res.status(201).send('201 Created');
    }
  } catch (e) {
    console.error('Error caching to redis', e);
    return res.status(500).send('500 Internal Error');
  }

  return res.status(200).send('200 OK');
}

/* routes */

app.get('/contentType/:contentType/',
  prepare,
  fromCache,
  fromContentfulAndCache,
);

app.post('/webhook',
  webhookHandler,
);

export default app;
