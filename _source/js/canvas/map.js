import utils from './utils';

export default class Map {
    constructor(map) {
        this.map = map;
    }

    showDebugFields(config) {
        const x = Math.floor(config.unit.pos[0]),
            y = Math.floor(config.unit.pos[1]);

        utils.drawSquare({
            'ctx': config.ctx,
            'color': 'rgba(0,0,255,0.5)',
            'width': 32,
            'height': 32,
            'x': x * 32,
            'y': y * 32
        });
        utils.drawSquare({
            'ctx': config.ctx,
            'color': 'rgba(255,0,0,0.5)',
            'width': 32,
            'height': 32,
            'x': (x + 2) * 32,
            'y': y * 32
        });
        utils.drawSquare({
            'ctx': config.ctx,
            'color': 'rgba(255,0,0,0.5)',
            'width': 32,
            'height': 32,
            'x': (x - 2) * 32,
            'y': y * 32
        });
    }
}
