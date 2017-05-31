class Editor extends Component {
  constructor(containerElement) {
    super(containerElement);
    this._createEditor();
  }

  setFile(file) {
    this._file = file;
    this._editor.getSession().setMode(this._getEditorMode());
  }

  _createEditor() {
    this._editor = ace.edit("editor");
    this._editor.setTheme("ace/theme/monokai");
    this._editor.getSession().setMode(this._getEditorMode());
    this._editor.getSession().setUseWrapMode(true);
    this._editor.getSession().setUseSoftTabs(true);
    this._editor.getSession().setTabSize(4);
  }

  _getEditorMode() {
    if (!this._file) return "ace/mode/text";

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