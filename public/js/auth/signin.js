class SignIn extends Component {
  constructor(containerElement, showSignup, signinCallback) {
    super(containerElement);
    this._signinCallback = signinCallback;
    containerElement.querySelector("a").addEventListener("click", showSignup);
    containerElement.querySelector("form").addEventListener("submit", this._signin.bind(this));
  }

  _signin(event) {
    event.preventDefault();
    this._signinCallback(event);
  }
}