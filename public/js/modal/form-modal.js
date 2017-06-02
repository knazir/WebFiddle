class FormModal extends Modal {
  constructor(containerElement) {
    super(containerElement);

    this._formSubmitCallback = null;
    this._form = containerElement.querySelector("form");
    this._form.addEventListener("submit", this._submitForm.bind(this));
    this._form.querySelectorAll("input").forEach(input => input.addEventListener("keyup", () => this.setError("")));
  }

  show() {
    this._form.focus();
    super.show();
  }

  hide() {
    this._form.blur();
    super.hide();
  }

  _setFormSubmitCallback(formSubmitCallback) {
    this._formSubmitCallback = formSubmitCallback;
  }

  _submitForm(event) {
    event.preventDefault();
    if (this._formSubmitCallback) this._formSubmitCallback(event);
    this._form.reset();
  }
}