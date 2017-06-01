class LivePreview extends Component {
  constructor(containerElement, username, projectId) {
    super(containerElement);

    this._user = {};
    this._project = {};
    this._visible = false;
    this._previewFrame = containerElement.querySelector("#preview-frame");
  }

  setUser(user) {
    this._user = user;
    this._trySetup();
  }

  setProject(project) {
    this._project = project;
    this._trySetup();
  }

  _trySetup() {
    if (!_.isEmpty(this._user) && !_.isEmpty(this._project) && this._visible) {
      this._previewFrame.src = `/preview/${this._user.username}/${this._project.id}`;
    }
  }

  reset() {
    this._project = {};
    this.setVisibility(false);
    this._previewFrame.src = "";
  }

  setVisibility(show) {
    this._visible = show;
    if (show) {
      this.show();
      this._trySetup();
    } else {
      this.hide();
    }
  }

  refreshContents() {
    this._previewFrame.contentWindow.location.reload();
  }
}