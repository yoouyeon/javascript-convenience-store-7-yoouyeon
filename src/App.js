import ConvenienceStore from './service/ConvenienceStore.js';

class App {
  #convenienceStore;

  constructor() {
    this.#convenienceStore = new ConvenienceStore();
  }

  async run() {
    await this.#convenienceStore.init();
    this.#convenienceStore.run();
  }
}

export default App;
