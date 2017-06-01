class FileBar extends Component {
  constructor(containerElement, selectFileEditorFileCallback, selectSidebarFileCallback, deselectSidebarFilesCallback) {
    super(containerElement);

    this._selectFileEditorFileCallback = selectFileEditorFileCallback;
    this._selectSidebarFileCallback = selectSidebarFileCallback;
    this._deselectSidebarFilesCallback = deselectSidebarFilesCallback;
    this._fileTabs = [];
  }

  reset() {
    this._fileTabs = [];
    this.containerElement.innerHTML = "";
  }

  setFile(file) {
    let fileTab = this._fileTabs.filter(fileTab => fileTab.getFile() === file)[0];

    if (!fileTab) {
      const fileTabElement = FileTab.createDomNode();
      fileTab = new FileTab(fileTabElement, file, () => this._selectFileTab(file), () => this._closeFileTab(file));
      this._fileTabs.push(fileTab);
      this.containerElement.appendChild(fileTab.getContainerElement());
    }

    this._selectFileTab(file);
  }

  _selectFileTab(file) {
    this._selectFileEditorFileCallback(file, false);
    this._selectSidebarFileCallback(file);
    this._fileTabs.forEach(fileTab => fileTab.deselect());
    this._fileTabs.filter(fileTab => fileTab.getFile() === file)[0].select();
  }

  _closeFileTab(file) {
    let fileTabIndex = -1;
    for (let i = 0; i < this._fileTabs.length; i++) {
      const fileTab = this._fileTabs[i];
      if (fileTab.getFile() === file) {
        fileTabIndex = i;
        break;
      }
    }

    const fileTab = this._fileTabs[fileTabIndex];
    this.containerElement.removeChild(fileTab.getContainerElement());
    this._fileTabs.splice(fileTabIndex, 1);

    // Deleting tab that's not selected, don't change current selection
    if (!fileTab.isSelected()) return;

    if (this._fileTabs[fileTabIndex]) {
      this._selectFileTab(this._fileTabs[fileTabIndex].getFile());
    } else if (this._fileTabs[fileTabIndex - 1]) {
      this._selectFileTab(this._fileTabs[fileTabIndex - 1].getFile());
    } else {
      this._deselectSidebarFilesCallback();
    }
  }
}