class ProjectList extends Component {
  constructor(containerElement, selectProjectCallback) {
    super(containerElement);

    this._user = {};
    this._projects = [];

    this._projectsElement = this._containerElement.querySelector(".projects");

    this._selectProjectCallback = selectProjectCallback;
  }

  reset() {
    this._projects = [];
    this._projectsElement.innerHTML = "";
  }

  setUser(user) {
    this._user = user;
    this._fillProjectsList();
  }

  _fillProjectsList() {
    this._user.projects.forEach((project) => {
      const tileElement = ProjectTile.createDomNode();
      const projectTile = new ProjectTile(tileElement, project, this._selectProjectCallback);
      this._projects.push(projectTile);
      this._projectsElement.appendChild(tileElement);
    });
  }
}