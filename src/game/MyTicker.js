class MyTicker {
  constructor() {
    this.handlers = [];
  }

  add(cbHandler) {
    this.handlers.push(cbHandler);
  }

  fire() {
    let fn;
    for (fn of this.handlers) {
      fn();
    }
  }
}

export default MyTicker;
