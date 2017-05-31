class ListItem extends Component {
  constructor(containerElement, file, selectItemCallback) {
    super(containerElement);
    containerElement.addEventListener("click", () => selectItemCallback(file));
    containerElement.querySelector("img").src = this._getIconImage(file);
    containerElement.querySelector(".filename").textContent = file.filename;
  }

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
}