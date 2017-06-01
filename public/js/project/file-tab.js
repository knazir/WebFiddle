class FileTab extends Component {
  constructor(containerElement, file, selectFileCallback, closeFileCallback) {
    super(containerElement);

    this._file = file;
    this._isSelected = false;

    this.containerElement.addEventListener("click", selectFileCallback);
    this.containerElement.querySelector(".filename").textContent = file.filename;
    this.containerElement.querySelector(".close-button").addEventListener("click", (event) => {
      event.stopPropagation();
      closeFileCallback();
    });
  }

  getContainerElement() {
    return this.containerElement;
  }

  getFile() {
    return this._file;
  }

  select() {
    this._isSelected = true;
    this.containerElement.classList.add("selected");
  }

  deselect() {
    this._isSelected = false;
    this.containerElement.classList.remove("selected");
  }

  isSelected() {
    return this._isSelected;
  }

  /* Creates the following DOM element:
   *   <div class="file-tab">
   *     <span class="filename"></span>
   *     <span class="close-button">x</span>
   *   </div>
   */
  static createDomNode() {
    const element = document.createElement("div");
    element.classList.add("file-tab");

    const filenameElement = document.createElement("span");
    filenameElement.classList.add("filename");
    element.appendChild(filenameElement);

    const closeButtonElement = document.createElement("span");
    closeButtonElement.classList.add("close-button");
    closeButtonElement.textContent = "x";
    element.appendChild(closeButtonElement);

    return element;
  }
}