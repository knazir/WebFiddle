class CreateFileModal extends FormModal {
  constructor(containerElement, createFileCallback) {
    super(containerElement);
    this._createFileCallback = createFileCallback;
    this._setFormSubmitCallback(this._createFile.bind(this));

    this._fixedFileExtensionElement = containerElement.querySelector("#fixed-file-extension");
    this._fileTypeButtons = containerElement.querySelectorAll("input[type=\"radio\"]");
    this._fileTypeButtons.forEach((button) => {
      button.addEventListener("click", this._updateFixedFileExtension.bind(this));
    });
  }

  _createFile(event) {
    const filename = event.target[0].value;
    const type = this._containerElement.querySelector("input[name=\"type\"]:checked").value;
    this._createFileCallback(filename, type);
  }

  _updateFixedFileExtension(event) {
    const type = event.target.value;
    this._fixedFileExtensionElement.textContent = `.${type}`;
  }
}