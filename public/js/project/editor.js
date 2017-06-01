class Editor extends Component {
  constructor(containerElement, selectSidebarFileCallback, deselectSidebarFilesCallback) {
    super(containerElement);

    this._user = {};
    this._project = {};
    this._file = {};
    this._editor = this._createEditor();

    this._fileBar = new FileBar(containerElement.querySelector("#file-bar"), this.setFile.bind(this),
      selectSidebarFileCallback, deselectSidebarFilesCallback);
  }

  reset() {
    this._project = {};
    this._file = {};
    this._fileBar.reset();
    this._editor.setValue("Select or create a new file!", 1);
  }

  setUser(user) {
    this._user = user;
  }

  setProject(project) {
    this._project = project;
  }

  setFile(file, updateFileBar) {
    this._file = file;
    if (updateFileBar) this._fileBar.setFile(file);
    this._editor.getSession().setMode(this._getEditorMode());
    this._editor.setValue(file.contents, -1);
    this._editor.setReadOnly(false);
    this._editor.renderer.$cursorLayer.element.classList.remove("hidden");
    this._editor.resize();
  }

  clearEditor() {
    this._editor.setValue("");
    this._editor.setReadOnly(true);
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
    this._file.contents = this._editor.getValue();
    Api.updateFile(this._user.username, this._project.id, this._file.id, this._editor.getValue());
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