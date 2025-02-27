import {
  savePlaylists,
  saveSounds,
  getPlaylists,
  getSounds,
} from "./utils/storage.js";
import "./components/playlists.js";
import "./components/sound.js";
import "./components/soundlist.js";
import "./components/activesound.js";

document.addEventListener("DOMContentLoaded", () => {
  // Datos predeterminados
  const defaultPlaylists = [
    {
      name: "Playlist 1",
      sounds: [
        { name: "Minecraft", url: "assets/predefined/minecraft.mp3" },
        { name: "Notification", url: "assets/predefined/notification.mp3" },
      ],
    },
    {
      name: "Playlist 2",
      sounds: [
        { name: "Oh hell naw", url: "assets/predefined/oh-hell-naw.mp3" },
        { name: "Rizzing", url: "assets/predefined/rizzing.mp3" },
      ],
    },
  ];

  const defaultSounds = [
    { name: "Minecraft", url: "assets/predefined/minecraft.mp3" },
    { name: "Notification", url: "assets/predefined/notification.mp3" },
    { name: "Oh hell naw", url: "assets/predefined/oh-hell-naw.mp3" },
    { name: "Rizzing", url: "assets/predefined/rizzing.mp3" },
    { name: "Windows Shutdown", url: "assets/predefined/w-shutdown.mp3" },
  ];

  // Guardar datos predeterminados en localStorage si no existen
  if (!localStorage.getItem("playlists")) {
    savePlaylists(defaultPlaylists);
  }

  if (!localStorage.getItem("sounds")) {
    saveSounds(defaultSounds);
  }

  // Crear e inicializar el componente playlists
  const playlists = document.createElement("playlists-component");
  document.body.appendChild(playlists);

  // Crear e inicializar el componente soundList para mostrar todos los sonidos
  const soundList = document.createElement("sound-list-component");
  document.body.appendChild(soundList);

  // Crear e inicializar el componente activesound
  const activeSound = document.createElement("active-sound-component");
  document.body.appendChild(activeSound);
});
