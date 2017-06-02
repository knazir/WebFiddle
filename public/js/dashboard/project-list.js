class ProjectList extends Component {
  constructor(containerElement, selectProjectCallback) {
    super(containerElement);

    this._user = {};
    this._projects = [];
    this._selectProjectCallback = selectProjectCallback;

    this._projectListHeader = new ProjectListHeader(containerElement.querySelector("#dashboard-header"),
      this._deleteProjectCallback.bind(this), this._createProjectCallback.bind(this));
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

  _deleteProjectCallback(projectName) {
    Api.deleteProject(this._user.username, projectName, (response) => {
      const project = this._user.projects.filter(project => project.name === projectName)[0];
      if (!project) {
        this._projectListHeader.setModalError(`Project ${projectName} does not exist.`);
        return;
      }
      this._user.projects.splice(this._user.projects.indexOf(project), 1);
      this.reset();
      this._fillProjectsList();
      this._projectListHeader.closeModal();
    }, (error) => {
      this._projectListHeader.setModalError(error.response);
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