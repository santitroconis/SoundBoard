import { getPlaylists, savePlaylists, getSounds } from "../utils/storage.js";

class PlaylistOptionsComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.playlist = null;
  }

  static get observedAttributes() {
    return ["playlist"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "playlist") {
      this.playlist = JSON.parse(newValue);
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  handleAddSound() {
    const sounds = getSounds();
    const soundName = prompt("Enter the name of the sound to add:");
    const sound = sounds.find((s) => s.name === soundName);
    if (sound && this.playlist) {
      const playlists = getPlaylists();
      const playlist = playlists.find((pl) => pl.name === this.playlist.name);
      if (playlist) {
        playlist.sounds.push(sound);
        savePlaylists(playlists);
        alert(
          `Sound "${soundName}" added to playlist "${this.playlist.name}".`
        );
      }
    } else {
      alert("Sound not found or no active playlist.");
    }
  }

  handleExportPlaylist() {
    if (this.playlist) {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(this.playlist));
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `${this.playlist.name}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } else {
      alert("No active playlist to export.");
    }
  }

  handleDeletePlaylist() {
    if (this.playlist) {
      let playlists = getPlaylists();
      playlists = playlists.filter((pl) => pl.name !== this.playlist.name);
      savePlaylists(playlists);
      this.playlist = null;
      window.dispatchEvent(new CustomEvent("playlist-deselected"));
      window.dispatchEvent(new CustomEvent("playlists-updated"));
      window.dispatchEvent(new CustomEvent("sounds-updated"));
      this.render();
    } else {
      alert("No active playlist to delete.");
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .playlist-options-container {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
        }
        .playlist-options-button {
          cursor: pointer;
        }
      </style>
      <div class="playlist-options-container">
        <button class="playlist-options-button" id="add-button">Add</button>
        <button class="playlist-options-button" id="export-button">Export</button>
        <button class="playlist-options-button" id="delete-button">Delete</button>
      </div>
    `;

    this.shadowRoot
      .querySelector("#add-button")
      .addEventListener("click", () => this.handleAddSound());
    this.shadowRoot
      .querySelector("#export-button")
      .addEventListener("click", () => this.handleExportPlaylist());
    this.shadowRoot
      .querySelector("#delete-button")
      .addEventListener("click", () => this.handleDeletePlaylist());
  }
}

customElements.define("playlist-options-component", PlaylistOptionsComponent);
