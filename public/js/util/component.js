class Component {
  constructor(containerElement) {
    this._containerElement = containerElement;
  }

  getContainerElement() {
    return this._containerElement;
  }

  show() {
    this._containerElement.classList.remove("hidden");
  }

  hide() {
    this._containerElement.classList.add("hidden");
  }
}