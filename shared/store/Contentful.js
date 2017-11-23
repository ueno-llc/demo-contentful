import { extendObservable } from 'mobx';
import timing from 'utils/timing';
import { parse, linkResolver } from 'utils/contentful';
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';

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
    return Object
      .entries(data)
      .map(q => q.map(encodeURIComponent).join('=')).join('&');
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
      .then(data => parse(data))
      .then(res => res.map(m => ({
        id: m.id,
        title: m.title,
        intro: m.introduction || m.intro,
        imageUrl: get(m, 'image.file.url'),
        url: linkResolver(m.id, m.contentType),
        type: m.contentType,
      })))
      .then(res => ({
        ...groupBy(res, m => m.type || 'Others'),
        count: res.length,
      }))
      .catch((err) => {
        console.warn('Error fetching contentful data', err);
        return { count: 0 };
      });
  }
}
