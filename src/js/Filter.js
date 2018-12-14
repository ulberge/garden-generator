import SitePlan from './SitePlan';

/************************************************************
*
* Filter.js
* By: Erik Ulberg
*
* Class to provide helper functions for site map based on a image representing sunlight and blocked areas
*
*************************************************************/
export default class Filter {
  constructor(onLoad) {
    var img = new Image();
    // Get the image that represents the sunlight and blocked areas
    img.src = SitePlan.filterImg;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
      const filterContext = canvas.getContext('2d');
      this.filter = {
        get: (position) => {
          const { x, y } = position;
          return filterContext.getImageData(x, y, 1, 1).data;
        }
      };

      onLoad();
    };
  }

  // Decode the filter image into [-1,3] blocked or sunlight
  getType = (pos) => {
    const filterVal = this.filter.get(pos)[0];

    switch(filterVal) {
      case 0:
        // blocked
        return -1;
      case 50:
        // shade
        return 0;
      case 150:
        // part shade
        return 1;
      case 200:
        // part sun
        return 2;
      case 255:
        // sun
        return 3;
      default:
        return null;
    }
  }

  // Check if the given plant type can legally be in the location
  isLegal = (plantType, pos) => {
    const type = this.getType(pos);

    const shadeMin = plantType.shade[0]; // 0-3
    const shadeMax = plantType.shade[1]; // 0-3

    switch(type) {
      case -1:
        // blocked
        return false;
      case 0:
        // shade 0
        if (shadeMin > 0) {
          // needs more light
          return false;
        } else {
          return true;
        }
      case 1:
        // part shade 1
        if (shadeMin > 1 || shadeMax < 1) {
          // needs more or less light
          return false;
        } else {
          return true;
        }
      case 2:
        // part sun
        if (shadeMin > 2 || shadeMax < 2) {
          // needs more or less light
          return false;
        } else {
          return true;
        }
      case 3:
        // sun
        if (shadeMax < 3) {
          // needs less light
          return false;
        } else {
          return true;
        }
      default:
        return true;
    }
  }
}
