import wdt from 'weighted-delaunay';
import * as math from 'mathjs';

// Class to handle calculating the fitness and fitnessData from a phenotype
export default class FitnessCalculator {
  static calculateFitness = (phenotype, filter) => {
    // Get delaunay triangles
    const delaunay = FitnessCalculator.getDelaunay(phenotype);
    if (!delaunay) {
      return 0;
    }

    // Find the neighboring plants
    const neighborPairs = FitnessCalculator.getNeighborPairs(phenotype, delaunay);

    // Calculate each of the fitness attributes and weight them
    const avgContrast = FitnessCalculator.calculateAverageNeighborContrast(neighborPairs) || 0;
    const crowding = -FitnessCalculator.calculateCrowding(neighborPairs)*4;
    const legality = -FitnessCalculator.calculateLegality(phenotype, filter)*8;
    const std = 1-FitnessCalculator.calculateTotalDiversity(phenotype);

    const fitness = avgContrast + std + crowding + legality;
    const fitnessData = { fitness, avgContrast, std, legality, crowding, neighborPairs };

    return { fitness, delaunay, fitnessData };
  }

  // Count all the plants in illegal positions and divide by the number of plants
  static calculateLegality = (phenotype, filter) => {
    let totalIllegal = 0;
    phenotype.forEach(plant => {
      const { type, pos } = plant;
      if (!filter.isLegal(type, pos)) {
        totalIllegal += 1;
        plant.isIllegal = true;
      }
    });

    const legality = totalIllegal/phenotype.length;
    return legality;
  }

  // Calculate the overlap between all the pairs
  static calculateCrowding = (neighborPairs) => {
    // for each element, check its neighbors, are they too close?
    let totalOverlap = 0;
    let overlapCount = 0;
    neighborPairs.forEach(pair => {
      const plant0 = pair.p0;
      const plant1 = pair.p1;
      const type0 = plant0.type;
      const pos0 = plant0.pos;
      const type1 = plant1.type;
      const pos1 = plant1.pos;
      const distance = FitnessCalculator.getDistance(pos0.x, pos0.y, pos1.x, pos1.y);
      const overlap = (type0.r + type1.r - distance);
      let overlapPercentage;
      if (type0.r > type1.r) {
        overlapPercentage = overlap/(type0.r);
      } else {
        overlapPercentage = overlap/(type1.r);
      }

      // Only count overlap of a certain degree
      if (overlapPercentage > 0.6) {
        totalOverlap += Math.pow(overlapPercentage, 2);
        pair.overlap = overlap;
        overlapCount += 1;
      }
    });

    if (overlapCount === 0) {
      return 0;
    }

    return totalOverlap/overlapCount;
  }

  // Calculate the standard deviation among the area of the garden occupied by different plant species
  static calculateTotalDiversity = (phenotype) => {
    const areaByTypeMap = {};
    phenotype.forEach(plant => {
      const { type } = plant;
      const { r } = type;
      let area = areaByTypeMap[type.key] || 0;
      areaByTypeMap[type.key] = area + (r*r);
    });

    //const numTypes = Object.values(PlantsEnum).filter(value => !value.unchecked).length;

    const values = Object.values(areaByTypeMap);
    const sum = math.sum(values);
    const mean = sum/values.length;
    const std = math.std(values);
    return std/mean;
  }

  // Calculate the average contrast between neighboring plants
  static calculateAverageNeighborContrast = (neighborPairs) => {
    let totalContrast = 0;
    let contrastCount = 0;
    neighborPairs.forEach(pair => {
      const contrast = FitnessCalculator.calculateContrast(pair.p0, pair.p1);
      pair.contrast = contrast;
      if (contrast !== null) {
        totalContrast += contrast;
        contrastCount += 1;
      }
    });

    // Normalize
    return (totalContrast/contrastCount)/3;
  }

  // Get all the neighbor pairs of plants using a delaunay triangulation
  // Ignore pairs of the same type of plant or pairs that are too far apart
  static getNeighborPairs = (phenotype, delaunay) => {
    // Make map of points to plants
    const pointToPlant = {};
    phenotype.forEach(plant => {
      const { pos } = plant;
      const { x, y } = pos;
      pointToPlant[[x, y].join('x')] = plant;
    });

    const neighborMap = {};

    // For each node find its neighbors, but only add neighbors once
    const {points, triangles} = delaunay;
    for (let i = 0; i < triangles.length/3; i += 1) {
      // Get the nodes which will be associated to plants
      const t0 = triangles[i * 3 + 0];
      const t1 = triangles[i * 3 + 1];
      const t2 = triangles[i * 3 + 2];
      const c0 = [points[t0 * 2], points[t0 * 2 + 1]].join('x');
      const c1 = [points[t1 * 2], points[t1 * 2 + 1]].join('x');
      const c2 = [points[t2 * 2], points[t2 * 2 + 1]].join('x');

      // Turn positions into the corresponding plant
      const plant0 = pointToPlant[c0];
      const plant1 = pointToPlant[c1];
      const plant2 = pointToPlant[c2];

      // If any new neighbor pairs found, add to map
      if (!(neighborMap[c0 + c1] || neighborMap[c1 + c0])) {
        if (FitnessCalculator.isNextTo(plant0, plant1)) {
          neighborMap[c0 + c1] = { p0: plant0, p1: plant1 };
        }
      }
      if (!(neighborMap[c0 + c2] || neighborMap[c2 + c0])) {
        if (FitnessCalculator.isNextTo(plant0, plant2)) {
          neighborMap[c0 + c2] = { p0: plant0, p1: plant2 };
        }
      }
      if (!(neighborMap[c2 + c1] || neighborMap[c1 + c2])) {
        if (FitnessCalculator.isNextTo(plant2, plant1)) {
          neighborMap[c2 + c1] = { p0: plant2, p1: plant1 };
        }
      }
    }

    const neighborPairs = Object.values(neighborMap);
    // console.log('neighborPairs', neighborPairs.length);
    return neighborPairs;
  }

  // Check if plants are close enough to be a neighbor pair
  static isNextTo = (plant0, plant1) => {
    const dist = FitnessCalculator.getDistance(plant0.pos.x, plant0.pos.y, plant1.pos.x, plant1.pos.y);
    const maxDist = (plant0.type.r + plant1.type.r) * 1.2;
    if (dist < maxDist) {
      return true;
    }
    return false;
  }

  // Get the normalized contrast between two plants
  static calculateContrast = (p0, p1) => {
    if (p0.type.key === p1.type.key) {
      return null;
    }

    let contrast = 0;
    if (p0.type.foliageColor !== p1.type.foliageColor) {
      contrast += 1;
    }
    if (p0.type.foliageShape !== p1.type.foliageShape) {
      contrast += 1;
    }
    if (p0.type.foliageSize !== p1.type.foliageSize) {
      contrast += 1;
    }

    return contrast;
  }

  // Get the weighted delaunay triangulation of the plants based on their location and radius
  static getDelaunay = (phenotype) => {
    if (phenotype && phenotype.length > 1) {
      const points = [];
      const weights = [];
      phenotype.forEach(plant => {
        const { pos, type } = plant;
        const { r } = type;
        const { x, y } = pos;
        points.push([x, y]);
        weights.push(r);
      });
      const triangles = wdt(points, weights);
      const trianglesFlat = [].concat.apply([], triangles);
      const pointsFlat = [].concat.apply([], points);

      return {
        triangles: trianglesFlat,
        points: pointsFlat
      }
    }
  }

  // Get the distance between two points
  // From: https://gist.github.com/timohausmann/5003280
  static getDistance = ( x1, y1, x2, y2 ) => {
    let xs = x2 - x1;
    let ys = y2 - y1;
    xs *= xs;
    ys *= ys;
    return Math.sqrt( xs + ys );
  }
}
