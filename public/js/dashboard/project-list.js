class ProjectList extends Component {
  constructor(containerElement, selectProjectCallback) {
    super(containerElement);

    this._user = {};
    this._projects = [];
    this._selectProjectCallback = selectProjectCallback;

    this._projectListHeader = new ProjectListHeader(containerElement.querySelector("#dashboard-header"),
      this._createProjectCallback.bind(this));
    this._projectsElement = this._containerElement.querySelector(".projects");
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
    if (this._user.projects.length === 0) this._projectListHeader.showCreateProjectModal();

    this._user.projects.forEach((project) => {
      const tileElement = ProjectTile.createDomNode();
      const projectTile = new ProjectTile(tileElement, project, this._selectProjectCallback);
      this._projects.push(projectTile);
      this._projectsElement.appendChild(tileElement);
    });
  }

  _createProjectCallback(projectName, useStarterCode) {
    Api.createProject(this._user.username, projectName, useStarterCode, (newProject) => {
      this._user.projects.push(newProject);
      this.reset();
      this._fillProjectsList();
      this._projects.filter(tile => tile.getProject().name === projectName)[0].getContainerElement().click();
      this._projectListHeader.closeModal();
    }, (error) => {
      this._projectListHeader.setModalError(error.response);
    });
  }
}