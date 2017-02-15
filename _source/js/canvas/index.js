import Input from '../utils/input';
import Units from '../units';
import Map from './map';
import utils from './utils';

export default class Canvas {
    constructor(config) {
        this.debug = true;
        this.wrapper = document.getElementById('canvas-wrapper');
        this.canvasGround1 = document.getElementById('canvas-ground1');
        this.canvasGround2 = document.getElementById('canvas-ground2');
        this.canvasAnim = document.getElementById('canvas-anim');
        this.canvasTop1 = document.getElementById('canvas-top1');
        this.ctxGround1 = this.canvasGround1.getContext('2d');
        this.ctxGround2 = this.canvasGround2.getContext('2d');
        this.ctxAnim = this.canvasAnim.getContext('2d');
        this.ctxTop1 = this.canvasTop1.getContext('2d');
        this.ground1 = config.map[0];
        this.ground2 = config.map[1];
        this.top1 = config.map[2];
        this.blockedArr = config.map[3];
        this.rowTileCount = this.ground1.length;
        this.colTileCount = this.ground1[0].length;
        this.fieldWidth = 32;
        this.resources = config.resources;
        this.input = new Input();
        this.tileset = this.resources.get('/images/tileset.png');
        this.lastTime = Date.now();
        this.gameTime = 0;
        this.playerSpeed = 4;
        this.units = new Units(config);
        this.unitsList = this.units.list;
        this.offsetX = 0;
        this.offsetY = 0;
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;
        this.map = new Map(this.blockedArr);

        this.prepareCanvas();
        this.registerEventHandler();

        this.main();
    }

    prepareCanvas() {
        const canvas = document.querySelectorAll('canvas');

        for (let i = 0; i < canvas.length; i++) {
            canvas[i].width = this.colTileCount * this.fieldWidth;
            canvas[i].height = this.rowTileCount * this.fieldWidth;
        }

        utils.drawImage({
            'rowTileCount': this.rowTileCount,
            'colTileCount': this.colTileCount,
            'tileset': this.tileset,
            'ctx': this.ctxGround1,
            'array': this.ground1
        });
        utils.drawImage({
            'rowTileCount': this.rowTileCount,
            'colTileCount': this.colTileCount,
            'tileset': this.tileset,
            'ctx': this.ctxGround2,
            'array': this.ground2
        });
        utils.drawImage({
            'rowTileCount': this.rowTileCount,
            'colTileCount': this.colTileCount,
            'tileset': this.tileset,
            'ctx': this.ctxTop1,
            'array': this.top1
        });
        if (this.debug) {
            for (let r = 0; r < this.blockedArr.length; r++) {
                for (let c = 0; c < this.blockedArr[0].length; c++) {
                    if (this.blockedArr[r][c] === 2) {
                        utils.drawSquare({
                            'ctx': this.ctxTop1,
                            'color': 'rgba(0,0,0,0.5)',
                            'width': this.fieldWidth,
                            'height': this.fieldWidth,
                            'x': c * this.fieldWidth,
                            'y': r * this.fieldWidth
                        });
                    }
                }
            }
        }
    }

    registerEventHandler() {
        this.canvasTop1.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.wrapper.addEventListener('contextmenu', this.onRightClick.bind(this));
    }

    main() {
        const now = Date.now(),
            delta = (now - this.lastTime) / 1000.0;

        this.update(delta);
        this.render();

        this.lastTime = now;

        window.requestAnimFrame(this.main.bind(this));
    }


    update(delta) {
        this.gameTime += delta;

        this.handleInput(delta);
        this.updateEntities(delta);
    }

    updateEntities(delta) {
        let unit;

        for (let i = 0; i < this.unitsList.length; i++) {
            unit = this.unitsList[i];
            unit.skin.update(delta);
        }
    }

    render() {
        // Clear canvas hack
        this.canvasAnim.width = this.canvasAnim.width;
        this.renderEntities(this.unitsList);
    }

    renderEntities(list) {
        for (let i = 0; i < list.length; i++) {
            this.renderEntity(list[i], list[i].skin);
        }
    }

    renderEntity(unit, ...args) {
        this.ctxAnim.save();

        if (this.debug) {
            this.map.showDebugFields({
                'ctx': this.ctxAnim,
                'unit': unit
            });
        }

        this.ctxAnim.translate(
            (unit.pos[0] * this.fieldWidth) - 64,
            (unit.pos[1] * this.fieldWidth) - 110
        );

        for (let i = 0; i < args.length; i++) {
            // Skin
            args[i].render(this.ctxAnim, this.resources);
        }

        this.ctxAnim.restore();
    }

    handleInput(delta) {
        const input = this.input,
            down = input.isDown('S'),
            up = input.isDown('W'),
            right = input.isDown('D'),
            left = input.isDown('A'),
            player = this.unitsList[0],
            playerSpeed = this.playerSpeed,
            wrapper = this.wrapper;
        let valueX = this.offsetX,
            valueY = this.offsetY,
            blockedX = true,
            blockedY = true;

        if (down) {
            valueY = this.offsetY - ((playerSpeed * this.fieldWidth) * delta);

            const newPos = player.pos[1] + (playerSpeed * delta),
                newY = Math.floor(newPos),
                x = Math.floor(player.pos[0]),
                y = Math.floor(player.pos[1]),
                newTile = newY > y;

            if (this.blockedArr[newY][x] <= 1) {
                blockedY = false;
                player.pos[1] = newPos;

                if (newTile) {
                    this.map.updatePosition({
                        'id': player.id,
                        'x': x,
                        'y': y,
                        'newX': x,
                        'newY': newY
                    });
                }
            }
        }

        if (up) {
            valueY = this.offsetY + ((playerSpeed * this.fieldWidth) * delta);

            const newPos = player.pos[1] - (playerSpeed * delta),
                newY = Math.floor(newPos),
                x = Math.floor(player.pos[0]),
                y = Math.floor(player.pos[1]),
                newTile = newY < Math.floor(player.pos[1]);

            if (this.blockedArr[newY][x] <= 1) {
                blockedY = false;
                player.pos[1] = newPos;

                if (newTile) {
                    this.map.updatePosition({
                        'id': player.id,
                        'x': x,
                        'y': y,
                        'newX': x,
                        'newY': newY
                    });
                }
            }
        }

        if (right) {
            valueX = this.offsetX - ((playerSpeed * this.fieldWidth) * delta);
            
            const newPos = player.pos[0] + (playerSpeed * delta),
                newX = Math.floor(newPos),
                x = Math.floor(player.pos[0]),
                y = Math.floor(player.pos[1]),
                newTile = newX > Math.floor(player.pos[0]);

            if (this.blockedArr[y][newX] <= 1) {
                blockedX = false;
                player.pos[0] = newPos;

                if (newTile) {
                    this.map.updatePosition({
                        'id': player.id,
                        'x': x,
                        'y': y,
                        'newX': newX,
                        'newY': y
                    });
                }
            }
        }

        if (left) {
            valueX = this.offsetX + ((playerSpeed * this.fieldWidth) * delta);

            const newPos = player.pos[0] - (playerSpeed * delta),
                newX = Math.floor(newPos),
                x = Math.floor(player.pos[0]),
                y = Math.floor(player.pos[1]),
                newTile = newX < Math.floor(player.pos[0]);

            if (this.blockedArr[y][newX] <= 1) {
                blockedX = false;
                player.pos[0] = newPos;

                if (newTile) {
                    this.map.updatePosition({
                        'id': player.id,
                        'x': x,
                        'y': y,
                        'newX': newX,
                        'newY': y
                    });
                }
            }
        }

        if (down || up || right || left) {
            const maxOffsetX = (this.colTileCount * this.fieldWidth) - this.innerWidth,
                maxOffsetY = (this.rowTileCount * this.fieldWidth) - this.innerHeight;

            // Horizontal map scrolling
            if (!blockedX && // player not blocked
                !(right && left) && 
                valueX < 0 && 
                valueX > maxOffsetX * -1 && 
                player.pos[0] * this.fieldWidth > (this.innerWidth / 2) - playerSpeed && // + next line: player in center
                player.pos[0] * this.fieldWidth < (this.colTileCount * this.fieldWidth) - (this.innerWidth / 2) + playerSpeed) {

                this.offsetX = valueX;

            // Limit scrolling - end of the map
            } else if (valueX < 0 && valueX <= maxOffsetX * -1) {
                this.offsetX = maxOffsetX * -1;

            // Limit scrolling - start of the map
            } else if (valueX > 0) {
                this.offsetX = 0;
            }

            // Vertical map scrolling
            if (!blockedY && // player not blocked
                !(up && down) && 
                valueY < 0 && 
                valueY > maxOffsetY * -1 && 
                player.pos[1] * this.fieldWidth > (this.innerHeight / 2) - playerSpeed && // + next line: player in center
                player.pos[1] * this.fieldWidth < (this.rowTileCount * this.fieldWidth) - (this.innerHeight / 2) + playerSpeed) {

                this.offsetY = valueY;

            // Limit scrolling - end of the map
            } else if (valueY < 0 && valueY <= maxOffsetY * -1) {
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

    onMouseMove(e) {
        const player = this.unitsList[0];

        if (e.pageX + (this.offsetX * -1) < player.pos[0] * this.fieldWidth && player.direction === 'RIGHT') {
            player.turn('LEFT');

            if (player.moving) {
                player.walk();
            }
        } else if (e.pageX + (this.offsetX * -1) >= player.pos[0] * this.fieldWidth && player.direction === 'LEFT') {
            player.turn('RIGHT');

            if (player.moving) {
                player.walk();
            }
        } 
    }

    onRightClick(e) {
        e.preventDefault();
    }
}
