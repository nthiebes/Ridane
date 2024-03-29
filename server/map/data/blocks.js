const blocks = {
  tree0: {
    map: [
      [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      [
        [0, 0, 0],
        [0, 0, 0],
        [355, 356, 0]
      ],
      [
        [323, 324, 0],
        [339, 340, 0],
        [0, 0, 0]
      ],
      [
        [0, 0, 0],
        [0, 0, 0],
        [2, 2, 0]
      ]
    ]
  },
  tree1: {
    map: [
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [357, 358, 0, 0]
      ],
      [
        [309, 310, 0, 0],
        [325, 326, 0, 0],
        [341, 342, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 2, 0, 0]
      ]
    ]
  },
  tree2: {
    map: [
      [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      [
        [0, 0, 0],
        [0, 0, 0],
        [359, 360, 0]
      ],
      [
        [327, 328, 0],
        [343, 344, 0],
        [0, 0, 0]
      ],
      [
        [0, 0, 0],
        [0, 0, 0],
        [2, 2, 0]
      ]
    ]
  },
  tree3: {
    map: [
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [361, 362, 363, 364]
      ],
      [
        [0, 0, 0, 0],
        [329, 330, 331, 332],
        [345, 346, 347, 348],
        [0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 2, 2, 0]
      ]
    ]
  },
  tree4: {
    map: [
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [352, 353, 354, 0]
      ],
      [
        [304, 305, 306, 0],
        [320, 321, 322, 0],
        [336, 337, 338, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 2, 2, 0]
      ]
    ]
  },
  stump0: {
    map: [
      [
        [0, 0],
        [0, 0]
      ],
      [
        [0, 0],
        [758, 759]
      ],
      [
        [0, 0],
        [0, 0]
      ],
      [
        [0, 0],
        [1, 1]
      ]
    ]
  },
  stump1: {
    map: [
      [
        [0, 0],
        [0, 0]
      ],
      [
        [0, 0],
        [756, 757]
      ],
      [
        [0, 0],
        [0, 0]
      ],
      [
        [0, 0],
        [1, 1]
      ]
    ]
  },
  deadTree0: {
    map: [
      [
        [0, 0],
        [0, 0]
      ],
      [
        [0, 0],
        [992, 0]
      ],
      [
        [976, 0],
        [0, 0]
      ],
      [
        [0, 0],
        [1, 0]
      ]
    ]
  },
  deadTree1: {
    map: [
      [
        [0, 0],
        [0, 0]
      ],
      [
        [0, 0],
        [752, 753]
      ],
      [
        [736, 737],
        [0, 0]
      ],
      [
        [0, 0],
        [1, 1]
      ]
    ]
  },
  choppedTrees: {
    enemies: [{ pos: [7, 7], id: 'orc0' }],
    items: [{ pos: [1, 4], id: 'axe' }],
    animations: [{ pos: [1, 4], id: 'axe' }],
    map: [
      [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 361, 362, 363, 364, 962, 0, 0, 0, 0],
        [0, 0, 0, 0, 791, 790, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 709, 0, 0, 0, 352, 353, 354, 0],
        [0, 0, 0, 361, 362, 363, 364, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 352, 353, 354, 0, 0, 0, 0, 0, 0]
      ],
      [
        [0, 329, 330, 331, 332, 0, 0, 0, 0, 0],
        [0, 345, 346, 347, 348, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 304, 305, 306, 0],
        [0, 0, 0, 0, 0, 0, 320, 321, 322, 0],
        [0, 0, 0, 329, 330, 331, 336, 337, 338, 0],
        [0, 0, 0, 345, 346, 347, 348, 0, 0, 0],
        [0, 304, 305, 306, 0, 0, 0, 0, 0, 0],
        [0, 320, 321, 322, 0, 0, 0, 0, 0, 0],
        [0, 336, 337, 338, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 2, 2, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 2, 2, 2, 0],
        [0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 2, 2, 0, 0, 0, 0, 0, 0]
      ]
    ]
  },
  grasPatch0: {
    map: [
      [
        [0, 0, 0, 0],
        [0, 0, 257, 0],
        [0, 257, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 240, 241, 242],
        [240, 210, 0, 258],
        [256, 0, 227, 274],
        [272, 273, 274, 0]
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]
    ]
  }
};

exports.blocks = blocks;
