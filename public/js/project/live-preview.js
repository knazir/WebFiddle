class LivePreview extends Component {
  constructor(containerElement, username, projectId) {
    super(containerElement);

    this._user = {};
    this._project = {};
    this._file = {};
    this._visible = false;
    this._previewTitle = containerElement.querySelector("#live-preview-title");
    this._previewFrame = containerElement.querySelector("#preview-frame");
  }

  reset() {
    this._project = {};
    this._file = {};
    this.setVisibility(false);
    this._previewTitle.innerHTML = "";
    this._previewFrame.src = "";
  }

  setUser(user) {
    this._user = user;
    this._trySetup();
  }

  setProject(project) {
    this._project = project;
    this._trySetup();
  }

  setFile(file) {
    this._file = file;
    this._trySetup();
  }

  setVisibility(show) {
    this._visible = show;
    if (show) {
      this.show();
      this._trySetup();
    } else {
      this.hide();
      this._previewFrame.src = "";
    }
  }

  refreshContents() {
    this._previewFrame.contentWindow.location.reload();
  }

  getPreviewURL() {
    let url = `/view/${this._user.username}/${this._project.name}`;
    if (this._file.type === "html" && this._file.filename !== "index.html") url += `/${this._file.filename}`;
    return url;
  }

  getShareableURL() {
    return `${window.location.origin}/view/${this._user.username}/${this._project.name}`;
  }

  _trySetup() {
    if (!_.isEmpty(this._user) && !_.isEmpty(this._project) && this._visible) {
      let src = `/view/${this._user.username}/${this._project.name}`;
      let filename = "index.html";

      if (this._file.type === "html" && this._file.filename !== "index.html") {
        src += `/${this._file.filename}`;
        filename = this._file.filename;
      }

      this._previewTitle.textContent = filename;
      this._previewFrame.src = src;
    }
  }
}