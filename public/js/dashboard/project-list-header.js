class ProjectListHeader extends Component {
  constructor(containerElement, createProjectCallback) {
    super(containerElement);

    this._newProjectButton = containerElement.querySelector("#new-project");
    this._newProjectButton.addEventListener("click", this.showCreateProjectModal.bind(this));
    this._createProjectModal = new CreateProjectModal(document.querySelector("#modal-create-project"),
      createProjectCallback);
  }

  showCreateProjectModal() {
    this._createProjectModal.show();
  }

  closeModal() {
    this._createProjectModal.hide();
  }

  setModalError(error) {
    this._createProjectModal.setError(error);
  }
}