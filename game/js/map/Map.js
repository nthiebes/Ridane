import { drawSquare } from '../canvas/utils.js';
import { getCircle, uniq, bline } from './utils.js';
import config from '../config.js';

class Map {
  constructor({ map, units }) {
    this.map = map;

    // Initial unit positions
    for (let i = 0; i < units.length; i++) {
      this.map[Math.floor(units[i].pos[1])][Math.floor(units[i].pos[0])] =
        units[i].id;
    }
  }

  updateMap({ map, enemies }) {
    this.map = map;

    for (let i = 0; i < enemies.length; i++) {
      this.map[Math.floor(enemies[i].pos[1])][Math.floor(enemies[i].pos[0])] =
        enemies[i].id;
    }
  }

  updatePosition({ x, y, newX, newY, unitId }) {
    // Delete old position
    this.map[y][x] = 0;

    // Add new position
    this.map[newY][newX] = unitId;
  }

  resetPosition({ x, y }) {
    this.map[y][x] = 0;
  }

  getFieldsInSight(pos, direction, range = config.visibility) {
    const posX = Math.floor(pos[0]);
    const posY = Math.floor(pos[1]);
    const newFields = [];
    let visibleFields = [];
    let fieldsInSight = [];

    // Collect circle tiles for each range
    for (let l = 1; l <= range; l++) {
      fieldsInSight = fieldsInSight.concat(getCircle(posX, posY, l));
    }

    // Fill gaps
    for (let i = 0; i < fieldsInSight.length; i++) {
      const y = fieldsInSight[i][0],
        x = fieldsInSight[i][1];

      if (x > posY) {
        newFields.push([y, x - 1]);
      }

      if (x < posY) {
        newFields.push([y, x + 1]);
      }
    }

    // Remove tiles that are out of the map
    fieldsInSight = fieldsInSight.filter(
      (field) => field[0] >= 0 && field[1] >= 0
    );

    // Merge the new array
    fieldsInSight = fieldsInSight.concat(newFields);

    // Remove duplicates
    fieldsInSight = uniq(fieldsInSight);

    // Remove fields that are out of the viewport
    for (let j = 0; j < fieldsInSight.length; j++) {
      visibleFields = visibleFields.concat(
        bline(posX, posY, fieldsInSight[j][0], fieldsInSight[j][1], this.map)
      );
    }

    // Remove duplicates
    visibleFields = uniq(visibleFields);

    // Remove all fields behind unit
    visibleFields = visibleFields.filter((field) => {
      if (direction === 'RIGHT' && field[0] < pos[0]) {
        return false;
      }
      if (direction === 'LEFT' && field[0] > pos[0]) {
        return false;
      }
      return true;
    });

    return visibleFields;
  }

  // eslint-disable-next-line complexity
  showDebugFields({ unit, ctx }) {
    const x = Math.floor(unit.pos[0]),
      y = Math.floor(unit.pos[1]),
      path = unit.path,
      fieldsInSight = unit.fieldsInSight;
    let i = path.length;
    let j = fieldsInSight.length;

    if (!unit.friendly) {
      while (i--) {
        drawSquare({
          ctx: ctx,
          color: 'rgba(0,255,0,0.5)',
          width: config.fieldWidth,
          height: config.fieldWidth,
          x: path[i][0] * config.fieldWidth,
          y: path[i][1] * config.fieldWidth
        });
      }
    }

    if (!unit.friendly) {
      while (j--) {
        drawSquare({
          ctx: ctx,
          color: 'rgba(255,0,0,0.2)',
          width: config.fieldWidth,
          height: config.fieldWidth,
          x: fieldsInSight[j][0] * config.fieldWidth,
          y: fieldsInSight[j][1] * config.fieldWidth
        });
      }
    }

    for (let r = 0; r < this.map.length; r++) {
      for (let c = 0; c < this.map[0].length; c++) {
        if (this.map[r][c] === 2) {
          drawSquare({
            ctx: ctx,
            color: 'rgba(0,0,0,0.2)',
            width: config.fieldWidth,
            height: config.fieldWidth,
            x: c * config.fieldWidth,
            y: r * config.fieldWidth
          });
        }
        if (this.map[r][c] === 1) {
          drawSquare({
            ctx: ctx,
            color: 'rgba(255,255,255,0.2)',
            width: config.fieldWidth,
            height: config.fieldWidth,
            x: c * config.fieldWidth,
            y: r * config.fieldWidth
          });
        }

        if (
          r === 0 ||
          r === this.map.length - 1 ||
          c === 0 ||
          c === this.map.length - 1 ||
          r === config.chunkSize - 1 ||
          r === config.chunkSize * 2 - 1 ||
          r === config.chunkSize ||
          r === config.chunkSize * 2 ||
          c === config.chunkSize - 1 ||
          c === config.chunkSize * 2 - 1 ||
          c === config.chunkSize ||
          c === config.chunkSize * 2
        ) {
          drawSquare({
            ctx: ctx,
            color: 'rgba(0,255,255,0.2)',
            width: config.fieldWidth,
            height: config.fieldWidth,
            x: c * config.fieldWidth,
            y: r * config.fieldWidth
          });
        }
      }
    }

    drawSquare({
      ctx: ctx,
      color: 'rgba(0,0,255,0.5)',
      width: config.fieldWidth,
      height: config.fieldWidth,
      x: x * config.fieldWidth,
      y: y * config.fieldWidth
    });
  }
}

export { Map };
