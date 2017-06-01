class ProjectView extends Component {
  constructor(containerElement) {
    super(containerElement);

    this._user = {};
    this._project = {};

    this._sidebar = new Sidebar(containerElement.querySelector("#sidebar"), this._selectEditorFileCallback.bind(this));
    this._toolbar = new Toolbar(containerElement.querySelector("#toolbar"));
    this._editor = new Editor(containerElement.querySelector("#editor-area"), this._selectSidebarFileCallback.bind(this),
      this._deselectSidebarFileCallback.bind(this));
  }

  reset() {
    this._user = {};
    this._project = {};
    this._sidebar.reset();
    this._toolbar.reset();
    this._editor.reset();
  }

  setUser(user) {
    this._user = user;
    this._editor.setUser(user);
  }

  setProject(project) {
    this._project = project;
    this._sidebar.setProject(project);
    this._toolbar.setProject(project);
    this._editor.setProject(project);
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