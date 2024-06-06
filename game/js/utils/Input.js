import { Inventory } from '../interface/inventory.js';

export class Input {
  constructor() {
    this.pressedKeys = {};

    document.addEventListener('keydown', (e) => {
      this.setKey(e, true);

      if (e.key.toLocaleLowerCase() === 'i') {
        Inventory.toggleInventory();
      }
    });

    document.addEventListener('keyup', (e) => {
      this.setKey(e, false);
    });

    window.addEventListener('blur', () => {
      this.pressedKeys = {};
    });
  }

  setKey(event, status) {
    const code = event.keyCode;
    let key;

    switch (code) {
      case 32:
        key = 'SPACE';
        break;
      case 37:
        key = 'LEFT';
        break;
      case 38:
        key = 'UP';
        break;
      case 39:
        key = 'RIGHT';
        break;
      case 40:
        key = 'DOWN';
        break;
      default:
        // Convert ASCII codes to letters
        key = String.fromCharCode(code);
    }

    this.pressedKeys[key] = status;
  }

  isDown(key) {
    return this.pressedKeys[key.toUpperCase()];
  }
}
