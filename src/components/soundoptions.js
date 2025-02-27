import { getSounds, saveSounds, fileToBase64 } from "../utils/storage.js";

class SoundOptionsComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  async handleAddSound(event) {
    const file = event.target.files[0];
    if (file) {
      const base64 = await fileToBase64(file);
      const sounds = getSounds();
      sounds.push({ name: file.name, url: base64 });
      saveSounds(sounds);
      window.dispatchEvent(new CustomEvent("sounds-updated"));
      alert(`Sound "${file.name}" added.`);
    }
  }

  handleExportSounds() {
    const sounds = getSounds();
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(sounds));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "sounds.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .sound-options-container {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
        }
        .sound-options-button {
          cursor: pointer;
        }
      </style>
      <div class="sound-options-container">
        <input type="file" id="add-sound" style="display: none;" />
        <button class="sound-options-button" id="add-button">Add</button>
        <button class="sound-options-button" id="export-button">Export</button>
      </div>
    `;

    this.shadowRoot
      .querySelector("#add-button")
      .addEventListener("click", () => {
        this.shadowRoot.querySelector("#add-sound").click();
      });

    this.shadowRoot
      .querySelector("#add-sound")
      .addEventListener("change", (event) => {
        this.handleAddSound(event);
      });

    this.shadowRoot
      .querySelector("#export-button")
      .addEventListener("click", () => {
        this.handleExportSounds();
      });
  }
}

customElements.define("sound-options-component", SoundOptionsComponent);
