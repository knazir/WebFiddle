class App extends Component {
  constructor(containerElement) {
    super(containerElement);

    this._authBox = new AuthBox(document.querySelector("#auth-box"), this._signinCallback.bind(this));
    this._projectList = new ProjectList(document.querySelector("#project-list"), this._selectProjectCallback.bind(this));
    this._projectView = new ProjectView(document.querySelector("#project-view"));
  }

  _signinCallback(event) {
    this._projectList.reset();
    this._projectView.reset();

    const username = event.target[0].value;
    const password = event.target[1].value;
    this._getUser(username, password);
  }

  _getUser(username, password) {
    Api.getUser(username, password, (user) => {
      this._user = user;
      this._projectList.setUser(user);
      this._authBox.hide();
      this._projectList.show();
    });
  }

  _selectProjectCallback(project) {
    this._projectView.reset();

    Api.getProject(this._user.username, project.name, (project) => {
      this._project = project;
      this._projectView.setProject(project);
      this._projectList.hide();
      this._projectView.show();
    });
  }
}