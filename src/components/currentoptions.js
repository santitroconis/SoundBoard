class CurrentOptionsComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.activePlaylist = null;
    this.render();
  }

  connectedCallback() {
    window.addEventListener("playlist-selected", (event) => {
      this.activePlaylist = event.detail;
      this.render();
    });
    window.addEventListener("playlist-deselected", () => {
      this.activePlaylist = null;
      this.render();
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .options-container {
          display: flex;
          justify-content: center;
          margin: 10px 0;
        }
      </style>
      <div class="options-container">
        ${
          this.activePlaylist
            ? `<playlist-options-component playlist='${JSON.stringify(
                this.activePlaylist
              )}'></playlist-options-component>`
            : "<sound-options-component></sound-options-component>"
        }
      </div>
    `;
  }
}

customElements.define("current-options-component", CurrentOptionsComponent);
