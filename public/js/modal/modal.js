class Modal extends Component {
  constructor(containerElement) {
    super(containerElement);

    this._closeButton = containerElement.querySelector(".positioned-close-button");
    this._closeButton.addEventListener("click", this.hide.bind(this));
    this._errorMessage = new Component(containerElement.querySelector(".modal-error"));
  }

  setError(error) {
    if (!error) {
      this._errorMessage.hide();
    } else {
      this._errorMessage.show();
      this._errorMessage.getContainerElement().textContent = error;
    }
  }

  closeOnEscape(event) {
    if (event.key === "Escape") this.hide();
  }

  show() {
    document.querySelector("body").addEventListener("keyup", this.closeOnEscape.bind(this));
    super.show();
  }

  hide() {
    document.querySelector("body").removeEventListener("keyup", this.closeOnEscape.bind(this));
    super.hide();
  }
}