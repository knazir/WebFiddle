class FormModal extends Modal {
  constructor(containerElement) {
    super(containerElement);

    this._formSubmitCallback = null;
    this._form = containerElement.querySelector("form");
    this._form.addEventListener("submit", this._submitForm.bind(this));
    this._form.querySelectorAll("input[type=text]").forEach((input) => {
      input.addEventListener("keyup", (event) => {
        if (event.key !== "Enter") this.setError("")
      });
    });
    this._firstInput = this._form.querySelector("input");
  }

  show() {
    setTimeout(() => this._firstInput ? this._firstInput.focus() : this.form.focus(), 300);
    super.show();
  }

  hide() {
    this.setError("");
    setTimeout(() => this._firstInput ? this._firstInput.blur() : this._form.blur(), 300);
    this._form.reset();
    super.hide();
  }

  _setFormSubmitCallback(formSubmitCallback) {
    this._formSubmitCallback = formSubmitCallback;
  }

  _submitForm(event) {
    event.preventDefault();
    if (this._formSubmitCallback) this._formSubmitCallback(event);
  }
}