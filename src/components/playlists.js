import { getPlaylists } from "../utils/storage.js";

class PlaylistsComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.playlists = getPlaylists();
    this.activePlaylist = null;
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .playlists-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .playlist-item {
          margin: 5px 0;
          cursor: pointer;
        }
        .playlist-item.active {
          font-weight: bold;
        }
      </style>
      <div class="playlists-container">
        <h2>Playlists</h2>
        <ul id="playlists-list">
          ${this.playlists
            .map(
              (playlist) =>
                `<li class="playlist-item" data-name="${playlist.name}">${playlist.name}</li>`
            )
            .join("")}
        </ul>
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
      const soundList = document.querySelector("sound-list-component");
      if (soundList) {
        soundList.removeAttribute("playlist");
      }
    } else {
      // Seleccionar una nueva playlist
      this.activePlaylist = playlistName;
      this.shadowRoot.querySelectorAll(".playlist-item").forEach((item) => {
        item.classList.remove("active");
      });
      event.target.classList.add("active");
      const soundList = document.querySelector("sound-list-component");
      if (soundList) {
        soundList.setAttribute("playlist", JSON.stringify(playlist));
      }
    }
  }
}

customElements.define("playlists-component", PlaylistsComponent);
