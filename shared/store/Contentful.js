import { extendObservable } from 'mobx';
import timing from 'utils/timing';
import { parse } from 'utils/contentful';
import config from '../../config';

const localApiUrl = config('localApiUrl');
const clientLocalApiUrl = config('clientLocalApiUrl');

// different api url dependant on if we're fetching on server or client
// makes "yarn run dev-remote" work with ngrok
const apiUrl = typeof window === 'undefined' ? localApiUrl : clientLocalApiUrl;

export default class Contentful {

  constructor({ contentful = {} }, network) {
    this.fetch = network.fetch;
    extendObservable(this, contentful);
  }

  query(data = {}) {
    const query = Object.entries(data)
      .map(q => q.map(encodeURIComponent).join('=')).join('&');

    return query;
  }

  @timing.promise
  fetchByContentType(contentType, query = {}) {
    const q = this.query(query);

    const url = `${apiUrl}/contentful/${contentType}?${q}`;

    return this.fetch(url, { force: true })
      .then(data => parse(data))
      .catch((err) => {
        console.warn('Error fetching contentful data', err);
        return {};
      });
  }

  @timing.promise
  fetchSingleByContentType(contentType, query = {}) {
    return this.fetchByContentType(contentType, query)
      .then((parsed) => {
        if (Array.isArray(parsed)) {
          if (parsed.length > 0) {
            return parsed[0];
          }
          return {};
        }

        return parsed;
      })
      .catch((err) => {
        console.warn('Error fetching contentful data', err);
        return {};
      });
  }

  @timing.promise
  search(q) {
    const url = `${apiUrl}/contentful/search/${q}`;

    return this.fetch(url)
      .then(data => data.results)
      .then(results => results.map(m => ({ // map it to search results
        // id: m.id,
        // title: getField(m.data.title, 'title'),
        // description: m.type === 'article'
        //   ? getField(m.data.short_description, 'text')
        //   : getField(m.data.description_seo, 'text'),
        // to: linkResolver(m),
        // type: m.type,
        // isPage: m.tags.some(s => s === 'page') || m.type === 'custom_page',
      })))
      .then(results => ({ // split into categories
        // ...groupBy(results, m => m.isPage ? 'pages' : m.type),
        count: results.length,
      }))
      .catch((err) => {
        console.warn('Error fetching contentful data', err);
        return { count: 0 };
      });
  }
}
