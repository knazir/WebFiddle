class ProjectHeader extends Component {
  constructor(containerElement, toggleLivePreviewCallback) {
    super(containerElement);

    this._toggleLivePreviewCallback = toggleLivePreviewCallback;
    this._livePreviewItem = containerElement.querySelector(".live-preview-header-item");
    this._livePreviewItem.addEventListener("click", this._outerToggleLivePreview.bind(this));
    this._livePreviewToggler = this._livePreviewItem.querySelector("#live-preview-toggle");
    this._livePreviewItem.addEventListener("click", this._toggleLivePreview.bind(this));
  }

  _outerToggleLivePreview(event) {
    event.stopPropagation();
    this._livePreviewToggler.checked = !this._livePreviewToggler.checked;
    this._toggleLivePreview();
  }

  _toggleLivePreview() {
    this._toggleLivePreviewCallback(this._livePreviewToggler.checked);
  }
}