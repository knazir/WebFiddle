class Component {
  constructor(containerElement) {
    this.containerElement = containerElement;
  }

  show() {
    this.containerElement.classList.remove("hidden");
  }

  hide() {
    this.containerElement.classList.add("hidden");
  }
}