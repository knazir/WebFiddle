class ProjectHeader extends Component {
  constructor(containerElement, toggleLineWrapCallback, toggleLivePreviewCallback, openFullPreviewCallback,
              getShareableLinkCallback, createFileCallback, deleteFileCallback) {
    super(containerElement);

    this._user = {};
    this._project = {};
    this._activeModal = null;

    this._createFileModal = new CreateFileModal(document.querySelector("#modal-create-file"), createFileCallback);
    this._deleteFileModal = new DeleteFileModal(document.querySelector("#modal-delete-file"), deleteFileCallback);

    // Create File
    this._createFileButton = containerElement.querySelector("#create-file");
    this._createFileButton.addEventListener("click", this.showCreateFileModal.bind(this));

    // Delete File
    this._deleteFileButton = containerElement.querySelector("#delete-file");
    this._deleteFileButton.addEventListener("click", this.showDeleteFileModal.bind(this));

    // Line Wrap
    this._toggleLineWrap = new CheckboxItem(containerElement.querySelector("#line-wrap-toggle"),
      toggleLineWrapCallback);

    // Split View
    this._toggleLivePreview = new CheckboxItem(containerElement.querySelector("#live-preview-toggle"),
      toggleLivePreviewCallback);

    // Preview
    this._fullPreviewButton = containerElement.querySelector("#full-preview-button");
    this._fullPreviewButton.addEventListener("click", openFullPreviewCallback);

    // Publish
    this._togglePublished = new CheckboxItem(containerElement.querySelector("#published-toggle"),
      this._togglePublished.bind(this));

    // Share
    this._shareButton = containerElement.querySelector("#share");
    this._shareButton.addEventListener("click", getShareableLinkCallback);
  }

  reset() {
    this._project = {};
  }

  setUser(user) {
    this._user = user;
  }

  setProject(project) {
    this._project = project;
  }

  showCreateFileModal() {
    this._activeModal = this._createFileModal;
    this._createFileModal.show();
  }

  showDeleteFileModal() {
    this._activeModal = this._deleteFileModal;
    this._deleteFileModal.show();
  }

  setModalError(error) {
    this._activeModal.setError(error);
  }

  closeModal() {
    this._activeModal.hide();
  }

  _togglePublished(published) {
    Api.setProjectPublished(this._user.username, this._project.name, published);
  }
}