class ListItem extends Component {
  constructor(containerElement, file, selectEditorFileCallback) {
    super(containerElement);
    this._file = file;
    containerElement.addEventListener("click", () => selectEditorFileCallback(file));
    containerElement.querySelector("img").src = this._getIconImage(file);
    containerElement.querySelector(".filename").textContent = file.filename;
  }

  getFile() {
    return this._file;
  }

  select() {
    this._containerElement.classList.add("selected");
  }

  deselect() {
    this._containerElement.classList.remove("selected");
  }

  _getIconImage(file) {
    switch(file.type) {
      case "file":
        return "images/file.png";
      case "directory":
        return "images/directory.png";
      default:
        return "images/file.png";
    }
  }

  /* Creates the following DOM element:
   *   <div class="list-item">
   *     <img class="list-icon" />
   *     <span class="filename"></span>
   *   </div>
   */
  static createDomNode() {
    const element = document.createElement("div");
    element.classList.add("list-item");

    const icon = document.createElement("img");
    icon.classList.add("list-icon");
    element.appendChild(icon);

    const filename = document.createElement("span");
    filename.classList.add("filename");
    element.appendChild(filename);

    return element;
  }
}