const scale = 20;

const PlantsEnum = {
  SITKA_SPRUCE: {
    label: 'Sitka spruce',
    r: scale * 5,
    type: 'TREE',
    color: '#226233',
    maxNumber: 1,
    sprite: './img/sitka_spruce.gif',
    colorType: 'darkGreen'
  },
  CASCARA: {
    label: 'cascara',
    r: scale * 3,
    type: 'TREE',
    color: '#E4BF4F',
    maxNumber: 1,
    colorType: 'yellow'
  },
  SERVICEBERRY: {
    label: 'serviceberry',
    r: scale * 2,
    type: 'SHRUB',
    color: '#4EAF68',
    maxNumber: 1,
    colorType: 'green'
  },
  TALL_OREGON_GRAPE: {
    label: 'tall Oregon grape',
    r: scale * 1.2,
    type: 'SHRUB',
    color: '#3E6F21',
    maxNumber: 1,
    colorType: 'darkGreen'
  },
  PACIFIC_WAX_MYRTLE: {
    label: 'Pacific wax myrtle',
    r: scale * 3,
    type: 'SHRUB',
    color: '#BC6A4A',
    maxNumber: 1,
    colorType: 'red'
  },
  RED_FLOWERING_CURRENT: {
    label: 'red-flowering currant',
    r: scale * 2,
    type: 'SHRUB',
    color: '#AF4E51',
    maxNumber: 1,
    colorType: 'red'
  },
  NOOTKA_ROSE: {
    label: 'nootka rose',
    r: scale * 1.1,
    type: 'SHRUB',
    color: '#74BC4A',
    maxNumber: 1,
    colorType: 'green'
  },
  SNOWBERRY: {
    label: 'snowberry',
    r: scale * 0.9,
    type: 'SHRUB',
    color: '#267924',
    maxNumber: 1,
    colorType: 'darkGreen'
  },
  NODDING_ONION: {
    label: 'nodding onion',
    r: scale * 0.5,
    type: 'GROUND_COVER',
    color: '#E4BF4F',
    maxNumber: 1,
    colorType: 'yellow'
  },
  WESTERN_COLUMBINE: {
    label: 'Western columbine',
    r: scale * 0.7,
    type: 'GROUND_COVER',
    color: '#7A68D3',
    maxNumber: 1,
    colorType: 'purple'
  },
  GOATS_BEARD: {
    label: 'goat\'s beard',
    r: scale * 0.7,
    type: 'GROUND_COVER',
    color: '#51C64E',
    maxNumber: 5,
    colorType: 'green'
  },
  CAMAS: {
    label: 'camas, common',
    r: scale * 0.5,
    type: 'GROUND_COVER',
    color: '#8C66BC',
    maxNumber: 10,
    colorType: 'purple'
  },
  BEACH_STRAWBERRY: {
    label: 'beach strawberry',
    r: scale * 0.5,
    type: 'GROUND_COVER',
    color: '#E05F68',
    maxNumber: 10,
    colorType: 'red'
  },
  GOLDENROD: {
    label: 'goldenrod',
    r: scale * 0.5,
    type: 'GROUND_COVER',
    color: '#FBE564',
    maxNumber: 10,
    colorType: 'yellow'
  }
};

export default PlantsEnum;
