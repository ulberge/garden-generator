// File for encoding the site plan information
const DF_IMG = new Image();
DF_IMG.src = './img/sprites/DOUGLAS_FIR.png';
const PD_IMG = new Image();
PD_IMG.src = './img/sprites/PACIFIC_DOGWOOD.png';

const SitePlan = {
  trees: [
    [23, 19, 10, 270, DF_IMG], // x, y, trunk radius, sprite radius, sprite image
    [80, 8, 10, 270, DF_IMG],
    [233, 9, 15, 330, DF_IMG],
    [61, 60, 6, 230, PD_IMG],
    [230, 68, 6, 230, PD_IMG],
  ],
  svg: [
    ['0 423 78 154 143 71 229 26 328 0 455 7 508 49 578 135 672 423', 0.25, 110, 150] // svg points, scale, x, y
  ],
  filterImg: './img/filter.png',
};

export default SitePlan;
