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
import "./components/soundoptions.js";
import "./components/playlistoptions.js";
import "./components/currentoptions.js";
import "./components/addplaylist.js";

document.addEventListener("DOMContentLoaded", () => {
  // Datos predeterminados
  const defaultPlaylists = [
    {
      name: "Predefined 1",
      sounds: [
        { name: "Minecraft", url: "assets/predefined/minecraft.mp3" },
        { name: "Notification", url: "assets/predefined/notification.mp3" },
      ],
    },
    {
      name: "Predefined 2",
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
});
