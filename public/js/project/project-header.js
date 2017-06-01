class ProjectHeader extends Component {
  constructor(containerElement, toggleLineWrapCallback, toggleLivePreviewCallback, openFullPreviewCallback,
              getShareableLinkCallback) {
    super(containerElement);

    this._user = {};
    this._project = {};

    // Line Wrap
    this._toggleLineWrap = new CheckboxItem(containerElement.querySelector("#line-wrap-toggle"),
      toggleLineWrapCallback);

    // Split View
    this._toggleLivePreview = new CheckboxItem(containerElement.querySelector("#live-preview-toggle"),
      toggleLivePreviewCallback);

    // Preview
    this._fullPreviewButton = containerElement.querySelector("#full-preview-button");
    this._fullPreviewButton.addEventListener("click", openFullPreviewCallback);

    // Publish
    this._togglePublished = new CheckboxItem(containerElement.querySelector("#published-toggle"),
      this._togglePublished.bind(this));

    // Share
    this._shareButton = containerElement.querySelector("#share");
    this._shareButton.addEventListener("click", getShareableLinkCallback);
  }

  reset() {
    this._project = {};
  }

  setUser(user) {
    this._user = user;
  }

  setProject(project) {
    this._project = project;
  }

  _togglePublished(published) {
    Api.setProjectPublished(this._user.username, this._project.id, published);
  }

}