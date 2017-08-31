import { observable, ObservableMap } from 'mobx';
import { autobind } from 'core-decorators';
import axios from 'axios';

/**
 * This store handles network requests.
 */
export default class Network {
  constructor({ network = {} }) {
    // Set history from state
    this.history.replace(network.history);
  }

  /**
   * Keep a history map of network requests for
   * throttling them.
   * @var {Map} The key is url.
   */
  @observable history = new ObservableMap();

  /**
   * Extended fetch method with credentials needed
   * to make http requests to the API.
   * @param {string} Url
   * @param {object} Options
   * @return {Promise}
   */
  @autobind
  fetch(url, { maxAge = Infinity, force = false, cache = false, accessToken, stream = false } = {}) {
    const { history } = this;

    if (!history.has(url)) {
      history.set(url, {});
    }

    // Get reference point to history item
    const item = history.get(url);

    // Return already running promise if available.
    // Unless force flag is in options.
    if (!force && item.promise && item.promise.then) {
      return item.promise;
    }

    // Return cache if still valid
    if (item.data) {
      const now = new Date().getTime();
      if ((now / 1000) - (item.ts / 1000) <= maxAge) {
        return Promise.resolve(item.data);
      }
    }

    const config = { headers: {} };

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (stream) {
      config.responseType = 'stream';
    }

    const promise = axios
      .get(url, config)
      .then((res) => {
        if (cache) {
          // Set timestamp and data to history cache
          item.ts = new Date().getTime();
          item.data = res.data;
        }

        delete item.promise;

        if (stream) {
          return res;
        }

        return res.data;
      })
      .catch((err) => {
        // Delete promise so we know we're not running anyting for this url anymore.
        console.error('Error', err);
        delete item.promise;
        throw err;
      });

    // Attach promise to history item for further use
    item.promise = promise;

    return promise;
  }
}
