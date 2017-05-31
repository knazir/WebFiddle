class Sidebar extends Component {
  constructor(containerElement, selectItemCallback) {
    super(containerElement);
    this._selectItemCallback = selectItemCallback;
    this.fileElements = [];
  }

  setProject(project) {
    this._project = project;
    this._setTitle();
    this._fillFileTree();
  }

  _setTitle() {
    this.containerElement.querySelector(".project-title").textContent = this._project.name;
  }

  _fillFileTree() {
    const fileTreeElement = this.containerElement.querySelector(".file-tree");

    this._project.files.forEach((file) => {
      const itemElement = ListItem.createDomNode();
      const item = new ListItem(itemElement, file, this._selectItemCallback);
      this.fileElements.push(item);
      fileTreeElement.appendChild(itemElement);
    })
  }
}