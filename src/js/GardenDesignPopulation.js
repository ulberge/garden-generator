import Population from './Population';
import PlantsEnum from './PlantsEnum';
import ID from './ID';

const GARDEN_ID = new ID();

export default class GardenDesignPopulation {
  constructor(popSize, filter) {
    // x, y, w, h
    this.bounds = { x: 0, y: 0, w: 244, h: 191 };
    this.popSize = popSize;
    this.filter = filter;

    this.population = new Population(this.getInitialPopulation(), {
      num_breeding_parents: popSize / 4,
      num_elite: popSize / 4,
      num_crossover: popSize / 4,
      num_mutate: popSize / 2,
      mutation_rate: 0.1
    });
    this.population.getRandomGene = this.getRandomGene;
    this.population.createNewIndividual = this.createNewIndividual;
    this.bestIndividual = this.population.individuals[0];
  }

  next = (fitnesses) => {
    this.population.next(fitnesses);
  }

  sort = () => {
    this.population.sort();
  }

  getIndividuals = () => {
    return this.population.individuals;
  }

  getBestIndividual = () => {
    return this.population.individuals[0];
  }

  getInitialPopulation = () => {
    const individuals = []
    for (let i = 0; i < this.popSize; i += 1) {
      const genotype = this.getRandomGenotype();
      const individual = this.createNewIndividual(genotype);
      individuals.push(individual);
    }
    return individuals;
  }

  createNewIndividual = (genotype) => {
    return {
      id: GARDEN_ID.getNextID(),
      genotype,
      phenotype: null,
      fitness: null
    };
  }

  // Get a list of random, unique pts of length num_pts
  getRandomGenotype = () => {
    const { w, h } = this.bounds;
    const area = w * h;
    let current_area = 0;

    const plants = [];
    while (true) {
      const plant = this.getRandomGene();
      current_area += Math.PI * plant.type.r * plant.type.r * plant.count;
      if (current_area < area * 0.75) {
        plants.push(plant);
      } else {
        return plants;
      }
    }
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

  getRandomPlantType = () => {
    var values = Object.values(PlantsEnum)
    var filteredValues = values.filter(value => !value.unchecked);
    const keys = filteredValues.map(v => v.key);
    return PlantsEnum[keys[Math.floor(keys.length * Math.random())]];
  }
}
