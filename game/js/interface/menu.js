import '../../../node_modules/socket.io-client/dist/socket.io.min.js';

import Canvas from '../canvas/Canvas.js';
import { GameData } from '../gameData.js';
import { socket } from '../utils/socket.js';
import { getRandomInt } from '../utils/number.js';

const mapField = document.getElementById('map');
const nameField = document.getElementById('name');
const menuNew = document.getElementById('menu-new');
const menuJoin = document.getElementById('menu-join');
const menuWindow = document.getElementById('menu');
const newWindow = document.getElementById('new');
const nextRaceBtn = document.getElementById('race-next');
const prevRaceBtn = document.getElementById('race-prev');
const characterWindow = document.getElementById('character');
const raceImg = document.getElementById('race-img');
const raceAttributes = document.getElementById('race-attributes');
const raceName = document.getElementById('race-name');
const attributesMap = {
  strength: {
    good: 'Muskelbepackt',
    bad: 'Schwächlich',
    average: 3
  },
  dexterity: {
    good: 'Geschickt',
    bad: 'Tollpatschig',
    average: 3
  },
  intelligence: {
    good: 'Clever',
    bad: 'Einfach gestrickt',
    average: 3
  },
  defense: {
    good: 'Robust',
    bad: 'Zerbrechlich',
    average: 3
  },
  speed: {
    good: 'Rasant',
    bad: 'Träge',
    average: 4
  }
};

export class Menu {
  static start = (resources) => {
    Menu.resources = resources;
    Menu.playerId = null;
    Menu.races = Object.entries(GameData.races);
    Menu.currentRace = 0;

    menuNew.addEventListener('click', Menu.selectMap);
    menuJoin.addEventListener('click', Menu.showCharacterEditor);
    newWindow.addEventListener('submit', Menu.createGame);

    // Connect player
    socket.emit('id', ({ playerId, gameId }) => {
      Menu.playerId = playerId;

      if (gameId) {
        menuJoin.removeAttribute('disabled');
      } else {
        menuNew.removeAttribute('disabled');
      }
    });

    // Server disconnects
    socket.on('disconnect', () => {
      window.location.reload();
    });
  };

  static selectMap() {
    menuWindow.classList.remove('window--show');
    newWindow.classList.add('window--show');
  }

  static createGame = (event) => {
    event.preventDefault();

    socket.emit('new-game', {
      mapId: mapField.value
    });

    newWindow.classList.add('window--show');

    Menu.showCharacterEditor();
  };

  static showCharacterEditor() {
    Menu.setRaceAttributes(Menu.races[0]);

    nextRaceBtn.addEventListener('click', Menu.handleNextRace);
    prevRaceBtn.addEventListener('click', Menu.handlePrevRace);
    characterWindow.addEventListener('submit', Menu.joinGame);

    newWindow.classList.remove('window--show');
    characterWindow.classList.add('window--show');
  }

  static handleNextRace = () => {
    raceImg.classList.remove(`race__img--${Menu.races[Menu.currentRace][0]}0`);

    if (!Menu.races[Menu.currentRace + 1]) {
      Menu.currentRace = -1;
    }

    const race = Menu.races[Menu.currentRace + 1];

    Menu.setRaceAttributes(race);
    raceImg.classList.add(`race__img--${race[0]}0`);
    Menu.currentRace++;
  };

  static handlePrevRace = () => {
    raceImg.classList.remove(`race__img--${Menu.races[Menu.currentRace][0]}0`);

    if (!Menu.races[Menu.currentRace - 1]) {
      Menu.currentRace = Menu.races.length;
    }

    const race = Menu.races[Menu.currentRace - 1];

    Menu.setRaceAttributes(race);
    raceImg.classList.add(`race__img--${race[0]}0`);
    Menu.currentRace--;
  };

  static setRaceAttributes = (race) => {
    const attributes = Object.entries(race[1]).filter(
      (attribute) => attribute[0] !== 'skins'
    );

    raceAttributes.innerHTML = '';
    raceName.innerHTML = race[0];

    attributes.forEach((attribute) => {
      const li = document.createElement('li');
      const attributeValue = attribute[1];
      const attributeData = attributesMap[attribute[0]];

      if (attributeValue > attributeData.average) {
        li.classList.add('attribute--good');
        li.append(attributeData.good);
        raceAttributes.append(li);
      }
    });

    attributes.forEach((attribute) => {
      const li = document.createElement('li');
      const attributeValue = attribute[1];
      const attributeData = attributesMap[attribute[0]];

      if (attributeValue < attributeData.average) {
        li.classList.add('attribute--bad');
        li.append(attributeData.bad);
        raceAttributes.append(li);
      }
    });
  };

  static joinGame = (event) => {
    event.preventDefault();

    const race = Menu.races[Menu.currentRace][0];
    const skinCount = GameData.races[race].skins;
    const skin = getRandomInt(skinCount - 1);
    const player = {
      id: Menu.playerId,
      friendly: true,
      name: nameField.value,
      direction: 'RIGHT',
      race,
      skin,
      health: 1000,
      gear: {
        head: 'none',
        torso: 'none',
        leg: 'none'
      },
      weapons: {
        primary: 'fist',
        secondary: 'fist'
      }
    };

    socket.emit(
      'join-game',
      {
        player
      },
      ({
        mapData,
        items,
        players,
        enemies,
        mapTransitions,
        animations,
        chunks
      }) => {
        // eslint-disable-next-line
        const game = new Canvas({
          map: mapData,
          items,
          players,
          enemies,
          mapItems: mapTransitions,
          animations,
          resources: Menu.resources,
          player: {
            ...player,
            pos: players.find(({ id }) => Menu.playerId === id).pos
          },
          chunks
        });

        menuWindow.classList.remove('window--show');
        characterWindow.classList.remove('window--show');
      }
    );
  };
}

//   static loadMap = () => {
//     fetch(`/game/data/maps/${Menu.mapId}.json`)
//       .then((response) => response.json())
//       .then((json) => {
//         const gameData = {
//           map: json.map,
//           items: json.items || [],
//           players: json.players || [],
//           enemies: json.enemies || [],
//           mapItems: json.maps || [],
//           animations: json.animations || []
//         };
//       });
//   };
