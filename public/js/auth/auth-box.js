class AuthBox extends Component {
  constructor(containerElement, signinCallback) {
    super(containerElement);
    this._signin = new SignIn(document.querySelector("#signin"), this._showSignup.bind(this), signinCallback);
    this._signup = new SignUp(document.querySelector("#signup"), this._showSignin.bind(this), signinCallback);
  }

  _showSignin() {
    this._signup.hide();
    this._signin.show();
  }

  _showSignup() {
    this._signin.hide();
    this._signup.show();
  }
}