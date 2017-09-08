import express from 'express';
import Network from 'store/Network';

import redis from 'utils/redis';
import { parseIncludes } from 'utils/contentful';
import config from '../../config';

const space = config('contentfulSpace');
const accessToken = config('contenfulAccessToken');
const prefix = 'contentful';
const apiUrl = `https://cdn.contentful.com/spaces/${space}/entries`;
const serveCache = true;
const cacheTime = 60 * 60 * 24;

const network = new Network({});

const app = express();

/**
 * Proof-of-concept caching with webhook from contentful.
 * Very very very much a first version that is very brittle
 * Needs testing and cleanup, should use async/await
 */

function fetchContentful(type, id) {
  const urlId = id ? `/${id}` : '';

  return network.fetch(`${apiUrl}${urlId}?content_type=${type}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    stream: true,
    maxAge: 0,
  });
}

function fixStupidLocaleShit(item) {

  // apparently locale isn't always included in the object 🙃
  const locale = 'en-US';

  Object.keys(item.fields).forEach((key) => {
    const field = item.fields[key];
    if (typeof field === 'object' && (locale in field)) {
      const value = field[locale];

      item.fields[key] = value;
    }
  });

  return item;
}

function prepare(req, res, next) {
  res.set('Content-Type', 'application/json; charset=utf-8');

  const contentType = req.params.contentType;
  const id = req.query && req.query.id ? `-${req.query.id}` : '';
  const cacheKey = `${prefix}-${contentType}${id}`;

  req.cacheKey = cacheKey;
  req.contentType = contentType;

  next();
}

function updateCacheWithItems(data, cachedItem, cachedEntries) {

  // update the item from cache
  if (cachedItem && data.items && data.items.length > 0) {
    const parsedCachedItem = JSON.parse(cachedItem);
    const item = data.items[0];
    const updatedAt = new Date(item.sys.updatedAt);
    const cachedUpdatedAt = new Date(parsedCachedItem.sys.updatedAt);

    if (cachedUpdatedAt.getTime() >= updatedAt.getTime()) {
      console.info('CACHE', 'Replacing item from cache', item.sys.id);

      const replacementItem = fixStupidLocaleShit(parsedCachedItem);

      data.items.splice(0, 1, replacementItem);
    }
  }

  // update the entries from cache
  if (data.includes && data.includes.Entry) {
    data.includes.Entry.forEach((entry) => {
      const id = entry.sys.id;
      const updatedAt = new Date(entry.sys.updatedAt);

      // wtf?
      const cachedEntry = cachedEntries.find(i => i && i.sys && i.sys.id && i.sys.id === id);

      if (cachedEntry) {
        const cachedUpdatedAt = new Date(cachedEntry.sys.updatedAt);
        if (cachedUpdatedAt.getTime() >= updatedAt.getTime()) {
          console.info('CACHE', 'Replacing linked field from cache', id);

          delete entry.fields;
          entry.fields = cachedEntry.fields;
          delete entry.sys;
          entry.sys = cachedEntry.sys;
        }
      }
    });
  }

  return data;
}

function fromCache(req, res, next) {
  const cacheKey = req.cacheKey;

  redis.existsAsync(cacheKey)
    .then((isCached) => {
      if (isCached && serveCache) {
        console.info('CACHED', cacheKey);

        redis.getAsync(cacheKey)
          .then((data) => {
            const parsed = JSON.parse(data);
            const { entries } = parseIncludes(parsed);

            // for each entry linked in the result, create the cache key
            const entriesIds = entries.map((entry) => {
              const id = entry.sys.id;
              const contentType = entry.sys.contentType.sys.id;

              return `${prefix}-${contentType}-${id}`;
            });

            const contentType = parsed.items[0].sys.contentType.sys.id; // lol
            const id = parsed.items[0].sys.id;

            const itemCacheKey = `${prefix}-${contentType}-${id}`;

            // lookup the current item (first!) and see if it's cached
            redis.getAsync(itemCacheKey)
              .then((cachedItem) => {

                // lookup all possible entries cached via webhook
                redis.mgetAsync(entriesIds)
                  .then((cachedEntries) => {
                    const cachedEntriesParsed = cachedEntries.map(i => JSON.parse(i));
                    const result = updateCacheWithItems(parsed, cachedItem, cachedEntriesParsed);

                    return res.send(result);
                  });
              });
          })
          .catch((err) => {
            console.error('Error reading from cache', err);
            res.status(500).send('500 Internal Error');
          });
      } else {
        console.info('NOT CACHED', cacheKey);
        return next();
      }
    });
}

function fromContentfulAndCache(req, res) {
  const cacheKey = req.cacheKey;
  const contentType = req.contentType;

  // here we are (incorrectly) fetching a full page of results by contentType
  // and then assuming it will contain excactly one instance which we'll use
  // we should somehow be teasing out the actual item and having some logic for
  // dealing with multiples. Perhaps the API has ways to do this but I haven't
  // looked into it
  fetchContentful(contentType)
    .then((resp) => {
      res.set('Content-Type', 'application/json; charset=utf-8');
      if (redis.connected) {
        console.info('CACHED', cacheKey);
        resp.data.pipe(redis.writeThrough(cacheKey, cacheTime));
      }

      resp.data.pipe(res);
    })
    .catch((err) => {
      console.error('Error fetching', err);
      res.status(500).send('500 Internal Error');
    });
}

// recieves topics from contentful and caches entries that are being published
// with the key contentType-id which is then looked up when we're serving the
// cache and through a hacky way mangled together, in hope of serving the fresh
// content. Needs polish, alot.
function webhookHandler(req, res) {
  const topic = req.headers['x-contentful-topic'];

  if (!redis.connected) {
    return res.status(501).send('501 Not Implemented');
  }

  if (topic && topic === 'ContentManagement.Entry.publish') {
    const sys = req.body.sys;
    const bodyAsJson = JSON.stringify(req.body);

    const contentType = sys.contentType.sys.id;
    const id = sys.id;

    const cacheKey = `${prefix}-${contentType}-${id}`;

    redis.setAsync(cacheKey, bodyAsJson, 'EX', cacheTime)
      .then(() => {
        console.info('CACHED', cacheKey);
        return res.status(201).send('201 Created');
      })
      .catch((ex) => {
        console.error('Error caching to redis', cacheKey, ex);
        return res.status(500).send('500 Internal Error');
      });
  } else {
    console.info('Not handling event from Contentful', topic);
  }
}

app.post('/webhook',
  webhookHandler
);

app.get('/contentType/:contentType/',
  prepare,
  fromCache,
  fromContentfulAndCache,
);

export default app;
