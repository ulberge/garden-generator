import Population from './Population';
import PlantsEnum from './PlantsEnum';
import ID from './ID';

// Universal garden id incrementor
const GARDEN_ID = new ID();

/************************************************************
*
* GardenDesignPopulation.js
* By: Erik Ulberg
*
* Class to wrap around the generic Population class and make it work for garden designs
*
*************************************************************/
export default class GardenDesignPopulation {
  constructor(popSize, filter) {
    // x, y, w, h
    this.bounds = { x: 0, y: 0, w: 244, h: 191 };
    this.popSize = popSize;
    // Filter object that has boundary and sunlight info
    this.filter = filter;

    // Create a generic population for the evolutionary algorithm
    this.population = new Population(this.getInitialPopulation(), {
      num_breeding_parents: 4,
      num_elite: 3,
      num_crossover: 3,
      num_mutate: 6,
      mutation_rate: 0.1
    });
    // Add specific functions for garden designs
    this.population.getRandomGene = this.getRandomGene;
    this.population.createNewIndividual = this.createNewIndividual;
    this.bestIndividual = this.population.individuals[0];
  }

  // Update population to the next generation based on the calculated fitnesses (assumes fitnesses have been added)
  next = () => {
    this.population.next();
  }

  // Sort the population in place (assumes fitnesses have been added)
  sort = () => {
    this.population.sort();
  }

  getIndividuals = () => {
    return this.population.individuals;
  }

  getBestIndividual = () => {
    return this.population.individuals[0];
  }

  // Get a random population of garden designs
  getInitialPopulation = () => {
    const individuals = []
    for (let i = 0; i < this.popSize; i += 1) {
      const genotype = this.getRandomGenotype();
      const individual = this.createNewIndividual(genotype);
      individuals.push(individual);
    }
    return individuals;
  }

  // Get a random garden design
  createNewIndividual = (genotype) => {
    this.fill(genotype);

    return {
      id: GARDEN_ID.getNextID(),
      genotype,
      phenotype: null,
      fitness: null
    };
  }

  // Get a random list of plants of approximately the right area
  getRandomGenotype = () => {
    const plants = [];
    this.fill(plants);
    return plants;
  }

  // Fill a list of plants with randomly place plants to match approximately the right area
  fill = (plants) => {
    const { w, h } = this.bounds;
    const area = w * h;
    let current_area = this.getCurrentArea(plants);

    // Keep adding plants until area estimates are met
    let i = 1000;
    while (i > 0) {
      const plant = this.getRandomGene();
      if (plant) {
        current_area += Math.PI * plant.type.r * plant.type.r * plant.count;
        if (current_area < area * 0.8) {
          plants.push(plant);
        } else {
          return plants;
        }
      }
      i -= 1;
    }
  }

  // Get the current total area of the plants in a list
  getCurrentArea = (plants) => {
    let current_area = 0;
    plants.forEach(plant => {
      current_area += Math.PI * plant.type.r * plant.type.r * plant.count;
    });
    return current_area;
  }

  // Get a random point within the bounds
  getRandomGene = () => {
    const type = this.getRandomPlantType();

    const { x, y, w, h } = this.bounds;
    let pos;
    let i = 0;
    do {
      let px = (Math.random() * w) + x;
      let py = (Math.random() * h) + y;
      pos = { x: px, y: py };
      i++;
    } while (!this.filter.isLegal(type, pos) && i < 5000);

    const { maxNumber } = type;
    const count = Math.floor(Math.random() * maxNumber) + 1;

    return { pos, type, count };
  }

  // Get a random plant type
  getRandomPlantType = () => {
    const keys = Object.keys(PlantsEnum);
    let type;
    do {
      type = PlantsEnum[keys[Math.floor(keys.length * Math.random())]];
    } while (type.unchecked)
    return type;
  }
}
