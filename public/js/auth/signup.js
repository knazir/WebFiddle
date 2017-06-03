class SignUp extends Component {
  constructor(containerElement, showSignin, signinCallback) {
    super(containerElement);
    this._signinCallback = signinCallback;
    containerElement.querySelector("a").addEventListener("click", showSignin);
    containerElement.querySelector("form").addEventListener("submit", this._signup.bind(this));
  }

  _signup(event) {
    event.preventDefault();
    const username = event.target[0].value;
    const password = event.target[1].value;
    const confirmPassword = event.target[2].value;
    const email = event.target[3].value;
    Api.signup(username, password, confirmPassword, email, (response) => {
      this._signinCallback(username, password);
    });
  }
}