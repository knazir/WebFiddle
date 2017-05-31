class ProjectList extends Component {
  constructor(containerElement, selectProjectCallback) {
    super(containerElement);
    this._selectProjectCallback = selectProjectCallback;
    this._projects = [];
  }

  reset() {
    this._user = {};
    this._projects = [];
  }

  setUser(user) {
    this._user = user;
    this._fillProjectsList();
  }

  _fillProjectsList() {
    const projectsElement = this.containerElement.querySelector(".projects");

    this._user.projects.forEach((project) => {
      const tileElement = ProjectTile.createDomNode();
      const projectTile = new ProjectTile(tileElement, project, this._selectProjectCallback);
      this._projects.push(projectTile);
      projectsElement.appendChild(tileElement);
    });
  }
}