class ProjectView extends Component {
  constructor(containerElement) {
    super(containerElement);

    this._user = {};
    this._project = {};

    this._projectHeader = new ProjectHeader(containerElement.querySelector("#project-header"),
      this._toggleLivePreviewCallback.bind(this));
    this._sidebar = new Sidebar(containerElement.querySelector("#sidebar"), this._selectEditorFileCallback.bind(this));
    this._toolbar = new Toolbar(containerElement.querySelector("#toolbar"));
    this._editor = new Editor(containerElement.querySelector("#editor-area"), this._selectSidebarFileCallback.bind(this),
      this._deselectSidebarFileCallback.bind(this), this._updateLivePreviewCallback.bind(this));
    this._livePreview = new LivePreview(containerElement.querySelector("#live-preview"));
  }

  reset() {
    this._project = {};
    this._sidebar.reset();
    this._toolbar.reset();
    this._editor.reset();
    this._livePreview.reset();
  }

  setUser(user) {
    this._user = user;
    this._editor.setUser(user);
    this._livePreview.setUser(user);
  }

  setProject(project) {
    this._project = project;
    this._sidebar.setProject(project);
    this._toolbar.setProject(project);
    this._editor.setProject(project);
    this._livePreview.setProject(project);
  }

  _toggleLivePreviewCallback(showPreview) {
    this._editor.resize(showPreview);
    this._livePreview.setVisibility(showPreview);
  }

  _updateLivePreviewCallback() {
    this._livePreview.refreshContents();
  }

  _selectEditorFileCallback(file) {
    this._editor.setFile(file, true);
  }

  _selectSidebarFileCallback(file) {
    this._sidebar.setFile(file);
  }

  _deselectSidebarFileCallback() {
    this._editor.clearEditor();
    this._sidebar.deselectAll();
  }
}