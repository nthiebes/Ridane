import config from '../config.js';
import { GameData } from '../gameData.js';
import { Units } from '../units/units.js';

const healthBarHealth = document.getElementById('health-bar-health');
const healthBarNumber = document.getElementById('health-bar-number');
const inventoryhealthBar = document.getElementById('inventory-health-bar');
const inventoryhealthNumber = document.getElementById(
  'inventory-health-number'
);

export const getDefense = (defender) => {
  const defense =
    GameData.getWeapon(defender.weapons.secondary).defense +
    GameData.races[defender.race].defense;
  const headGearType = GameData.getArmor(defender.gear.head).material;
  const torsoGearType = GameData.getArmor(defender.gear.torso).material;
  const legGearType = GameData.getArmor(defender.gear.leg).material;
  const headDefense = GameData.armor.material[headGearType].defense;
  const torsoDefense = GameData.armor.material[torsoGearType].defense;
  const legDefense = GameData.armor.material[legGearType].defense;

  return defense + headDefense + torsoDefense + legDefense;
};

export const getStrength = (attacker) => {
  return (
    GameData.getWeapon(attacker.weapons.primary).damage +
    GameData.races[attacker.race].strength
  );
};

export const getDexterity = (unit) => {
  return GameData.races[unit.race].dexterity;
};

export const getIntelligence = (unit) => {
  return GameData.races[unit.race].intelligence;
};

const fight = (attacker, defender) => {
  const strength = getStrength(attacker);
  const defense = getDefense(defender);
  // const attackerDexterity = GameData.races[attacker.race].dexterity;
  // const defenderDexterity = GameData.races[defender.race].dexterity;
  const modifier = (strength - defense) * 7;
  const damage = 30 + modifier;
  const newHealth = defender.health - damage;

  // console.log('🤺', strength, ' vs ', defense);
  // console.log(attackerDexterity, ' vs ', defenderDexterity);

  defender.health = newHealth < 0 ? 0 : newHealth;

  if (defender.health <= 50) {
    defender.wound();
  }

  if (defender.health === 0) {
    defender.die();

    if (!attacker.friendly) {
      attacker.stop();
    }
  } else {
    defender.takeDamage();
  }

  if (defender.id === Units.player.id) {
    healthBarHealth.style.width = `${Math.floor(defender.health) / 10}%`;
    healthBarNumber.innerHTML = `${Math.floor(defender.health)} / 1000`;
    inventoryhealthBar.style.width = `${Math.floor(defender.health) / 10}%`;
    inventoryhealthNumber.innerHTML = `${Math.floor(defender.health)} / 1000`;
  }
};

export const combat = ({ units, map, attacker }) => {
  const player = units.player;

  // Check for hits
  units.list.forEach((unit) => {
    if (player.dead && attacker.id !== player.id) {
      attacker.stop();
    }

    if (
      unit.id !== attacker.id &&
      !unit.dead &&
      !(!attacker.friendly && !unit.friendly)
    ) {
      const playerPosX = Math.round(config.fieldWidth * attacker.pos[0]),
        enemyPosX = Math.round(config.fieldWidth * unit.pos[0]),
        playerPosY = Math.round(config.fieldWidth * attacker.pos[1]),
        enemyPosY = Math.round(config.fieldWidth * unit.pos[1]),
        playerWidth = 70,
        playerHeight = 70;

      // Consider unit height
      if (
        playerPosY > enemyPosY - playerHeight / 2 &&
        playerPosY < enemyPosY + playerHeight / 2
      ) {
        if (attacker.direction === 'LEFT') {
          const playerReach = playerPosX - playerWidth - attacker.range * 20;

          if (playerReach <= enemyPosX && playerPosX > enemyPosX) {
            fight(attacker, unit);
          }
        }
        if (attacker.direction === 'RIGHT') {
          const playerReach = playerPosX + playerWidth + attacker.range * 20;

          if (playerReach >= enemyPosX && playerPosX < enemyPosX) {
            fight(attacker, unit);
          }
        }
      }
    }
  });

  // Clear blocked field for dead units
  units.list.forEach((unit) => {
    if (unit.dead && unit.id !== player.id) {
      const x = Math.floor(unit.pos[0]);
      const y = Math.floor(unit.pos[1]);

      map.resetPosition({ x, y });
    } else if (unit.dead) {
      console.log('player dead');
    }
  });
};

export const getWalkSpeed = ({ race, gear }) => {
  const headGearType = (GameData.getArmor(gear.head) || { type: 'none' })
    .material;
  const torsoGearType = GameData.getArmor(gear.torso).material;
  const legGearType = GameData.getArmor(gear.leg).material;
  const headSpeedModifier = GameData.armor.material[headGearType].speedModifier;
  const torsoSpeedModifier =
    GameData.armor.material[torsoGearType].speedModifier;
  const legSpeedModifier = GameData.armor.material[legGearType].speedModifier;
  const speedModifier =
    1 - headSpeedModifier - torsoSpeedModifier - legSpeedModifier;

  return Math.round(GameData.races[race].speed * speedModifier * 100) / 100;
};

export const getAttackSpeed = (primary) => {
  return GameData.getWeapon(primary).speed;
};
