class Sidebar extends Component {
  constructor(containerElement, selectEditorFileCallback, deleteFileCallback, createFileCallback) {
    super(containerElement);

    this._project = {};
    this._listItems = [];

    this._titleElement = containerElement.querySelector(".project-title");
    containerElement.querySelector("#add-file").addEventListener("click", createFileCallback);
    this._fileTreeElement = this._containerElement.querySelector(".file-tree");

    this._selectEditorFileCallback = (file) => {
      this.setFile(file);
      selectEditorFileCallback(file);
    };
    this._deleteFileCallback = deleteFileCallback;
  }

  setFile(file) {
    this.deselectAll();
    this._listItems.filter(listItem => file.id === listItem.getFile().id)[0].select();
  }

  deselectAll() {
    this._listItems.forEach(listItem => listItem.deselect());
  }

  reset() {
    this._project = {};
    this._listItems = [];
    this._titleElement.innerHTML = "";
    this._fileTreeElement.innerHTML = "";
  }

  setProject(project) {
    this._project = project;
    this._setTitle();
    this.fillFileTree();
  }

  fillFileTree() {
    this._fileTreeElement.innerHTML = "";
    this._listItems = [];

    this._project.files.forEach((file) => {
      const itemElement = ListItem.createDomNode();
      const item = new ListItem(itemElement, file, this._selectEditorFileCallback,
        () => this._deleteFileCallback(file.filename));
      this._listItems.push(item);
      this._fileTreeElement.appendChild(itemElement);
    })
  }

  _setTitle() {
    this._titleElement.textContent = this._project.name;
  }
}