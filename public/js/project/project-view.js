class ProjectView extends Component {
  constructor(containerElement) {
    super(containerElement);

    this._project = {};

    this._sidebar = new Sidebar(containerElement.querySelector("#sidebar"), this._selectItemCallback.bind(this));
    this._toolbar = new Toolbar(containerElement.querySelector("#toolbar"));
    this._editor = new Editor(containerElement.querySelector("#editor"));
  }

  reset() {
    this._project = {};
    this._sidebar.reset();
    this._toolbar.reset();
    this._editor.reset();
  }

  setProject(project) {
    this._project = project;
    this._sidebar.setProject(project);
    this._toolbar.setProject(project);
  }

  _selectItemCallback(file) {
    this._editor.setFile(file);
  }
}