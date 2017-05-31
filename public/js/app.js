class App extends Component {
  constructor(containerElement) {
    super(containerElement);

    this.authBox = new AuthBox(document.querySelector("#auth-box"));
    this.projectList = new ProjectList(document.querySelector("#project-list"));
    this.projectView = new ProjectView(document.querySelector("#project-view"));
  }
}