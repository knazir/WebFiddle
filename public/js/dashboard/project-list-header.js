class ProjectListHeader extends Component {
  constructor(containerElement, deleteProjectCallback, createProjectCallback) {
    super(containerElement);

    this._deleteProjectModal = new DeleteProjectModal(document.querySelector("#modal-delete-project"),
      deleteProjectCallback);

    this._newProjectButton = containerElement.querySelector("#new-project");
    this._newProjectButton.addEventListener("click", this.showCreateProjectModal.bind(this));
    this._createProjectModal = new CreateProjectModal(document.querySelector("#modal-create-project"),
      createProjectCallback);

    this._activeModal = null;
  }

  showCreateProjectModal() {
    this._activeModal = this._createProjectModal;
    this._createProjectModal.show();
  }

  closeModal() {
    this._activeModal.hide();
  }

  setModalError(error) {
    this._activeModal.setError(error);
  }

  _showDeleteProjectModal(projectName) {
    this._activeModal = this._deleteProjectModal;
    this._deleteProjectModal.show(projectName);
  }
}