class Editor extends Component {
  constructor(containerElement) {
    super(containerElement);

    this._file = {};
    this._editor = this._createEditor();
  }

  reset() {
    this._file = {};
    this._editor.setValue("");
  }

  setFile(file) {
    this._file = file;
    this._editor.getSession().setMode(this._getEditorMode());
  }

  _createEditor() {
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode(this._getEditorMode());
    editor.getSession().setUseWrapMode(true);
    editor.getSession().setUseSoftTabs(true);
    editor.getSession().setTabSize(4);
    return editor;
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