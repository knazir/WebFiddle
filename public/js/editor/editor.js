class Editor extends Component {
  constructor(containerElement, selectSidebarFileCallback, deselectSidebarFilesCallback, updateLivePreviewCallback) {
    super(containerElement);

    this._user = {};
    this._project = {};
    this._file = {};
    this._fresh = true;
    this._lastFetchedFile = null;
    this._editor = this._createEditor();
    this._updateLivePreviewCallback = updateLivePreviewCallback;
    this._fileBar = new FileBar(containerElement.querySelector("#file-bar"), this.setFile.bind(this),
      selectSidebarFileCallback, deselectSidebarFilesCallback);
  }

  reset() {
    this._project = {};
    this._file = {};
    this._fresh = true;
    this._fileBar.reset();
    this._editor.setValue("Select or create a new file!", -1);
    this._editor.getSession().setMode("ace/mode/text");
  }

  resize(showPreview) {
    this._containerElement.style.width = showPreview ? "40%" : "";
    this._editor.resize();
  }

  setUser(user) {
    this._user = user;
  }

  setProject(project) {
    this._project = project;
  }

  async setFile(file, updateFileBar) {
    // Make sure changes to this file are done
    if (!_.isEmpty(this._file) && !this._fresh && file.id !== this._lastFetchedFile) {
      await Api.updateFile(this._user.username, this._project.name, this._file.id, this._editor.getValue());
    }

    // Ensure we have the latest version
    Api.getFile(this._user.username, this._project.name, file.id, (latestFile) => {
      this._fresh = false;
      this._lastFetchedFile = latestFile.id;
      this._file = latestFile;
      if (updateFileBar) this._fileBar.setFile(latestFile);
      this._editor.getSession().setMode(this._getEditorMode());
      this._editor.setValue(latestFile.contents, -1);
      this._editor.setReadOnly(false);
      this._editor.renderer.$cursorLayer.element.classList.remove("hidden");
      this._editor.resize();
      this._editor.focus();
    });
  }

  removeFile(file) {
    this._fileBar.closeFileTab(file);
  }

  clearEditor() {
    this._editor.setValue("Select or create a new file!", -1);
    this._editor.setReadOnly(true);
  }

  setLineWrap(wrap) {
    this._editor.getSession().setUseWrapMode(wrap);
    this._editor.resize();
  }

  _createEditor() {
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode(this._getEditorMode());
    editor.getSession().setUseWrapMode(true);
    editor.getSession().setUseSoftTabs(true);
    editor.getSession().setTabSize(4);
    editor.setReadOnly(true);
    editor.$blockScrolling = Infinity;
    editor.renderer.$cursorLayer.element.classList.add("hidden");
    editor.getSession().on("change", _.debounce((event) => this._onEditorChange(event), 1000));
    return editor;
  }

  _onEditorChange(event) {
    if ((event.action !== "insert" && event.action !== "remove") || !this._file.id) return;
    const newContents = this._editor.getValue();
    this._file.contents = newContents;
    this._updateLivePreviewCallback();
    Api.updateFile(this._user.username, this._project.name, this._file.id, newContents);
  }

  _getEditorMode() {
    if (!this._file.filename) return "ace/mode/text";

    const fileExtension = this._file.filename.substring(this._file.filename.lastIndexOf("."));
    switch(fileExtension) {
      case ".html":
        return "ace/mode/html";
      case ".js":
        return "ace/mode/javascript";
      case ".css":
        return "ace/mode/css";
      default:
        return "ace/mode/text";
    }
  }
}