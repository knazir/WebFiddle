class CreateProjectModal extends Modal {
  constructor(containerElement, createProjectCallback) {
    super(containerElement);

    this._createProjectCalback = createProjectCallback;
    this._createForm = containerElement.querySelector("form");
    this._createForm.addEventListener("submit", this._createProject.bind(this));
    this._projectNameInputField = containerElement.querySelector(".text-input-field");
    this._projectNameInputField.addEventListener("keyup", () => this.setError(""));
  }

  _createProject(event) {
    event.preventDefault();
    const name = event.target[0].value;
    const useStarterCode = event.target[1].checked;
    this._createProjectCalback(name, useStarterCode);
  }
}