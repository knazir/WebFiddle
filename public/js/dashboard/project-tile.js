class ProjectTile extends Component {
  constructor(containerElement, project, selectProjectCallback) {
    super(containerElement);
    this._project = project;
    this._selectProjectCallback = selectProjectCallback;
    this._fillTile();
  }

  _fillTile() {
    this._containerElement.querySelector("h3").textContent = this._project.name;
    this._containerElement.addEventListener("click", () => this._selectProjectCallback(this._project));
  }

  /* Creates the following DOM element:
   *   <div class="project-tile">
   *     <img class="project-icon" src="images/project_folder.png" />
   *     <h3></h3>
   *   </div>
   */
  static createDomNode() {
    const element = document.createElement("div");
    element.classList.add("project-tile");

    const icon = document.createElement("img");
    icon.classList.add("project-icon");
    icon.src = "images/project_folder.png";
    element.appendChild(icon);

    const title = document.createElement("h3");
    element.appendChild(title);

    return element;
  }
}