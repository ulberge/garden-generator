const scale = 20;

const PlantsEnum = {
  SITKA_SPRUCE: {
    label: 'Sitka spruce',
    r: scale * 5,
    type: 'TREE',
    color: '#CFCAAC',
    maxNumber: 1,
    sprite: './img/sitka_spruce.gif'
  },
  CASCARA: {
    label: 'cascara',
    r: scale * 3,
    type: 'TREE',
    color: '#CFCAAC',
    maxNumber: 1
  },
  SERVICEBERRY: {
    label: 'serviceberry',
    r: scale * 2,
    type: 'SHRUB',
    color: '#4EAF68',
    maxNumber: 1
  },
  TALL_OREGON_GRAPE: {
    label: 'tall Oregon grape',
    r: scale * 1.2,
    type: 'SHRUB',
    color: '#577056',
    maxNumber: 1
  },
  PACIFIC_WAX_MYRTLE: {
    label: 'Pacific wax myrtle',
    r: scale * 3,
    type: 'SHRUB',
    color: '#6F6961',
    maxNumber: 1
  },
  RED_FLOWERING_CURRENT: {
    label: 'red-flowering currant',
    r: scale * 2,
    type: 'SHRUB',
    color: '#804B58',
    maxNumber: 1
  },
  NOOTKA_ROSE: {
    label: 'nootka rose',
    r: scale * 1.1,
    type: 'SHRUB',
    color: '#6E8653',
    maxNumber: 1
  },
  SNOWBERRY: {
    label: 'snowberry',
    r: scale * 0.9,
    type: 'SHRUB',
    color: '#6C5D4E',
    maxNumber: 1
  },
  NODDING_ONION: {
    label: 'nodding onion',
    r: scale * 0.5,
    type: 'GROUND_COVER',
    color: '#ECBF89',
    maxNumber: 1
  },
  WESTERN_COLUMBINE: {
    label: 'Western columbine',
    r: scale * 0.7,
    type: 'GROUND_COVER',
    color: '#82B65F',
    maxNumber: 1
  },
  GOATS_BEARD: {
    label: 'goat\'s beard',
    r: scale * 0.7,
    type: 'GROUND_COVER',
    color: '#88A449',
    maxNumber: 5
  },
  CAMAS: {
    label: 'camas, common',
    r: scale * 0.5,
    type: 'GROUND_COVER',
    color: '#8BA6CA',
    maxNumber: 10
  },
  BEACH_STRAWBERRY: {
    label: 'beach strawberry',
    r: scale * 0.5,
    type: 'GROUND_COVER',
    color: '#FBE86D',
    maxNumber: 10
  },
  GOLDENROD: {
    label: 'goldenrod',
    r: scale * 0.5,
    type: 'GROUND_COVER',
    color: '#FBE86D',
    maxNumber: 10
  }
};

export default PlantsEnum;
