class ProjectView extends Component {
  constructor(containerElement) {
    super(containerElement);

    this._user = {};
    this._project = {};

    this._projectHeader = new ProjectHeader(containerElement.querySelector("#project-header"),
      this._toggleLineWrapCallback.bind(this), this._toggleLivePreviewCallback.bind(this),
      this._openFullPreviewCallback.bind(this), this._getShareableLinkCallback.bind(this));
    this._sidebar = new Sidebar(containerElement.querySelector("#sidebar"), this._selectEditorFileCallback.bind(this));
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
    this._project = project;
    this._projectHeader.setProject(project);
    this._sidebar.setProject(project);
    this._editor.setProject(project);
    this._livePreview.setProject(project);
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
}