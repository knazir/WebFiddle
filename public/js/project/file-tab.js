class FileTab extends Component {
  constructor(containerElement, file, selectFileCallback, closeFileCallback) {
    super(containerElement);

    this._file = file;
    this._isSelected = false;

    this._containerElement.addEventListener("click", selectFileCallback);
    this._containerElement.querySelector(".filename").textContent = file.filename;
    this._containerElement.querySelector(".close-button").addEventListener("click", (event) => {
      event.stopPropagation();
      closeFileCallback();
    });
  }

  getFile() {
    return this._file;
  }

  select() {
    this._isSelected = true;
    this._containerElement.classList.add("selected");
  }

  deselect() {
    this._isSelected = false;
    this._containerElement.classList.remove("selected");
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