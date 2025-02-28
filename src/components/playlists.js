import { getPlaylists } from "../utils/storage.js";

class PlaylistsComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.playlists = getPlaylists();
    this.activePlaylist = null;
    this.render();
  }

  connectedCallback() {
    window.addEventListener("playlists-updated", () => {
      this.playlists = getPlaylists();
      this.render();
    });
    window.addEventListener("playlist-selected", (event) => {
      this.activePlaylist = event.detail.name;
      this.render();
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
      .playlists-container {
        display: flex;
        font-size: 20px;        
        flex-direction: column;
        align-items: center;
      }
      .playlists-list {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      .playlist-item {
        cursor: pointer;
        margin: 5px 0;
        padding: 5px 80px;
        border-radius: 30px;
        background-color: #f0f0f0;

      }
      .playlist-item.active {
        background-color: #e0e0e0;
      }
      </style>
      <div class="playlists-container">
      <h2 class="playlists-title">Playlists</h2>
      <div id="playlists-list">
        ${this.playlists
          .map(
            (playlist) =>
              `<div class="playlist-item ${
                this.activePlaylist === playlist.name ? "active" : ""
              }" data-name="${playlist.name}">${playlist.name}</div>`
          )
          .join("")}
      </div>
      </div>
    `;

    this.shadowRoot.querySelectorAll(".playlist-item").forEach((item) => {
      item.addEventListener("click", (event) => this.selectPlaylist(event));
    });
  }

  selectPlaylist(event) {
    const playlistName = event.target.getAttribute("data-name");
    const playlist = this.playlists.find((pl) => pl.name === playlistName);

    if (this.activePlaylist === playlistName) {
      // Deseleccionar la playlist activa
      this.activePlaylist = null;
      this.shadowRoot.querySelectorAll(".playlist-item").forEach((item) => {
        item.classList.remove("active");
      });
      window.dispatchEvent(new CustomEvent("playlist-deselected"));
    } else {
      // Seleccionar una nueva playlist
      this.activePlaylist = playlistName;
      this.shadowRoot.querySelectorAll(".playlist-item").forEach((item) => {
        item.classList.remove("active");
      });
      event.target.classList.add("active");
      window.dispatchEvent(
        new CustomEvent("playlist-selected", { detail: playlist })
      );
    }
  }
}

customElements.define("playlists-component", PlaylistsComponent);
