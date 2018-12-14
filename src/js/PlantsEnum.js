// File for encoding the plant information
const PlantsEnum = {
  VINE_MAPLE: {
    label: 'vine maple',
    r: 92,
    h: 3,
    maxNumber: 1,
    sprite: [0, 0],
    foliageColor: 'green',
    foliageShape: 'spiky',
    foliageSize: 'md',
    shade: [1, 2],
    moisture: [0, 1]
  },
  SALAL: {
    label: 'salal',
    r: 30,
    h: 2,
    maxNumber: 7,
    sprite: [0, 0],
    foliageColor: 'green',
    foliageShape: 'ovate',
    foliageSize: 'md',
    shade: [0, 2],
    moisture: [0, 1]
  },
  TALL_OREGON_GRAPE: {
    label: 'tall Oregon grape',
    r: 50,
    h: 2,
    maxNumber: 4,
    sprite: [0, 0],
    foliageColor: 'darkGreen',
    foliageShape: 'spiky',
    foliageSize: 'md',
    shade: [1, 3],
    moisture: [0, 2]
  },
  BALD_HIP_ROSE: {
    label: 'bald hip rose',
    r: 40,
    h: 2,
    maxNumber: 4,
    sprite: [0, 0],
    foliageColor: 'green',
    foliageShape: 'ovate',
    foliageSize: 'sm',
    shade: [1, 3],
    moisture: [0, 2]
  },
  RED_ELDERBERRY: {
    label: 'red elderberry',
    r: 70,
    h: 2,
    maxNumber: 2,
    sprite: [0, 0],
    foliageColor: 'green',
    foliageShape: 'spear',
    foliageSize: 'md',
    shade: [1, 3],
    moisture: [0, 2]
  },
  EVERGREEN_HUCKLEBERRY: {
    label: 'evergreen huckleberry',
    r: 40,
    h: 2,
    maxNumber: 6,
    sprite: [0, 0],
    foliageColor: 'darkGreen',
    foliageShape: 'ovate',
    foliageSize: 'sm',
    shade: [0, 2],
    moisture: [0, 1]
  },
  BEACH_STRAWBERRY: {
    label: 'beach strawberry',
    r: 25,
    h: 0,
    maxNumber: 6,
    sprite: [0, 0],
    foliageColor: 'darkGreen',
    foliageShape: 'ovate',
    foliageSize: 'sm',
    shade: [1, 3],
    moisture: [2, 2]
  },
  SWORD_FERN: {
    label: 'sword fern',
    r: 35,
    h: 1,
    maxNumber: 6,
    sprite: [0, 0],
    foliageColor: 'darkGreen',
    foliageShape: 'spiky',
    foliageSize: 'lg',
    shade: [0, 1],
    moisture: [0, 1]
  },
  FRINGECUP: {
    label: 'fringecup',
    r: 26,
    h: 1,
    maxNumber: 6,
    sprite: [0, 0],
    foliageColor: 'green',
    foliageShape: 'ovate',
    foliageSize: 'md',
    shade: [1, 3],
    moisture: [1, 1]
  },
  INSIDE_OUT_FLOWER: {
    label: 'inside-out flower',
    r: 26,
    h: 0,
    maxNumber: 6,
    sprite: [0, 0],
    foliageColor: 'green',
    foliageShape: 'ovate',
    foliageSize: 'md',
    shade: [0, 1],
    moisture: [0, 1]
  },
};

Object.keys(PlantsEnum).forEach(key => {
  // Scale the plants for the app
  PlantsEnum[key].r = PlantsEnum[key].r / 4;
  PlantsEnum[key].key = key;

  // Add draw method to make sprite render easy
  const img = new Image();
  img.src = './img/sprites/' + key + '.png';
  PlantsEnum[key].draw = (ctx, pos, r) => {
    if (ctx && img) {
      const { x, y } = pos;
      ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
    }
  };
});

export default PlantsEnum;
