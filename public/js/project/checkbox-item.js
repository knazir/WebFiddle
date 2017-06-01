class CheckboxItem extends Component {
  constructor(containerElement, toggleCallback) {
    super(containerElement);

    this._toggleCallback = toggleCallback;
    this._containerElement.addEventListener("click", this._outerToggle.bind(this));
    this._checkbox = containerElement.querySelector("input");
    this._checkbox.addEventListener("click", this._toggleCheckbox.bind(this));
  }

  _outerToggle(event) {
    event.stopPropagation();
    this._checkbox.checked = !this._checkbox.checked;
    this._toggleCheckbox(event);
  }

  _toggleCheckbox(event) {
    event.stopPropagation();
    this._toggleCallback(this._checkbox.checked);
  }
}