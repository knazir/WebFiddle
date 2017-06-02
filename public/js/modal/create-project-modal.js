class CreateProjectModal extends FormModal {
  constructor(containerElement, createProjectCallback) {
    super(containerElement);
    this._createProjectCallback = createProjectCallback;
    this._setFormSubmitCallback(this._createProject.bind(this));
  }

  _createProject(event) {
    const name = event.target[0].value;
    const useStarterCode = event.target[1].checked;
    this._createProjectCallback(name, useStarterCode);
  }
}