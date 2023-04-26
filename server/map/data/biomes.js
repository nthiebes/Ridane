const biomes = {
  plain: {
    ground: 32,
    grass: [672, 673, 674, 688, 533],
    bushes: [689, 690, 724, 691],
    blocks: [
      {
        id: 'tree0',
        amount: 5
      },
      {
        id: 'tree1',
        amount: 5
      },
      {
        id: 'tree2',
        amount: 5
      }
    ]
  },
  forest: {
    ground: 32,
    grass: [
      672,
      673,
      674,
      688,
      533,
      373,
      453,
      389,
      437,
      454,
      438,
      439,
      455,
      469,
      470,
      471,
      485,
      486,
      487
    ],
    grassAmount: 100,
    bushes: [689, 690, 724, 691, 706, 707, 772, 773, 995],
    bushesAmount: 50,
    blocks: [
      {
        id: 'tree0',
        amount: 50
      },
      {
        id: 'tree1',
        amount: 75
      },
      {
        id: 'tree2',
        amount: 100
      },
      {
        id: 'stump0',
        amount: 5
      },
      {
        id: 'stump1',
        amount: 5
      }
    ]
  },
  swamp: {},
  desert: {},
  mountains: {},
  savannah: {},
  cave: {}
};

exports.biomes = biomes;
