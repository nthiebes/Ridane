import config from '../config.js';
import { getSpeed } from './helpers.js';

export default class Unit {
  constructor(data) {
    this.direction = 'RIGHT';
    this.moving = false;
    this.attacking = false;
    this.path = [];
    this.steps = Math.floor((config.fieldWidth / data.speed) * 2);
    this.currentStep = Math.floor((config.fieldWidth / data.speed) * 2);

    for (const i in data) {
      if (data.hasOwnProperty(i)) {
        this[i] = data[i];
      }
    }
  }

  walk() {
    if (config.debug && this.friendly) {
      console.log('👣');
    }

    switch (this.direction) {
      case 'LEFT':
        this.skin.pos = [0, 128];
        this.head.pos = [0, 128];
        this.leg.pos = [0, 128];
        this.torso.pos = [0, 128];
        this.primary.pos = [0, 128];
        this.secondary.pos = [0, 128];
        break;

      default:
        this.skin.pos = [0, 0];
        this.head.pos = [0, 0];
        this.leg.pos = [0, 0];
        this.torso.pos = [0, 0];
        this.primary.pos = [0, 0];
        this.secondary.pos = [0, 0];
    }

    this.skin.frames = [0, 1, 2, 3];
    this.head.frames = [0, 1, 2, 3];
    this.leg.frames = [0, 1, 2, 3];
    this.torso.frames = [0, 1, 2, 3];
    this.primary.frames = [0, 1, 2, 3];
    this.secondary.frames = [0, 1, 2, 3];
    this.moving = true;
  }

  attack() {
    if (config.debug && this.friendly) {
      console.log('⚔️');
    }

    switch (this.direction) {
      case 'LEFT':
        this.skin.pos = [0, 384];
        this.head.pos = [0, 384];
        this.leg.pos = [0, 384];
        this.torso.pos = [0, 384];
        this.primary.pos = [0, 384];
        this.secondary.pos = [0, 384];
        break;

      default:
        this.skin.pos = [0, 256];
        this.head.pos = [0, 256];
        this.leg.pos = [0, 256];
        this.torso.pos = [0, 256];
        this.primary.pos = [0, 256];
        this.secondary.pos = [0, 256];
    }

    this.skin.frames = [0, 1, 2];
    this.skin.index = 0;
    this.head.frames = [0, 1, 2];
    this.head.index = 0;
    this.leg.frames = [0, 1, 2];
    this.leg.index = 0;
    this.torso.frames = [0, 1, 2];
    this.torso.index = 0;
    this.primary.frames = [0, 1, 2];
    this.primary.index = 0;
    this.secondary.frames = [0, 1, 2];
    this.secondary.index = 0;
    this.moving = false;
    this.attacking = true;
  }

  stop() {
    if (config.debug && this.friendly) {
      console.log('✋');
    }

    this.moving = false;
    this.attacking = false;
    this.skin.once = false;
    this.skin.done = false;
    // this.head.once = false;
    // this.head.done = false;
    // this.leg.once = false;
    // this.leg.done = false;
    // this.torso.once = false;
    // this.torso.done = false;
    this.turn(this.direction);
    this.skin.frames = [0];
    this.head.frames = [0];
    this.leg.frames = [0];
    this.torso.frames = [0];
    this.primary.frames = [0];
    this.secondary.frames = [0];
  }

  turn(direction) {
    if (config.debug && this.friendly) {
      console.log(direction === 'LEFT' ? '👈' : '👉');
    }

    switch (direction.toUpperCase()) {
      case 'LEFT':
        this.skin.pos = [0, 384];
        this.head.pos = [0, 384];
        this.leg.pos = [0, 384];
        this.torso.pos = [0, 384];
        this.primary.pos = [0, 384];
        this.secondary.pos = [0, 384];
        this.direction = 'LEFT';
        break;

      default:
        this.skin.pos = [0, 256];
        this.head.pos = [0, 256];
        this.leg.pos = [0, 256];
        this.torso.pos = [0, 256];
        this.primary.pos = [0, 256];
        this.secondary.pos = [0, 256];
        this.direction = 'RIGHT';
    }
  }

  equip({ gear, weapon, id }) {
    if (config.debug) {
      console.log('🛡');
    }

    if (gear) {
      this.gear[gear] = id;
      this[gear].url = `images/armor/${id}.png`;

      const newSpeed = getSpeed({ race: this.race, gear: this.gear });

      this.speed = newSpeed;
      this.skin.speed = newSpeed;
      this.head.speed = newSpeed;
      this.leg.speed = newSpeed;
      this.torso.speed = newSpeed;
      this.primary.speed = newSpeed;
      this.secondary.speed = newSpeed;
    }

    if (weapon) {
      this.weapons[weapon] = id;

      this[weapon].url = `images/weapons/${id}.png`;
    }
  }
}