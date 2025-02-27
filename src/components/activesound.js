class ActiveSoundComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.sound = null;
    this.audio = new Audio();
    this.audio.addEventListener("ended", () => this.onAudioEnded());
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

  render() {
    if (!this.sound) return;

    this.shadowRoot.innerHTML = `
      <style>
        .active-sound-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 10px 0;
        }
        .sound-name {
          margin-bottom: 5px;
        }
        .play-button {
          cursor: pointer;
        }
      </style>
      <div class="active-sound-container">
        <span class="sound-name">${this.sound.name}</span>
        <button class="play-button">${
          this.audio.paused ? "Play" : "Pause"
        }</button>
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
