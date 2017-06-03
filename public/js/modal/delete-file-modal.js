class DeleteFileModal extends Modal {
  constructor(containerElement, deleteProjectCallback) {
    super(containerElement);

    this._deleteFileCallback = deleteProjectCallback;
    this._hiddenFilenameInput = containerElement.querySelector("input[type=text]");

    containerElement.querySelector(".do-not-delete").addEventListener("click", this._cancelDeleteFile.bind(this));
    containerElement.querySelector(".confirm-delete").addEventListener("click", this._deleteFile.bind(this));
  }

  _cancelDeleteFile(event) {
    event.preventDefault();
    this.hide();
  }

  _deleteFile(event) {
    event.preventDefault();
    this._deleteFileCallback(this._hiddenFilenameInput.value);
  }

  show(filename) {
    this._hiddenFilenameInput.value = filename;
    this.setError(`Are you sure you want to delete ${filename}`);
    super.show();
  }
}