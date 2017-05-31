class Sidebar extends Component {
  constructor(containerElement, selectItemCallback) {
    super(containerElement);

    this._project = {};
    this._listItems = [];

    this._titleElement = containerElement.querySelector(".project-title");
    this._fileTreeElement = this.containerElement.querySelector(".file-tree");

    this._selectItemCallback = (file) => {
      this._listItems.forEach(listItem => listItem.deselect());
      this._listItems.filter(listItem => file === listItem.getFile())[0].select();
      selectItemCallback(file);
    };
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
    this._fillFileTree();
  }

  _setTitle() {
    this._titleElement.textContent = this._project.name;
  }

  _fillFileTree() {
    this._project.files.forEach((file) => {
      const itemElement = ListItem.createDomNode();
      const item = new ListItem(itemElement, file, this._selectItemCallback);
      this._listItems.push(item);
      this._fileTreeElement.appendChild(itemElement);
    })
  }
}