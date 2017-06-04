class ErrorModal extends Modal {
  constructor(containerElement) {
    super(containerElement);

    containerElement.querySelector("button").addEventListener("click", () => window.location.reload());
  }

  setError(error) {
    const errorMessage = error.response || error.statusText || error;
    super.setError(errorMessage);
    this.show();
  }
}