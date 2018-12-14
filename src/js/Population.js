/**
* Defines a class that represents a population for a genetic algorithm
*/
export default class Population {
    constructor(initialPopulation, options = {}) {
      this.individuals = initialPopulation;
      this.options = {
        num_breeding_parents: options.num_breeding_parents || 2,
        num_elite: options.num_elite || 2,
        num_crossover: options.num_crossover || 3,
        num_mutate: options.num_mutate || 3,
        mutation_rate: options.mutation_rate || 0.01
      };
    }

    // Create the next generation
    next = () => {
      this.individuals = this.breed(this.individuals);
    }

    // Sort the generation in place
    sort = () => {
      this.sortByFitness(this.individuals);
    }

    /**
    * Select the best children from the previous population as parents. Use these parents for crossover breeding
    * and mutation. Make a new generation that combines the best parents, with children of crossover and mutation.
    * Implementing the algorithm described here:
    * https://www.mathworks.com/help/gads/how-the-genetic-algorithm-works.html
    */
    breed = (individuals) => {
      const breeding_parents = individuals.slice(0, this.options.num_breeding_parents);

      // Take the top parents as the 'elite'
      const elite_pop = individuals.slice(0, this.options.num_elite);

      // Create children using crossover breeding of best parents
      const crossover_pop = [];
      for (let i = 0; i < this.options.num_crossover; i += 1) {
          crossover_pop.push(this.crossover(breeding_parents));
      }

      // Create children by mutating the best parents
      const mutate_pop = [];
      for (let i = 0; i < this.options.num_mutate; i += 1) {
          const parent = breeding_parents[Math.floor(Math.random() * breeding_parents.length)]
          mutate_pop.push(this.mutate(parent))
      }


      const new_individuals = elite_pop.concat(crossover_pop, mutate_pop);
      return new_individuals;
    }

    // Return a child created by randomly mixing the genotype of 2 parents
    // from a list of parents
    crossover = parents => {
      // Randomly select 2 parents to breed
      const p0_index = Math.floor(Math.random() * parents.length);
      const p1_index = Math.floor(Math.random() * parents.length);
      const p0 = parents[p0_index];
      const p1 = parents[p1_index];
      const p0_genotype = p0.genotype.slice(0, Math.floor(p0.length / 2));
      const p1_genotype = p1.genotype.slice(Math.floor(p1.length / 2));

      const child_genotype = p0_genotype.concat(p1_genotype);

      const child = this.createNewIndividual(child_genotype);
      return child;
    }

    // Return a child created by randomly change some of the genotype of the parent
    mutate = parent => {
      const child_genotype = parent.genotype.slice();

      // Every gene has a chance of random mutation based on probability
      for (let i = 0; i < child_genotype.length; i += 1) {
        if (Math.random() < this.options.mutation_rate) {
          const new_gene = this.getRandomGene();
          child_genotype[i] = new_gene;
        }
      }

      const child = this.createNewIndividual(child_genotype);
      return child;
    }

  // Return the list of individuals in order of most fit
  sortByFitness = (individuals) => {
    individuals.sort((i0, i1) => {
      if (i0.fitness < i1.fitness) {
        return 1;
      } else if (i0.fitness === i1.fitness) {
        return 0;
      } else {
        return -1;
      }
    });
  }
}
