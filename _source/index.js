import Resources from './js/utils/resources.js';
import Canvas from './js/canvas/Canvas.js';

const gameData = {};
const resources = new Resources();
const resourcesList = [
  'images/tileset.png',
  'images/races/human0.png',
  'images/races/human1.png',
  'images/races/orc0.png',
  'images/races/orc1.png',
  'images/races/elf0.png'
];

const getGameData = () => {
  fetch('data/maps/0.json')
    .then(response => response.json()).then(json => {
      gameData.map = json.map;
      return fetch('data/weapons.json');
    })
    .then(response => response.json()).then(weapons => {
      gameData.weapons = weapons;
      return fetch('data/armor.json');
    })
    .then(response => response.json()).then(armor => {
      gameData.armor = armor;
      return fetch('data/races.json');
    })
    .then(response => response.json()).then(races => {
      gameData.races = races;
      return fetch('data/units.json');
    })
    .then(response => response.json()).then(units => {
      gameData.units = units;
      // eslint-disable-next-line
      const game = new Canvas({
        ...gameData,
        resources: resources
      });
    });
};

window.onload = () => {
  resources.load(resourcesList);

  resources.onReady(() => {
    getGameData();
  });
};