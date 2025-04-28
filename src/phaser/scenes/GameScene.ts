import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  constructor() {
    // Scene key
    super('GameScene');
  }

  preload(): void {
    // Load assets here if needed in the future
    // this.load.image('logo', 'path/to/logo.png');
  }

  create(): void {
    // Add a simple text object to the center of the screen
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;

    this.add
      .text(screenCenterX, screenCenterY, 'Hello World!', {
        font: '48px Arial',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    console.log('GameScene created!');
  }

  update(_time: number, _delta: number): void {
    // Game loop logic goes here in the future
  }
}
