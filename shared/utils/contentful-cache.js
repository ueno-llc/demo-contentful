
import redis from './redis';
import { parseIncludes, setItemLocale } from './contentful';
import config from './config';

const cacheEnabledConfig = config('contentfulCache');
const prefix = config('contentfulCachePrefix');
const cacheTime = config('contentfulCacheTime');

const debug = true;

// debug logging helper
function log(first, ...rest) {
  if (debug) {
    console.info.call(console, 'CACHE', first, ...rest);
  }
}

function createCacheKey({ contentType, id, asset }) {
  const cacheKeyId = id ? `-${id}` : '';

  if (asset) {
    return `${prefix}-asset${cacheKeyId}`;
  }

  return `${prefix}-contentType:${contentType}${cacheKeyId}`;
}

/**
 * Create a cache key for a contentful topic and item.
 *
 * @param  {type} topic Topic from contentful, what action is causing the cache
 * @param  {type} sys   Contentful system metadata for item
 * @return {type}       Key to cache the item at or empty if we don't know howto
 */
function createTopicCacheKey(topic, sys) {
  const id = sys.id;
  const contentType = sys.contentType && sys.contentType.sys.id;

  switch (topic) {
    case 'ContentManagement.Entry.publish':
    case 'ContentManagement.Entry.unpublish':
    case 'ContentManagement.Entry.delete':
    case 'ContentManagement.Entry.archive':
      return createCacheKey({ contentType, id });
    case 'ContentManagement.Asset.publish':
    case 'ContentManagement.Asset.unpublish':
    case 'ContentManagement.Asset.delete':
    case 'ContentManagement.Asset.archive':
      return createCacheKey({ asset: true, id });
    case '':
    default:
      return '';
  }
}

function cacheEnabled() {
  return cacheEnabledConfig && redis.connected;
}

function cacheWriteThrough(contentful) {
  const cacheKey = createCacheKey(contentful);
  log('WriteThrough', cacheKey);
  return redis.writeThrough(cacheKey, cacheTime);
}

function updateCacheWithItems(data, cachedItem, cachedEntries) {
  // update the item from cache
  if (cachedItem && data.items && data.items.length > 0) {
    const parsedCachedItem = JSON.parse(cachedItem);
    const item = data.items[0];
    const updatedAt = new Date(item.sys.updatedAt);
    const cachedUpdatedAt = new Date(parsedCachedItem.sys.updatedAt);

    if (cachedUpdatedAt.getTime() >= updatedAt.getTime()) {
      log('Replacing item from cache', item.sys.id);

      const replacementItem = setItemLocale(parsedCachedItem);

      data.items.splice(0, 1, replacementItem);
    }
  }

  // update the entries from cache
  if (data.includes && data.includes.Entry) {
    data.includes.Entry.forEach((entry) => {
      const id = entry.sys.id;
      const updatedAt = new Date(entry.sys.updatedAt);

      const cachedEntry =
        cachedEntries.find(i => i && i.sys && i.sys.id && i.sys.id === id);

      if (cachedEntry) {
        const cachedUpdatedAt = new Date(cachedEntry.sys.updatedAt);
        if (cachedUpdatedAt.getTime() >= updatedAt.getTime()) {
          log('Replacing linked field from cache', id);

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

/**
 * Checks and caches to redis if we should,
 *
 * @param  {string} topic Topic from contentful, what action is causing the cache
 * @param  {object} data  Item from contentful
 * @return {bool}         true if item is cached, false otherwise
 */
async function cache(topic, data) {
  const sys = data.sys;

  const cacheKey = createTopicCacheKey(topic, sys);

  if (!cacheKey) {
    return false;
  }

  await redis.setAsync(cacheKey, JSON.stringify(data), 'EX', cacheTime);

  return true;
}

async function isCached(cacheKey) {
  let hasCache = false;

  try {
    hasCache = await redis.existsAsync(cacheKey);
  } catch (e) {
    console.error('Error reading from cache', e);
  }

  return hasCache;
}

async function fetchFromCache(contentful) {
  const cacheKey = createCacheKey(contentful);

  const keyExists = await isCached(cacheKey);

  if (!keyExists) {
    return null;
  }

  const data = await redis.getAsync(cacheKey);
  const parsed = JSON.parse(data);

  const { entries } = parseIncludes(parsed);

  // for each entry linked in the result, create the cache key
  const entriesIds = entries.map((entry) => {
    const id = entry.sys.id;
    const contentType = entry.sys.contentType.sys.id;

    return createCacheKey({ contentType, id });
  });

  const contentType = parsed.items[0].sys.contentType.sys.id; // lol
  const id = parsed.items[0].sys.id;

  const itemCacheKey = createCacheKey({ contentType, id });

  // lookup the current item (first!) and see if it's cached
  const cachedItem = await redis.getAsync(itemCacheKey);

  // lookup all possible entries cached via webhook
  const cachedEntries = await redis.mgetAsync(entriesIds);

  const cachedEntriesParsed = cachedEntries.map(i => JSON.parse(i));
  const result = updateCacheWithItems(parsed, cachedItem, cachedEntriesParsed);

  return result;
}

export {
  cache,
  fetchFromCache,
  cacheEnabled,
  cacheWriteThrough,
};
