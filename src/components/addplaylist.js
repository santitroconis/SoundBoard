import { getPlaylists, savePlaylists } from "../utils/storage.js";

class AddPlaylistComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  handleAddPlaylist() {
    const input = this.shadowRoot.querySelector("#playlist-name");
    const playlistName = input.value.trim();
    if (playlistName) {
      let playlists = getPlaylists();
      if (playlists.some((pl) => pl.name === playlistName)) {
        alert("Playlist already exists.");
      } else {
        playlists.push({ name: playlistName, sounds: [] });
        savePlaylists(playlists);
        input.value = "";
        window.dispatchEvent(new CustomEvent("playlists-updated"));
        alert(`Playlist "${playlistName}" added.`);
      }
    } else {
      alert("Please enter a playlist name.");
    }
  }

  async handleImportPlaylist(event) {
    const file = event.target.files[0];
    if (file) {
      const text = await file.text();
      try {
        const importedPlaylist = JSON.parse(text);
        let playlists = getPlaylists();
        if (playlists.some((pl) => pl.name === importedPlaylist.name)) {
          alert("Playlist already exists.");
        } else {
          playlists.push(importedPlaylist);
          savePlaylists(playlists);
          window.dispatchEvent(new CustomEvent("playlists-updated"));
          alert(`Playlist "${importedPlaylist.name}" imported.`);
        }
      } catch (error) {
        alert("Invalid playlist file.");
      }
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .add-playlist-container {
          display: flex;
          align-items: center;
          margin: 10px 0;
        }
        .add-playlist-input {
        }
        .add-playlist-button {
          cursor: pointer;
        }
      </style>
      <div class="add-playlist-container">
        <input type="text" id="playlist-name" class="add-playlist-input" placeholder="Playlist name" />
        <button class="add-playlist-button" id="add-button">Add</button>
        <input type="file" id="import-playlist" style="display: none;" />
        <button class="add-playlist-button" id="import-button">Import</button>
      </div>
    `;

    this.shadowRoot
      .querySelector("#add-button")
      .addEventListener("click", () => this.handleAddPlaylist());
    this.shadowRoot
      .querySelector("#import-button")
      .addEventListener("click", () => {
        this.shadowRoot.querySelector("#import-playlist").click();
      });
    this.shadowRoot
      .querySelector("#import-playlist")
      .addEventListener("change", (event) => this.handleImportPlaylist(event));
  }
}

customElements.define("add-playlist-component", AddPlaylistComponent);
