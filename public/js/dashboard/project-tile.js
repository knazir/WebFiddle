class ProjectTile extends Component {
  constructor(containerElement, project, selectProjectCallback, openDeleteModalCallback, deleteProjectCallback) {
    super(containerElement);
    this._project = project;
    this._selectProjectCallback = selectProjectCallback;
    this._openDeleteModalCallback = openDeleteModalCallback;
    this._deleteProjectCallback = deleteProjectCallback;
    this._deleteButton = new Component(containerElement.querySelector(".project-delete-button"));
    this._deleteButton.getContainerElement().addEventListener("click", this._deleteProject.bind(this));

    containerElement.addEventListener("mouseenter", () => this._deleteButton.show());
    containerElement.addEventListener("mouseleave", () => this._deleteButton.hide());

    this._fillTile();
  }

  getProject() {
    return this._project;
  }

  _deleteProject(event) {
    event.stopPropagation();
    this._openDeleteModalCallback(this._project.name);
  }

  _fillTile() {
    this._containerElement.querySelector("h3").textContent = this._project.name;
    this._containerElement.addEventListener("click", () => this._selectProjectCallback(this._project));
  }

  /* Creates the following DOM element:
   * <div class="project-tile">
   *  <div class="project-delete-button">
   *    <img src="images/delete.png" class="positioned-delete-button hidden">
   *  </div>
   *  <div class="project-tile-content">
   *   <img class="project-icon" src="images/project_folder.png">
   *   <h3></h3>
   *  </div>
   * </div>
   */
  static createDomNode() {
    const element = document.createElement("div");
    element.classList.add("project-tile");

    const deleteButtonContainer = document.createElement("div");
    deleteButtonContainer.classList.add("project-delete-button");
    deleteButtonContainer.classList.add("hidden");

    const deleteButton = document.createElement("img");
    deleteButton.src = "images/delete.png";
    deleteButton.classList.add("positioned-delete-button");
    deleteButton.innerHTML = "&times";
    deleteButtonContainer.appendChild(deleteButton);
    element.appendChild(deleteButtonContainer);

    const content = document.createElement("div");
    content.classList.add("project-tile-content");

    const icon = document.createElement("img");
    icon.classList.add("project-icon");
    icon.src = "images/project_folder.png";
    content.appendChild(icon);

    const title = document.createElement("h3");
    content.appendChild(title);

    element.appendChild(content);

    return element;
  }
}