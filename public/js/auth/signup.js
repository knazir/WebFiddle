class SignUp extends Component {
  constructor(containerElement, showSignin, signinCallback) {
    super(containerElement);
    this._signinCallback = signinCallback;
    containerElement.querySelector("a").addEventListener("click", showSignin);
    containerElement.querySelector("form").addEventListener("submit", this._signup.bind(this));
  }

  _signup(event) {
    event.preventDefault();
    this._signinCallback(event);
  }
}