import Resources from './js/utils/Resources.js';
import { Menu } from './js/interface/menu.js';
import { GameData } from './js/gameData.js';

const resources = new Resources();
const resourcesList = [
  'images/tileset.png',
  'images/animations.png',
  'images/races/dwarf0.png',
  'images/races/human0.png',
  'images/races/human1.png',
  'images/races/human2.png',
  'images/races/human3.png',
  'images/races/human4.png',
  'images/races/human5.png',
  'images/races/human6.png',
  'images/races/orc0.png',
  'images/races/orc1.png',
  'images/races/orc2.png',
  'images/races/orc3.png',
  'images/races/elf0.png',
  'images/races/ghost0.png',
  'images/races/vampire0.png',
  'images/races/wounded.png',
  'images/armor/none.png',
  'images/armor/head_iron_0.png',
  'images/armor/head_iron_1.png',
  'images/armor/head_cloth_0.png',
  'images/armor/head_steel_0.png',
  'images/armor/hair_0_black.png',
  'images/armor/hair_0_brown.png',
  'images/armor/hair_0_blonde.png',
  'images/armor/hair_1_black.png',
  'images/armor/hair_1_brown.png',
  'images/armor/hair_1_blonde.png',
  'images/armor/hair_2_black.png',
  'images/armor/hair_2_brown.png',
  'images/armor/hair_2_blonde.png',
  'images/armor/hair_3_black.png',
  'images/armor/hair_3_brown.png',
  'images/armor/hair_3_blonde.png',
  'images/armor/leg_iron_0.png',
  'images/armor/leg_cloth_0.png',
  'images/armor/leg_leather_0.png',
  'images/armor/torso_iron_0.png',
  'images/armor/torso_cloth_0.png',
  'images/armor/torso_leather_0.png',
  'images/weapons/fist.png',
  'images/weapons/sword.png',
  'images/weapons/axe.png',
  'images/weapons/spear.png',
  'images/weapons/halberd.png',
  'images/weapons/shield.png',
  'images/weapons/shortbow.png'
];
const getGameData = () => {
  fetch('data/weapons.json')
    .then((response) => response.json())
    .then((weapons) => {
      GameData.setWeapons(weapons);

      return fetch('data/armor.json');
    })
    .then((response) => response.json())
    .then((armor) => {
      GameData.setArmor(armor);

      return fetch('data/enemies.json');
    })
    .then((response) => response.json())
    .then((enemies) => {
      GameData.setEnemies(enemies);
      return fetch('data/animations.json');
    })
    .then((response) => response.json())
    .then((animations) => {
      GameData.setAnimations(animations);

      return fetch('data/races.json');
    })
    .then((response) => response.json())
    .then((races) => {
      GameData.setRaces(races);

      Menu.start(resources);
    });
};

window.onload = () => {
  resources.load(resourcesList);

  resources.onReady(() => {
    getGameData();
  });
};
