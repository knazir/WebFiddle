class GlobalLoader extends Component {
  constructor(containerElement) {
    super(containerElement);

    this._globalHeader = new Component(document.querySelector("#global-header"));
  }

  show() {
    this._globalHeader.show();
    super.show();
  }

  hide() {
    this._globalHeader.hide();
    super.hide();
  }
}