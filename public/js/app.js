class App extends Component {
  constructor(containerElement) {
    super(containerElement);

    this._authBox = new AuthBox(document.querySelector("#auth-box"), this._forceSignInCallback.bind(this),
      this._signinCallback.bind(this));
    this._projectList = new ProjectList(document.querySelector("#project-list"),
      this._selectProjectCallback.bind(this));
    this._projectView = new ProjectView(document.querySelector("#project-view"),
      this._showProjectListCallback.bind(this));

    this._authBox.getLoggedIn();
  }

  _showProjectListCallback() {
    this._projectView.hide();
    this._projectList.show();
  }

  _forceSignInCallback() {
    this._projectList.reset();
    this._projectList.hide();

    this._projectView.reset();
    this._projectView.hide();

    this._authBox.show();
  }

  _signinCallback(user) {
    this._projectList.reset();
    this._projectView.reset();

    this._user = user;
    this._projectList.setUser(user);
    this._projectView.setUser(user);
    this._authBox.hide();
    this._projectList.show();
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