class ProjectView extends Component {
  constructor(containerElement) {
    super(containerElement);

    this._user = {};
    this._project = {};

    this._projectHeader = new ProjectHeader(containerElement.querySelector("#project-header"),
      this._toggleLineWrapCallback.bind(this), this._toggleLivePreviewCallback.bind(this),
      this._openFullPreviewCallback.bind(this), this._getShareableLinkCallback.bind(this),
      this._createFileCallback.bind(this), this._deleteFileCallback.bind(this));
    this._sidebar = new Sidebar(containerElement.querySelector("#sidebar"), this._selectEditorFileCallback.bind(this),
      this._confirmDeleteFile.bind(this), () => this._projectHeader.showCreateFileModal());
    this._editor = new Editor(containerElement.querySelector("#editor-area"), this._selectSidebarFileCallback.bind(this),
      this._deselectSidebarFileCallback.bind(this), this._updateLivePreviewCallback.bind(this));
    this._livePreview = new LivePreview(containerElement.querySelector("#live-preview"));
  }

  reset() {
    this._project = {};
    this._projectHeader.reset();
    this._sidebar.reset();
    this._editor.reset();
    this._livePreview.reset();
  }

  setUser(user) {
    this._user = user;
    this._projectHeader.setUser(user);
    this._editor.setUser(user);
    this._livePreview.setUser(user);
  }

  setProject(project) {
    // Make sure we have the latest version of the project
    Api.getProject(this._user.username, project.name, (newProject) => {
      this._project = newProject;
      this._projectHeader.setProject(newProject);
      this._sidebar.setProject(newProject);
      this._editor.setProject(newProject);
      this._livePreview.setProject(newProject);

      if (this._project.files.length === 0) this._projectHeader.showCreateFileModal();
    });
  }

  _toggleLineWrapCallback(wrap) {
    this._editor.setLineWrap(wrap);
  }

  _toggleLivePreviewCallback(showPreview) {
    this._editor.resize(showPreview);
    this._livePreview.setVisibility(showPreview);
  }

  _updateLivePreviewCallback() {
    this._livePreview.refreshContents();
  }

  _openFullPreviewCallback() {
    window.open(this._livePreview.getPreviewURL());
  }

  /*
   * TODO: Create sharing modal
   */
  _getShareableLinkCallback() {
    return this._livePreview.getShareableURL();
  }

  _selectEditorFileCallback(file) {
    this._editor.setFile(file, true);
    this._livePreview.setFile(file);
  }

  _selectSidebarFileCallback(file) {
    this._sidebar.setFile(file);
    this._livePreview.setFile(file);
  }

  _deselectSidebarFileCallback() {
    this._editor.clearEditor();
    this._sidebar.deselectAll();
  }

  _createFileCallback(filename, type) {
    Api.createFile(this._user.username, this._project.name, filename, type, (file) => {
      this._project.files.push(file);
      this._sidebar.fillFileTree();
      this._selectSidebarFileCallback(file);
      this._selectEditorFileCallback(file);
      this._projectHeader.closeModal();
    }, (error) => {
      this._projectHeader.setModalError(error.response);
    })
  }

  _confirmDeleteFile(filename) {
    this._projectHeader.showDeleteFileModal(filename);
  }

  _deleteFileCallback(filename) {
    Api.deleteFile(this._user.username, this._project.name, filename, (reponse) => {
      const file = this._project.files.filter(file => file.filename === filename)[0];

      if (!file) {
        this._projectHeader.setModalError(`File ${filename} does not exist.`);
        return;
      }

      this._project.files.splice(this._project.files.indexOf(file), 1);
      this._sidebar.fillFileTree();
      this._editor.removeFile(file);

      this._projectHeader.closeModal();
      if (this._project.files.length === 0) this._projectHeader.showCreateFileModal();
    }, (error) => {
      this._projectHeader.setModalError(error.response);
    })
  }
}