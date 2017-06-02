class ShareModal extends Modal {
  constructor(containerElement) {
    super(containerElement);

    this._URLField = containerElement.querySelector("#share-link");
    this._URLField.readOnly = true;

    this._clipboard = new Clipboard('#copy-share-link');
    this._copyLinkButton = containerElement.querySelector("#copy-share-link");
    this._copyLinkButton.addEventListener("click", this._copyLinkToClipboard.bind(this));
  }

  setURL(url) {
    this._URLField.value = url;
  }

  _copyLinkToClipboard() {
    this.setError("Copied link to clipboard.")
  }
}