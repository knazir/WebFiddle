class AuthBox extends Component {
  constructor(containerElement, forceSigninCallback, signinCallback) {
    super(containerElement);

    this._user = null;
    this._forceSigninCallback = forceSigninCallback;
    this._signinCallback = signinCallback;
  }

  async getLoggedIn() {
    globalLoader.show();
    await Api.initializeAuth();
    await this._setupLoginLogout();
    await this._updateSignedIn();
    globalLoader.hide();
  }

  async _updateSignedIn() {
    const result = await Api.getSignedInUser();
    if (result.loggedIn) {
      this._signinCallback(result);
    } else {
      this._forceSigninCallback();
    }
  }

  async _setupLoginLogout() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.isSignedIn.listen(this._onLoginChanged.bind(this));

    const loginButton = document.querySelector('#login');
    auth2.attachClickHandler(loginButton);

    const logoutButton = document.querySelector('#logout');
    logoutButton.addEventListener('click', this._onLogout.bind(this));
  }

  async _onLoginChanged(isLoggedIn) {
    if (isLoggedIn) {
      const user = await Api.getSignedInUser();
      user ? this._signinCallback(user) : this._forceSigninCallback();
    } else {
      this._forceSigninCallback();
    }
  }

  _onLogout() {
    gapi.auth2.getAuthInstance().signOut();
    this._forceSigninCallback();
  }
}