
import redis from './redis';
import { parseIncludes, setItemLocale, setFieldLocale } from './contentful';
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

function createCacheKey({ contentType, id, asset, entry }) {
  const cacheKeyId = id ? `-${id}` : '';

  if (asset) {
    return `${prefix}-asset${cacheKeyId}`;
  }

  if (entry) {
    return `${prefix}-entry${cacheKeyId}`;
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

  switch (topic) {
    case 'ContentManagement.Entry.publish':
    case 'ContentManagement.Entry.unpublish':
    case 'ContentManagement.Entry.delete':
    case 'ContentManagement.Entry.archive':
      return createCacheKey({ entry: true, id });
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

function updateWithCache(data, cached, type = '') {
  const seen = [];

  if (data.includes && data.includes[type]) {
    data.includes[type].forEach((item) => {
      const id = item.sys.id;
      const updatedAt = new Date(item.sys.updatedAt);

      const cachedItem =
        cached.find(i => i && i.sys && i.sys.id && i.sys.id === id);

      if (cachedItem) {
        seen.push(cachedItem);

        const cachedUpdatedAt = new Date(cachedItem.sys.updatedAt);

        if (cachedUpdatedAt.getTime() >= updatedAt.getTime()) {
          log('Replacing item from cache', type, id);

          delete item.fields;
          item.fields = cachedItem.fields;
          delete item.sys;
          item.sys = cachedItem.sys;
        }
      }
    });
  }

  const missing = cached.filter(el => !seen.includes(el));

  if (missing.length > 0) {
    data.includes[type] = data.includes[type].concat(missing);
    log('Appending missing', type);
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

/**
 * Updates an array result from contentful with cached entries and fixes
 * includes with other cached things
 *
 * @param  {object} data Data from Contentful
 * @return {Promise} data untouched if it's not an array, otherwise array with
 *                   updates from cache
 */
async function updateItemFromCache(data) {
  if (data.sys.type !== 'Array') {
    return data;
  }

  // keys for all items in the array
  const keys = data.items.map((item) => {
    const id = item.sys.id;

    return createCacheKey({ entry: true, id });
  });

  // array of all possible cached items, null if no cached entry at each index
  const cachedItems = await redis.mgetAsync(keys);
  const cachedItemsParsed = cachedItems.map(i => JSON.parse(i));

  // update items if they're fresher
  data.items.forEach((item) => {
    const id = item.sys.id;
    const updatedAt = new Date(item.sys.updatedAt);

    const cachedItem =
      cachedItemsParsed.find(i => i && i.sys && i.sys.id && i.sys.id === id);

    if (cachedItem) {
      const cachedUpdatedAt = new Date(cachedItem.sys.updatedAt);
      if (cachedUpdatedAt.getTime() >= updatedAt.getTime()) {
        log('Replacing item from cache', id);

        const replacementItem = setItemLocale(cachedItem);

        delete item.fields;
        item.fields = replacementItem.fields;
        delete item.sys;
        item.sys = replacementItem.sys;
      }
    }
  });

  return data;
}

function getLinksFromField(field, linkType = 'Entry') {
  const links = [];

  if (typeof field === 'object' &&
      field.sys &&
      field.sys.type === 'Link' &&
      field.sys.linkType === linkType) {
    links.push(field.sys.id);
  }

  if (Array.isArray(field)) {
    field.forEach((i) => {
      const link = getLinksFromField(i, linkType);
      links.push(...link);
    });
  }

  return links;
}

function getLinkedItems(data = [], linkType = 'Entry') {
  const links = [];

  data.forEach((item) => {
    if (!item || !item.fields) {
      return;
    }

    Object.keys(item.fields).forEach((key) => {
      const field = setFieldLocale(item.fields[key]);
      const fieldLinks = getLinksFromField(field, linkType);
      links.push(...fieldLinks);
    });
  });

  // make the array unique
  return [...new Set(links)];
}

async function linkAndCache(data, included, type = '') {
  const includedIds = included.map(item => item.sys.id);

  let linked = getLinkedItems(data.items, type);

  if (type === 'Asset' && data.includes && data.includes.Entry) {
    const linkedFromEntries = getLinkedItems(data.includes.Entry, type);
    linked = linked.concat(linkedFromEntries);
  }

  const all = includedIds.concat(linked);
  const allUnique = [...new Set(all)];

  const cacheKeys = allUnique.map(id =>
    createCacheKey({ [type.toLowerCase()]: true, id }));

  const cached = await redis.mgetAsync(cacheKeys);

  const cachedParsed = cached
    .filter(Boolean)
    .map(i => JSON.parse(i));

  const result = updateWithCache(data, cachedParsed, type);

  return result;
}

async function fetchFromCache(contentful) {
  const cacheKey = createCacheKey(contentful);

  const keyExists = await isCached(cacheKey);

  if (!keyExists) {
    return null;
  }

  const data = await redis.getAsync(cacheKey);
  const parsed = JSON.parse(data);

  const parsedWithCache = await updateItemFromCache(parsed);

  const { entries, assets } = parseIncludes(parsedWithCache);

  const processedEntries = await linkAndCache(parsedWithCache, entries, 'Entry');
  const processedAssets = await linkAndCache(processedEntries, assets, 'Asset');

  return processedAssets;
}

export {
  cache,
  fetchFromCache,
  cacheEnabled,
  cacheWriteThrough,
};
