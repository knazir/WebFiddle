class DeleteFileModal extends FormModal {
  constructor(containerElement, deleteProjectCallback) {
    super(containerElement);
    this._deleteProjectCallback = deleteProjectCallback;
    this._setFormSubmitCallback(this._deleteProject.bind(this));
  }

  _deleteProject(event) {
    const filename = event.target[0].value;
    this._deleteProjectCallback(filename);
  }
}