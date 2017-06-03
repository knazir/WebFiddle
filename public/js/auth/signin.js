class SignIn extends Component {
  constructor(containerElement, showSignup, signinCallback) {
    super(containerElement);
    this._signinCallback = signinCallback;
    containerElement.querySelector("a").addEventListener("click", showSignup);
    containerElement.querySelector("form").addEventListener("submit", this._signin.bind(this));
  }

  _signin(event) {
    event.preventDefault();
    const username = event.target[0].value;
    const password = event.target[1].value;
    this._signinCallback(username, password);
  }
}