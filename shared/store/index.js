import Network from './Network';
import Planets from './Planets';
import Contentful from './Contentful';

export default class Store {
  constructor(state = {}) {
    this.network = new Network(state);
    this.planets = new Planets(state, this.network);
    this.contentful = new Contentful(state, this.network);
  }
}
