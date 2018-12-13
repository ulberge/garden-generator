const PlantsEnum = {
  VINE_MAPLE: {
    label: 'vine maple',
    r: 60,
    r_display: 92,
    h: 3,
    maxNumber: 2,
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
    maxNumber: 5,
    sprite: [0, 0],
    foliageColor: 'green',
    foliageShape: 'ovate',
    foliageSize: 'md',
    shade: [0, 1],
    moisture: [0, 1]
  },
  TALL_OREGON_GRAPE: {
    label: 'tall Oregon grape',
    r: 50,
    h: 2,
    maxNumber: 3,
    sprite: [0, 0],
    foliageColor: 'darkGreen',
    foliageShape: 'spiky',
    foliageSize: 'md',
    shade: [0, 3],
    moisture: [0, 2]
  },
  BALD_HIP_ROSE: {
    label: 'bald hip rose',
    r: 40,
    h: 2,
    maxNumber: 2,
    sprite: [0, 0],
    foliageColor: 'green',
    foliageShape: 'ovate',
    foliageSize: 'sm',
    shade: [0, 3],
    moisture: [0, 2]
  },
  RED_ELDERBERRY: {
    label: 'red elderberry',
    r: 70,
    h: 2,
    maxNumber: 1,
    sprite: [0, 0],
    foliageColor: 'green',
    foliageShape: 'spear',
    foliageSize: 'md',
    shade: [0, 3],
    moisture: [0, 2]
  },
  EVERGREEN_HUCKLEBERRY: {
    label: 'evergreen huckleberry',
    r: 40,
    h: 2,
    maxNumber: 4,
    sprite: [0, 0],
    foliageColor: 'darkGreen',
    foliageShape: 'ovate',
    foliageSize: 'sm',
    shade: [0, 1],
    moisture: [0, 1]
  },
  BEACH_STRAWBERRY: {
    label: 'beach strawberry',
    r: 15,
    h: 0,
    maxNumber: 8,
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
    r: 20,
    h: 1,
    maxNumber: 6,
    sprite: [0, 0],
    foliageColor: 'green',
    foliageShape: 'ovate',
    foliageSize: 'md',
    shade: [0, 1],
    moisture: [1, 1]
  },
  INSIDE_OUT_FLOWER: {
    label: 'inside-out flower',
    r: 20,
    h: 0,
    maxNumber: 8,
    sprite: [0, 0],
    foliageColor: 'green',
    foliageShape: 'ovate',
    foliageSize: 'md',
    shade: [0, 1],
    moisture: [0, 1]
  },
};

Object.keys(PlantsEnum).forEach(key => {
  PlantsEnum[key].r = PlantsEnum[key].r / 3.8;
  if (PlantsEnum[key].r_display) {
    PlantsEnum[key].r_display = PlantsEnum[key].r_display / 3.8;
  }

  PlantsEnum[key].key = key;

  // Add draw image method
  const img = new Image();
  img.src = './img/sprites/' + key + '.png';
  PlantsEnum[key].draw = (ctx, pos, r) => {
    if (ctx && img) {
      const { x, y } = pos;
      ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
      //ctx.drawImage(img, x - (img.width * scale/2), y - (img.height * scale/2), img.width * scale, img.height * scale
      //ctx.drawImage(img, x, y, );
    }
  };
});

export default PlantsEnum;
