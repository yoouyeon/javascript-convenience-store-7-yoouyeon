import ConvenienceStore from './service/ConvenienceStore.js';

class App {
  #convenienceStore;

  constructor() {
    this.#convenienceStore = new ConvenienceStore();
  }

  async run() {
    await this.#convenienceStore.init();
    await this.#convenienceStore.run();
  }
}

export default App;
