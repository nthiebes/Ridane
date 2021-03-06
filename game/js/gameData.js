export class GameData {
  static setWeapons(data) {
    this.weaponsData = data;
  }

  static setArmor(data) {
    this.armorData = data;
  }

  static setRaces(data) {
    this.racesData = data;
  }

  static setEnemies(data) {
    this.enemiesData = data;
  }

  static setAnimations(data) {
    this.animationsData = data;
  }

  static get weapons() {
    return this.weaponsData;
  }

  static get armor() {
    return this.armorData;
  }

  static get races() {
    return this.racesData;
  }

  static get enemies() {
    return this.enemiesData;
  }

  static get animations() {
    return this.animationsData;
  }

  static getAnimation(id) {
    return this.animationsData.list.find((animation) => animation.id === id);
  }

  static getWeapon(id) {
    return this.weaponsData.list.find((weapon) => weapon.id === id);
  }

  static getArmor(id) {
    return this.armorData.list.find((armor) => armor.id === id);
  }
}
