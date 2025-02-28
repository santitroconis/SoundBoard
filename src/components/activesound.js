class ActiveSoundComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.sound = null;
    this.audio = new Audio();
    this.audio.addEventListener("ended", () => this.onAudioEnded());
    this.audio.addEventListener("timeupdate", () => this.saveCurrentState());
  }

  static get observedAttributes() {
    return ["sound"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "sound") {
      this.sound = JSON.parse(newValue);
      this.updateAudio();
      this.render();
    }
  }

  connectedCallback() {
    this.loadLastState();
    this.render();
  }

  updateAudio() {
    if (this.sound) {
      this.audio.src = this.sound.url;
      this.audio.play();
    }
  }

  togglePlay() {
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
    this.render();
  }

  onAudioEnded() {
    this.render();
  }

  saveCurrentState() {
    const state = {
      sound: this.sound,
      currentTime: this.audio.currentTime,
    };
    localStorage.setItem("activeSoundState", JSON.stringify(state));
  }

  loadLastState() {
    const state = JSON.parse(localStorage.getItem("activeSoundState"));
    if (state) {
      this.sound = state.sound;
      this.audio.src = this.sound.url;
      this.audio.currentTime = state.currentTime;
      this.render();
    }
  }

  render() {
    if (!this.sound) return;

    this.shadowRoot.innerHTML = `
      <style>
      .active-sound-container {
        display: flex;
        width: 400px;
        padding: 10px;
        border-radius: 20px;
        background-color: #ffffff;
        justify-content: space-between;
      }
      .sound-name {
        color: #353535;
        font-weight: bold;
      }
      .play-button {
        cursor: pointer;
        background: none;
        border: none;
        outline: none;
      }
      .play-button svg {
        width: 10px;
        height: 10px;
      }
      </style>
      <div class="active-sound-container">
      <span class="sound-name">${this.sound.name}</span>
      <button class="play-button">
        ${
          this.audio.paused
            ? `<svg viewBox="0 0 24 24" fill="#353535"><path d="M8 5v14l11-7z"/></svg>`
            : `<svg viewBox="0 0 24 24" fill="#353535"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
        }
      </button>
      </div>
    `;

    this.shadowRoot
      .querySelector(".play-button")
      .addEventListener("click", () => {
        this.togglePlay();
      });
  }
}

customElements.define("active-sound-component", ActiveSoundComponent);
