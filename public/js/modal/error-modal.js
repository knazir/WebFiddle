class ErrorModal extends Modal {
  constructor(containerElement) {
    super(containerElement);

    containerElement.querySelector("button").addEventListener("click", () => window.location.reload());
  }

  setError(error) {
    super.setError(error.response ? error.response : error.statusText);
    this.show();
  }
}