import PhysicsSimulator from './PhysicsSimulator';

// Class to handle generating a phenotype from the genotype
// It recycles the PhysicsSimulators and takes care of waiting for them to finish
export default class PhenotypeGenerator {
  constructor(displays, filter) {
    this.simulators = [];
    displays.forEach(display => {
      this.simulators.push(new PhysicsSimulator(display, 244, 191, filter));
    })
  }

  // Insert this individual and its genotype into the appropriate simulator
  // to calculate the phenotype
  generatePhenotype(i, individual, onSimulationFinished) {
    if (individual.phenotype) {
      onSimulationFinished(individual.phenotype);
      return;
    }
    const simulator = this.simulators[i];
    simulator.clearPlants();
    simulator.addPlants(individual.genotype);
    // Keep checking if physics simulator is settled
    this.simulatorChecker = this.check(simulator, onSimulationFinished);
  }

  // Recursive timer function to keep checking if simulation is settled every 100 ms
  check = (simulator, onFinished) => {
    return setTimeout(() => {
      if (simulator.isWorldSleeping()) {
        const phenotype = simulator.getPhenotype();
        onFinished(phenotype);
      } else {
        this.simulatorChecker = this.check(simulator, onFinished);
      }
    }, 100);
  }
}
