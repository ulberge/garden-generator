import Population from './Population';
import PlantsEnum from './PlantsEnum';

export default class GardenGenerator {
  constructor() {
    // x, y, w, h
    this.bounds = { x: 0, y: 0, w: 800, h: 300 };
    this.colors = {};
    const initialPopulation = this.getInitialPopulation();
    this.population = new Population(initialPopulation, this.getRandomPlant, this.sortByFitness);
    this.best = this.population.getBest();
  }

  generate = (colors) => {
    this.colors = colors || {};
    for (let i = 0; i < 1000; i++) {
      this.population.next();
    }

    const model = {
      plants: this.population.getBest()
    };

    return model;
  }

  // Return the list of individuals in order of most fit
  sortByFitness = individuals => {
    // Make a map to sort with
    const indexedIndividuals = individuals.map((individual, index) => {
      return {
        id: index,
        plants: individual,
        fitness: 0
      };
    });

    const colorKeys = Object.keys(this.colors);
    if (colorKeys.length > 0) {
      const normalizedColors = Object.assign({}, this.colors);
      this.normalize(normalizedColors);
      // console.log('normalizedColors', normalizedColors);

      // Calculate and add color fitness by comparing ratios
      indexedIndividuals.forEach(item => {
        const { plants } = item;
        // Calculate total area of each color
        const colorArea = {};
        colorKeys.forEach(key => colorArea[key] = 0);

        plants.forEach(plant => {
          const { type, count } = plant;
          const { colorType, r } = type;
          colorArea[colorType] += (r**2) * count;
        });
        // console.log('colorArea', colorArea);

        // Normalize color areas for comparison
        this.normalize(colorArea);

        // Calculate fitness by finding sum of differences
        let colorFitness = 0;
        colorKeys.forEach(key => {
          colorFitness += Math.abs(colorArea[key] - normalizedColors[key]);
        });

        // console.log(colorFitness);
        item.fitness = colorFitness;
      });

      // Sort by color fitness
      indexedIndividuals.sort((i0, i1) => {
        if (i0.fitness < i1.fitness) {
          return -1;
        } else if (i0.fitness === i1.fitness) {
          return 0;
        } else {
          return 1;
        }
      });
      // console.log('sorted', indexedIndividuals);
      console.log('fittest: ' + indexedIndividuals[0].fitness);
      individuals = indexedIndividuals.map(i => i.plants);
    } else {
      // sort by size
      individuals.sort((i0, i1) => {
        if (i0.length < i1.length) {
          return -1;
        } else if (i0.length === i1.length) {
          return 0;
        } else {
          return 1;
        }
      });
    }

    return individuals;
  }

  getInitialPopulation = () => {
    const individuals = []
    for (let i = 0; i < 10; i += 1) {
      const pts = this.getRandomPlants();
      individuals.push(pts);
    }
    return individuals;
  }

  // Get a list of random, unique pts of length num_pts
  getRandomPlants = () => {
    const { w, h } = this.bounds;
    const area = w * h;
    let current_area = 0;

    const plants = [];
    while (true) {
      const plant = this.getRandomPlant();
      current_area += Math.PI * plant.type.r * plant.type.r * plant.count;
      if (current_area < area * 0.9) {
        plants.push(plant);
      } else {
        return plants;
      }
    }
  }

  // Get a random point within the bounds
  getRandomPlant = () => {
    const { x, y, w, h } = this.bounds;
    const px = (Math.random() * w) + x;
    const py = (Math.random() * h) + y;
    const type = this.getRandomPlantType();
    const { r } = type;
    const maxNumber = 50 / r;
    const count = Math.floor(Math.random() * maxNumber) + 1;

    const pos = [];
    for (let i = 0; i < count; i += 1) {
      pos.push({ x: px + i, y: py + i });
    }

    const plant = { pos, type, count };
    return plant;
  }

  getRandomPlantType = () => {
    var keys = Object.keys(PlantsEnum)
    return PlantsEnum[keys[Math.floor(keys.length * Math.random())]];
  }

  // Normalize the map in place
  normalize = map => {
    const max = Math.max.apply(Math, Object.values(map));

    Object.keys(map).forEach(key => {
        const value = map[key];
        map[key] = value / max;
    });
  }
}
