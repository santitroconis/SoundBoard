import { getPlaylists, getSounds } from "../utils/storage.js";

class SoundListComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.playlist = null;
    this.sounds = getSounds();
  }

  connectedCallback() {
    this.render();
    window.addEventListener("playlist-selected", (event) => {
      this.playlist = event.detail;
      this.render();
    });
    window.addEventListener("playlist-deselected", () => {
      this.playlist = null;
      this.render();
    });
    window.addEventListener("sounds-updated", () => {
      this.sounds = getSounds();
      this.render();
    });
    window.addEventListener("playlists-updated", () => {
      this.render();
      if (this.playlist) {
        window.dispatchEvent(
          new CustomEvent("playlist-selected", { detail: this.playlist })
        );
      }
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .playlist-container {
      
        }
        #playlist-title {
          margin: 0;
        }
        #sounds-list {
          overflow-y: scroll;
          scrollbar-width: none;
        }
        .sound-item {
          margin: 20px 0;
        }
      </style>
      <div class="playlist-container">
        <h2 id="playlist-title">${
          this.playlist ? this.playlist.name : "All Sounds"
        }</h2>
        <div id="sounds-list">
          ${(this.playlist ? this.playlist.sounds : this.sounds)
            .map(
              (sound) => `
            <div class="sound-item">
              <sound-component sound='${JSON.stringify(sound)}' ${
                this.playlist ? `playlist='${this.playlist.name}'` : ""
              }></sound-component>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }
}

customElements.define("sound-list-component", SoundListComponent);
