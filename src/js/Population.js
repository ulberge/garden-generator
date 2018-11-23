/**
* Defines a class that represents a population of points for a genetic
* algorithm
*/
export default class Population {
    constructor(initialPopulation, getRandomGene, sortByFitness, options = {}) {
      // Initial array of individuals
      this.individuals = initialPopulation;
      // Function that retrieves a random gene
      this.getRandomGene = getRandomGene;
      // Function that takes a list of individuals and returns them in order of most fit
      this.sortByFitness = sortByFitness;

      this.options = {
        pop_size: initialPopulation.length,
        num_breeding_parents: options.num_breeding_parents || 2,
        num_elite: options.num_elite || 2,
        num_crossover: options.num_crossover || 4,
        num_mutate: options.num_mutate || 4,
        mutation_rate: options.mutation_rate || 0.01
      };
    }

    // Update this population to the next generation
    next = () => {
      this.individuals = this.breed(this.individuals);
    }

    // Get the best individual from this population
    getBest = () => {
      return this.sortByFitness(this.individuals)[0];
    }

    /**
    * Select the best children from the previous population as parents. Use these parents for crossover breeding
    * and mutation. Make a new generation that combines the best parents, with children of crossover and mutation.
    * Implementing the algorithm described here:
    * https://www.mathworks.com/help/gads/how-the-genetic-algorithm-works.html
    */
    breed = individuals => {
      // Sort the population by fitness
      const individuals_ordered_by_fitness = this.sortByFitness(individuals);
      const breeding_parents = individuals_ordered_by_fitness.slice(0, this.options.num_breeding_parents);

      // Take the top parents as the 'elite'
      const elite_pop = individuals_ordered_by_fitness.slice(0, this.options.num_elite);

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

    // Return a child created by randomly mixing the genes of 2 parents
    // from a list of parents
    crossover = parents => {
      // Randomly select 2 parents to breed
      const p0_index = Math.floor(Math.random() * parents.length);
      const p1_index = Math.floor(Math.random() * parents.length);
      const p0 = parents[p0_index];
      const p1 = parents[p1_index];
      const p0_genes = p0.slice(0, Math.floor(p0.length / 2));
      const p1_genes = p1.slice(Math.floor(p1.length / 2));

      const child = p0_genes.concat(p1_genes);
      return child;
    }

    // Return a child created by randomly change some of the genes of the parent
    mutate = parent => {
      const child = parent.slice();

      // Every gene has a chance of random mutation based on probability
      for (let i = 0; i < child.length; i += 1) {
        if (Math.random() < this.options.mutation_rate) {
          const new_gene = this.getRandomGene();
          child[i] = new_gene;
        }
      }

      return child;
    }
}
