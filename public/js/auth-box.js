class AuthBox extends Component {
  constructor(containerElement) {
    super(containerElement);

    this.signin = new SignIn(document.querySelector("#signin"));
    this.signup = new SignUp(document.querySelector("#signup"));
  }
}