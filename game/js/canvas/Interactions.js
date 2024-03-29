import config from '../config.js';
import Input from '../utils/Input.js';
import { Units } from '../units/units.js';
import { Animations } from '../animations/animations.js';
import { Items } from '../items/items.js';
import { getPath } from '../map/path.js';
import { socket } from '../utils/socket.js';

const body = document.getElementsByTagName('body')[0];

class Interactions {
  constructor(data) {
    this.wrapper = document.getElementById('canvas-wrapper');
    this.input = new Input();
    this.map = data.map;
    this.rowTileCount = data.rowTileCount;
    this.colTileCount = data.colTileCount;
    this.fieldWidth = data.fieldWidth;
    this.mapItems = data.mapItems;
    this.offsetX =
      Units.player.pos[0] * this.fieldWidth * -1 + window.innerWidth / 2;
    this.offsetY =
      Units.player.pos[1] * this.fieldWidth * -1 + window.innerHeight / 2;

    if (this.offsetX >= 0) {
      this.offsetX = 0;
    }

    if (this.offsetY >= 0) {
      this.offsetY = 0;
    }

    this.wrapper.style.transform = `translateX(${this.offsetX}px) translateY(${this.offsetY}px)`;
    this.registerEventHandler();
  }

  update(delta) {
    this.handleInput(delta);
  }

  registerEventHandler() {
    config.canvasTop1.addEventListener(
      'mousemove',
      this.onMouseMove.bind(this)
    );
    this.wrapper.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.wrapper.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.wrapper.addEventListener('contextmenu', this.onRightClick.bind(this));
  }

  onMouseMove(e) {
    const player = Units.player;

    if (player.dead) {
      return;
    }

    const x = Math.floor((e.pageX + this.offsetX * -1) / this.fieldWidth);
    const y = Math.floor((e.pageY + this.offsetY * -1) / this.fieldWidth);
    const item = Items.getItemByPos({ x, y });

    if (item && this.itemInRange({ x, y })) {
      body.classList.add('cursor--use');
      body.classList.remove('cursor--info');
    } else if (item && !this.itemInRange({ x, y })) {
      body.classList.add('cursor--info');
      body.classList.remove('cursor--use');
    } else {
      body.classList.remove('cursor--use');
      body.classList.remove('cursor--info');
    }

    // Left screen half
    if (
      e.pageX + this.offsetX * -1 < player.pos[0] * this.fieldWidth &&
      player.direction === 'RIGHT'
    ) {
      player.turn('LEFT');

      socket.emit('turn', {
        direction: 'LEFT'
      });

      // Continue animation
      if (player.moving) {
        player.walk();
      }
      // Right screen half
    } else if (
      e.pageX + this.offsetX * -1 >= player.pos[0] * this.fieldWidth &&
      player.direction === 'LEFT'
    ) {
      player.turn('RIGHT');

      socket.emit('turn', {
        direction: 'RIGHT'
      });

      // Continue animation
      if (player.moving) {
        player.walk();
      }
    }
  }

  onRightClick(e) {
    e.preventDefault();
  }

  onMouseDown(e) {
    const player = Units.player;

    if (player.dead) {
      return;
    }

    // Left click
    if (e.button === 0) {
      const x = Math.floor((e.pageX + this.offsetX * -1) / this.fieldWidth);
      const y = Math.floor((e.pageY + this.offsetY * -1) / this.fieldWidth);
      const item = Items.getItemByPos({ x, y });

      if (player.attacking) {
        // Continue animation
        player.skin.once = false;

        socket.emit('attack');
      } else if (item && this.itemInRange({ x, y })) {
        const animation = Animations.getAnimation({ x, y });

        if (animation) {
          animation.play();
        }
        player.equip(item);
        Items.removeItem(item);

        socket.emit('equip', { item });

        body.classList.add('cursor--use');
        body.classList.remove('cursor--info');
      } else {
        // Start animation
        player.attack();

        socket.emit('attack');
      }
    }
  }

  onMouseUp(e) {
    const player = Units.player;

    if (player.dead) {
      return;
    }

    // Left click
    if (e.button === 0) {
      // Finish after current animation
      if (player.attacking) {
        player.skin.once = true;

        socket.emit('player-stop-attack');
      }
    }
  }

  // eslint-disable-next-line
  handleInput(delta) {
    const input = this.input,
      down = input.isDown('S'),
      up = input.isDown('W'),
      right = input.isDown('D'),
      left = input.isDown('A'),
      player = Units.player,
      playerSpeed = player.speed,
      wrapper = this.wrapper;
    let valueX = this.offsetX,
      valueY = this.offsetY,
      blockedX = true,
      blockedY = true;

    if (player.attacking || player.dead) {
      return;
    }

    if (down) {
      valueY = this.offsetY - playerSpeed * this.fieldWidth * delta;

      const newPos = player.pos[1] + playerSpeed * delta,
        newY = Math.floor(newPos + 0.5),
        x = Math.floor(player.pos[0]),
        y = Math.floor(player.pos[1]),
        newTile = Math.floor(newPos) > y,
        mapPosition = this.map.map[newY] ? this.map.map[newY][x] : 2;

      if (
        mapPosition === 0 ||
        (typeof mapPosition === 'string' && mapPosition.includes('player'))
      ) {
        blockedY = false;
        player.pos[1] = this.getSmoothPixelValue(newPos);

        if (newTile) {
          this.map.updatePosition({
            x: x,
            y: y,
            newX: x,
            newY: Math.floor(newPos),
            unitId: player.id
          });
          this.setPath();

          socket.emit('move', {
            pos: [x, Math.floor(newPos)]
          });

          const mapItem = this.checkMap({ x, y: Math.floor(newPos) });

          if (mapItem) {
            this.loadMap(mapItem);
          }
        }
      }
    }

    if (up) {
      valueY = this.offsetY + playerSpeed * this.fieldWidth * delta;

      const newPos = player.pos[1] - playerSpeed * delta,
        newY = Math.floor(newPos - 0.5),
        x = Math.floor(player.pos[0]),
        y = Math.floor(player.pos[1]),
        newTile = Math.floor(newPos) < y,
        mapPosition = this.map.map[newY] ? this.map.map[newY][x] : 2;

      if (
        mapPosition === 0 ||
        (typeof mapPosition === 'string' && mapPosition.includes('player'))
      ) {
        blockedY = false;
        player.pos[1] = this.getSmoothPixelValue(newPos);

        if (newTile) {
          this.map.updatePosition({
            x: x,
            y: y,
            newX: x,
            newY: Math.floor(newPos),
            unitId: player.id
          });
          this.setPath();

          socket.emit('move', {
            pos: [x, Math.floor(newPos)]
          });

          const mapItem = this.checkMap({ x, y: Math.floor(newPos) });

          if (mapItem) {
            this.loadMap(mapItem);
          }
        }
      }
    }

    if (right) {
      valueX = this.offsetX - playerSpeed * this.fieldWidth * delta;

      const newPos = player.pos[0] + playerSpeed * delta,
        newX = Math.floor(newPos + 0.5),
        x = Math.floor(player.pos[0]),
        y = Math.floor(player.pos[1]),
        newTile = Math.floor(newPos) > x,
        mapPosition = this.map.map[y][newX];

      if (
        mapPosition === 0 ||
        (typeof mapPosition === 'string' && mapPosition.includes('player'))
      ) {
        blockedX = false;
        player.pos[0] = this.getSmoothPixelValue(newPos);

        if (newTile) {
          this.map.updatePosition({
            x: x,
            y: y,
            newX: Math.floor(newPos),
            newY: y,
            unitId: player.id
          });
          this.setPath();

          socket.emit('move', {
            pos: [Math.floor(newPos), y]
          });

          const mapItem = this.checkMap({ x: Math.floor(newPos), y });

          if (mapItem) {
            this.loadMap(mapItem);
          }
        }
      }
    }

    if (left) {
      valueX = this.offsetX + playerSpeed * this.fieldWidth * delta;

      const newPos = player.pos[0] - playerSpeed * delta,
        newX = Math.floor(newPos - 0.5),
        x = Math.floor(player.pos[0]),
        y = Math.floor(player.pos[1]),
        newTile = Math.floor(newPos) < x,
        mapPosition = this.map.map[y][newX];

      if (
        mapPosition === 0 ||
        (typeof mapPosition === 'string' && mapPosition.includes('player'))
      ) {
        blockedX = false;
        player.pos[0] = this.getSmoothPixelValue(newPos);

        if (newTile) {
          this.map.updatePosition({
            x: x,
            y: y,
            newX: Math.floor(newPos),
            newY: y,
            unitId: player.id
          });
          this.setPath();

          socket.emit('move', {
            pos: [Math.floor(newPos), y]
          });

          const mapItem = this.checkMap({ x: Math.floor(newPos), y });

          if (mapItem) {
            this.loadMap(mapItem);
          }
        }
      }
    }

    if (down || up || right || left) {
      const innerWidth = window.innerWidth;
      const innerHeight = window.innerHeight;
      const maxOffsetX = this.colTileCount * this.fieldWidth - innerWidth,
        maxOffsetY = this.rowTileCount * this.fieldWidth - innerHeight;

      // Horizontal map scrolling
      if (
        !blockedX && // player not blocked
        !(right && left) &&
        valueX < 0 &&
        valueX > maxOffsetX * -1 &&
        player.pos[0] * this.fieldWidth > innerWidth / 2 - playerSpeed && // + next line: player in center
        player.pos[0] * this.fieldWidth <
          this.colTileCount * this.fieldWidth - innerWidth / 2 + playerSpeed
      ) {
        this.offsetX = valueX;

        // Limit scrolling - end of the map
      } else if (
        valueX < 0 &&
        valueX <= maxOffsetX * -1 &&
        innerWidth < this.colTileCount * this.fieldWidth
      ) {
        this.offsetX = maxOffsetX * -1;

        // Limit scrolling - start of the map
      } else if (valueX > 0) {
        this.offsetX = 0;
      }

      // Vertical map scrolling
      if (
        !blockedY && // player not blocked
        !(up && down) &&
        valueY < 0 &&
        valueY > maxOffsetY * -1 &&
        player.pos[1] * this.fieldWidth > innerHeight / 2 - playerSpeed && // + next line: player in center
        player.pos[1] * this.fieldWidth <
          this.rowTileCount * this.fieldWidth - innerHeight / 2 + playerSpeed
      ) {
        this.offsetY = valueY;

        // Limit scrolling - end of the map
      } else if (
        valueY < 0 &&
        valueY <= maxOffsetY * -1 &&
        innerHeight < this.rowTileCount * this.fieldWidth
      ) {
        this.offsetY = maxOffsetY * -1;

        // Limit scrolling - start of the map
      } else if (valueY > 0) {
        this.offsetY = 0;
      }

      wrapper.style.transform = `translateX(${this.offsetX}px) translateY(${this.offsetY}px)`;

      if (!player.moving) {
        player.walk();
      }
    } else if (player.moving) {
      player.stop();
    }
  }

  getSmoothPixelValue(value) {
    const counts = [];

    for (let i = 0; i < this.fieldWidth; i++) {
      counts.push((1 / this.fieldWidth) * i);
    }

    const decimalSeparatedValues = value.toFixed(3).toString().split('.');
    const decimalPlaceValue = parseInt(decimalSeparatedValues[1], 10) / 1000;
    // eslint-disable-next-line no-confusing-arrow
    const closest = counts.reduce((prev, curr) =>
      Math.abs(curr - decimalPlaceValue) < Math.abs(prev - decimalPlaceValue)
        ? curr
        : prev
    );
    const newValue = Math.floor(value) + closest;

    return newValue;
  }

  checkMap({ x, y }) {
    return this.mapItems.find(
      (map) =>
        map.pos[0] === x && map.pos[1] === y && this.itemInRange({ x, y })
    );
  }

  itemInRange({ x, y }) {
    const playerX = Math.floor(Units.player.pos[0]);
    const playerY = Math.floor(Units.player.pos[1]);

    if (
      (x === playerX + 1 && y === playerY) ||
      (x === playerX + 1 && y === playerY + 1) ||
      (x === playerX + 1 && y === playerY - 1) ||
      (x === playerX - 1 && y === playerY) ||
      (x === playerX - 1 && y === playerY + 1) ||
      (x === playerX - 1 && y === playerY - 1) ||
      (x === playerX && y === playerY - 1) ||
      (x === playerX && y === playerY + 1) ||
      (x === playerX && y === playerY)
    ) {
      return true;
    }
    return false;
  }

  loadMap(mapItem) {
    console.log(mapItem);
  }

  // eslint-disable-next-line complexity
  setPath(unitId) {
    let i = Units.list.length;

    while (i--) {
      const enemy = Units.list[i];
      const player = Units.player;
      const playerInRange = enemy.isPlayerInSight(player.pos);

      if (
        !enemy.dead &&
        !enemy.id.includes('player') &&
        playerInRange &&
        (!unitId || enemy.id === unitId)
      ) {
        const playerPos1 = [
            Math.floor(player.pos[0] + 1),
            Math.floor(player.pos[1])
          ],
          playerPos2 = [
            Math.floor(player.pos[0] - 1),
            Math.floor(player.pos[1])
          ];
        let path1, path2;

        if (config.debug) {
          console.log('👹 🚶‍♂️');
        }

        path1 = getPath({
          world: this.map.map,
          pathStart: enemy.tile,
          pathEnd: playerPos1,
          unitId: enemy.id
        });
        path2 = getPath({
          world: this.map.map,
          pathStart: enemy.tile,
          pathEnd: playerPos2,
          unitId: enemy.id
        });

        // Chooose best path
        if (
          (path1.length <= path2.length && path1.length !== 0) ||
          path2.length === 0
        ) {
          enemy.path = path1;
        } else {
          enemy.path = path2;
        }

        // Check if next tile has not changed
        if (
          enemy.nextTile &&
          enemy.path.length > 1 &&
          (enemy.nextTile[0] !== enemy.path[1][0] ||
            enemy.nextTile[1] !== enemy.path[1][1])
        ) {
          path1 = [
            enemy.tile,
            ...getPath({
              world: this.map.map,
              pathStart: enemy.nextTile,
              pathEnd: playerPos1,
              unitId: enemy.id
            })
          ];
          path2 = [
            enemy.tile,
            ...getPath({
              world: this.map.map,
              pathStart: enemy.nextTile,
              pathEnd: playerPos2,
              unitId: enemy.id
            })
          ];

          if (
            (path1.length <= path2.length && path1.length !== 1) ||
            path2.length === 1
          ) {
            enemy.path = path1;
          } else {
            enemy.path = path2;
          }

          // Check for duplicate first tile
          if (
            enemy.path.length > 1 &&
            enemy.path[0][0] === enemy.path[1][0] &&
            enemy.path[0][1] === enemy.path[1][1]
          ) {
            enemy.path.splice(0, 1);
          }
        }

        enemy.target = player.id;

        socket.emit('ai-move', {
          path: enemy.path,
          id: enemy.id
        });
      }
    }
  }
}

export { Interactions };
