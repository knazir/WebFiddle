class ProjectHeader extends Component {
  constructor(containerElement, toggleLineWrapCallback, toggleLivePreviewCallback, openFullPreviewCallback,
              getShareableLinkCallback, createFileCallback, deleteFileCallback, showProjectListCallback) {
    super(containerElement);

    this._user = {};
    this._project = {};
    this._activeModal = null;

    // Logo
    containerElement.querySelector(".logo").addEventListener("click", showProjectListCallback);

    // Create File
    this._createFileModal = new CreateFileModal(document.querySelector("#modal-create-file"), createFileCallback);


    // Delete File
    this._deleteFileModal = new DeleteFileModal(document.querySelector("#modal-delete-file"), deleteFileCallback);

    // Line Wrap
    this._toggleLineWrap = new CheckboxItem(containerElement.querySelector("#line-wrap-toggle"),
      toggleLineWrapCallback);

    // Split View
    this._toggleLivePreview = new CheckboxItem(containerElement.querySelector("#live-preview-toggle"),
      toggleLivePreviewCallback);

    // Preview
    this._fullPreviewButton = containerElement.querySelector("#full-preview-button");
    this._fullPreviewButton.addEventListener("click", openFullPreviewCallback);

    // Share
    this._getShareableLinkCallback = getShareableLinkCallback;
    this._shareModal = new ShareModal(document.querySelector("#modal-share"));
    this._shareButton = containerElement.querySelector("#share");
    this._shareButton.addEventListener("click", this.showShareModal.bind(this));
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

  showDeleteFileModal(filename) {
    this._activeModal = this._deleteFileModal;
    this._deleteFileModal.show(filename);
  }

  showShareModal() {
    this._activeModal = this._shareModal;
    this._shareModal.setURL(this._getShareableLinkCallback());
    this._shareModal.show(this._project.published);
  }

  setModalError(error) {
    this._activeModal.setError(error);
  }

  closeModal() {
    this._activeModal.hide();
  }

  _setPublishedStatus(published) {
    Api.setProjectPublished(this._user.username, this._project.name, published, () => {
      this._project.published = published;
    });
  }
}