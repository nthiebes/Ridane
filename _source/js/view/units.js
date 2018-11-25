import config from '../config.js';
import Sprite from '../utils/sprite.js';
import Unit from '../model/Unit.js';

export default class Units { 
  constructor(data) {
    this.list = [];
    this.addUnits(data);
  }

  addUnits(data) {
    const keys = Object.keys(data.units);

    for (let i = 0; i < keys.length; i++) {
      const unit = data.units[keys[i]];

      this.list.push(new Unit(Object.assign({}, unit, {
        'id': i + 1,
        'pos': unit.pos,
        'primary': data.weapons[unit.weapons.primary],
        'secondary': data.weapons[unit.weapons.secondary],
        'range': data.weapons[unit.weapons.primary].range,
        'speed': this.getSpeed(data, unit) * 5,
        'skin': new Sprite({
          'url': `images/races/${unit.race}${unit.skin}.png`,
          'pos': [0, 256],
          'size': [128, 128],
          'speed': this.getSpeed(data, unit),
          'frames': [0]
        })
      }), config.debug));
    }
  }

  getSpeed(data, unit) {
    return data.races[unit.race].speed;
  }
}