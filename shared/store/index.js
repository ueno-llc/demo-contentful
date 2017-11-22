import Network from './Network';
import Contentful from './Contentful';

export default class Store {
  constructor(state = {}) {
    this.network = new Network(state);
    this.contentful = new Contentful(state, this.network);
  }
}
