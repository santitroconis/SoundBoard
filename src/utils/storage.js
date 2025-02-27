const PLAYLISTS_KEY = "playlists";
const SOUNDS_KEY = "sounds";

export const savePlaylists = (playlists) => {
  localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
};

export const getPlaylists = () => {
  const playlists = localStorage.getItem(PLAYLISTS_KEY);
  return playlists ? JSON.parse(playlists) : [];
};

export const deletePlaylists = () => {
  localStorage.removeItem(PLAYLISTS_KEY);
};

export const saveSounds = (sounds) => {
  localStorage.setItem(SOUNDS_KEY, JSON.stringify(sounds));
};

export const getSounds = () => {
  const sounds = localStorage.getItem(SOUNDS_KEY);
  return sounds ? JSON.parse(sounds) : [];
};

export const deleteSounds = () => {
  localStorage.removeItem(SOUNDS_KEY);
};

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
