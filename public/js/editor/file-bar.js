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
    this._containerElement.innerHTML = "";
  }

  setFile(file) {
    let fileTab = this._fileTabs.filter(fileTab => fileTab.getFile().id === file.id)[0];

    if (!fileTab) {
      const fileTabElement = FileTab.createDomNode();
      fileTab = new FileTab(fileTabElement, file, () => this._selectFileTab(file), () => this.closeFileTab(file));
      this._fileTabs.push(fileTab);
      this._containerElement.appendChild(fileTab.getContainerElement());
    }

    this._selectFileTab(file);
  }

  closeFileTab(file) {
    const fileTab = this._fileTabs.filter(fileTab => fileTab.getFile().id === file.id)[0];
    if (!fileTab) return;

    this._containerElement.removeChild(fileTab.getContainerElement());
    const fileTabIndex = this._fileTabs.indexOf(fileTab);
    this._fileTabs.splice(fileTabIndex, 1);

    // If deleting tab that's not selected, don't change current selection
    if (!fileTab.isSelected()) return;

    if (this._fileTabs[fileTabIndex]) {
      this._selectFileTab(this._fileTabs[fileTabIndex].getFile());
    } else if (this._fileTabs[fileTabIndex - 1]) {
      this._selectFileTab(this._fileTabs[fileTabIndex - 1].getFile());
    } else {
      this._deselectSidebarFilesCallback();
    }
  }

  _selectFileTab(file) {
    this._selectFileEditorFileCallback(file, false);
    this._selectSidebarFileCallback(file);
    this._fileTabs.forEach(fileTab => fileTab.deselect());
    this._fileTabs.filter(fileTab => fileTab.getFile().id === file.id)[0].select();
  }
}