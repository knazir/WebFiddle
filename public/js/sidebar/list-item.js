class ListItem extends Component {
  constructor(containerElement, file, selectEditorFileCallback, deleteFileCallback) {
    super(containerElement);
    this._file = file;

    this._deleteButtonElement = containerElement.querySelector(".delete-file-button");
    this._deleteButton = new Component(this._deleteButtonElement);
    this._deleteButtonElement.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteFileCallback();
    });

    containerElement.addEventListener("click", () => selectEditorFileCallback(file));
    containerElement.addEventListener("mouseenter", this._showDeleteButton.bind(this));
    containerElement.addEventListener("mouseleave", this._hideDeleteButton.bind(this));

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

  _showDeleteButton() {
    this._deleteButton.show();
  }

  _hideDeleteButton() {
    this._deleteButton.hide();
  }

  /* Creates the following DOM element:
   * <div class="list-item">
   *   <div class="file-info">
   *     <img class="list-icon" src="images/file.png">
   *     <span class="filename"></span>
   *   </div>
   *   <span class="delete-file-button hidden">×</span>
   * </div>
   */
  static createDomNode() {
    const element = document.createElement("div");
    element.classList.add("list-item");

    const fileInfo = document.createElement("div");
    fileInfo.classList.add("file-info");

    const icon = document.createElement("img");
    icon.classList.add("list-icon");
    fileInfo.appendChild(icon);

    const filename = document.createElement("span");
    filename.classList.add("filename");
    fileInfo.appendChild(filename);

    element.appendChild(fileInfo);

    const deleteButton = document.createElement("span");
    deleteButton.classList.add("delete-file-button");
    deleteButton.classList.add("hidden");
    deleteButton.innerHTML = "&times;";
    element.appendChild(deleteButton);

    return element;
  }
}