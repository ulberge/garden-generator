import Population from './Population';
import PlantsEnum from './PlantsEnum';

export default class GardenGenerator {
  constructor() {
    // x, y, w, h
    this.bounds = { x: 0, y: 0, w: 800, h: 600 };
    const initialPopulation = this.getInitialPopulation();
    this.population = new Population(initialPopulation, this.getRandomPlant, this.sortByFitness);
    this.best = this.population.getBest();
  }

  generate = () => {
    this.population.next();

    const model = {
      plants: this.population.getBest()
    };

    return model;
  }

  // Return the list of individuals in order of most fit
  sortByFitness = individuals => {
    // Make a copy
    individuals = individuals.slice();
    console.log('before' + individuals.map(i => i.length));
    // TODO: implement
    individuals.sort((i0, i1) => {
      if (i0.length < i1.length) {
        return -1;
      } else if (i0.length === i1.length) {
        return 0;
      } else {
        return 1;
      }
    });
    console.log('after' + individuals.map(i => i.length));

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
    const c = Math.floor(Math.random() * maxNumber) + 1;
    console.log(r, c);

    const plant = {
      pos: { x: px, y: py },
      type: type,
      count: c
    };
    return plant;
  }

  // Check if the point is legal
  // isLegal = pt => {
  //   return true;
  // }

  getRandomPlantType = () => {
    var keys = Object.keys(PlantsEnum)
    return PlantsEnum[keys[Math.floor(keys.length * Math.random())]];
  };
}
