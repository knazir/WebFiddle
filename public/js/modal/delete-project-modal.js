class DeleteProjectModal extends Modal {
  constructor(containerElement, deleteProjectCallback) {
    super(containerElement);
    this._deleteProjectCallback = deleteProjectCallback;
    this._hiddenProjectNameInput = containerElement.querySelector("input[type=text]");

    containerElement.querySelector(".do-not-delete").addEventListener("click", this._cancelDeleteProject.bind(this));
    containerElement.querySelector(".confirm-delete").addEventListener("click", this._deleteProject.bind(this));
  }

  _cancelDeleteProject(event) {
    event.preventDefault();
    this.hide();
  }

  _deleteProject(event) {
    event.preventDefault();
    this._deleteProjectCallback(this._hiddenProjectNameInput.value);
  }

  show(projectName) {
    this._hiddenProjectNameInput.value = projectName;
    this.setError(`Are you sure you want to delete ${projectName}?`);
    super.show();
  }
}