import { Howl } from 'howler';

class SoundManager {
  private sounds: { [key: string]: Howl } = {};

  constructor() {
    // Initialize sounds
    this.sounds.cashRegister = new Howl({
      src: ['/sounds/cash-register.mp3'],
      volume: 0.5,
    });

    this.sounds.paperShuffle = new Howl({
      src: ['/sounds/paper-shuffle.mp3'],
      volume: 0.3,
    });

    this.sounds.victory = new Howl({
      src: ['/sounds/victory.mp3'],
      volume: 0.4,
    });

    this.sounds.defeat = new Howl({
      src: ['/sounds/defeat.mp3'],
      volume: 0.4,
    });

    this.sounds.buttonClick = new Howl({
      src: ['/sounds/button-click.mp3'],
      volume: 0.2,
    });
  }

  play(soundName: string) {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.play();
    }
  }

  setVolume(soundName: string, volume: number) {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.volume(volume);
    }
  }

  setGlobalVolume(volume: number) {
    Object.values(this.sounds).forEach(sound => {
      sound.volume(volume);
    });
  }
}

export const soundManager = new SoundManager();