import {
  getPlaylists,
  savePlaylists,
  getSounds,
  saveSounds,
} from "../utils/storage.js";

class SoundComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.sound = null;
    this.playlist = null;
  }

  static get observedAttributes() {
    return ["sound", "playlist"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "sound") {
      this.sound = JSON.parse(newValue);
    } else if (name === "playlist") {
      this.playlist = newValue;
    }
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.sound) return;

    this.shadowRoot.innerHTML = `
      <style>
        .sound-container {
          display: flex;
          width: 400px;
          justify-content: space-between;
          align-items: center;
        }
        .sound-name {
          flex-grow: 1;
          cursor: pointer;
        }
        .delete-button {
          margin-left: 10px;
          cursor: pointer;
        }
      </style>
      <div class="sound-container">
        <span class="sound-name">${this.sound.name}</span>
        <button class="delete-button">Delete</button>
      </div>
    `;

    this.shadowRoot
      .querySelector(".sound-name")
      .addEventListener("click", () => this.playSound());
    this.shadowRoot
      .querySelector(".delete-button")
      .addEventListener("click", () => this.deleteSound());
  }

  playSound() {
    const activeSound = document.querySelector("active-sound-component");
    if (activeSound) {
      activeSound.setAttribute("sound", JSON.stringify(this.sound));
    }
  }

  deleteSound() {
    if (this.playlist) {
      // Eliminar el sonido de la playlist
      let playlists = getPlaylists();
      let playlist = playlists.find((pl) => pl.name === this.playlist);
      if (playlist) {
        playlist.sounds = playlist.sounds.filter(
          (s) => s.name !== this.sound.name
        );
        savePlaylists(playlists);
      }
    } else {
      // Eliminar el sonido de localStorage
      let sounds = getSounds();
      sounds = sounds.filter((s) => s.name !== this.sound.name);
      saveSounds(sounds);
    }

    // Eliminar el elemento del DOM
    this.remove();
  }
}

customElements.define("sound-component", SoundComponent);
