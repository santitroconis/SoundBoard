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
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .playlist-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .sound-item {
          margin: 5px 0;
        }
      </style>
      <div class="playlist-container">
        <h2>${this.playlist ? this.playlist.name : "All Sounds"}</h2>
        <ul id="sounds-list">
          ${(this.playlist ? this.playlist.sounds : this.sounds)
            .map(
              (sound) => `
            <li class="sound-item">
              <sound-component sound='${JSON.stringify(sound)}' ${
                this.playlist ? `playlist='${this.playlist.name}'` : ""
              }></sound-component>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `;
  }
}

customElements.define("sound-list-component", SoundListComponent);
