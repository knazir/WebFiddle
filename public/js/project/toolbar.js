class Toolbar extends Component {
  constructor(containerElement) {
    super(containerElement);

    this._project = {};
  }

  reset() {
    this._project = {};
  }

  setProject(project) {
    this._project = project;
  }
}