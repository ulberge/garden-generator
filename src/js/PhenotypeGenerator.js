import PhysicsSimulator from './PhysicsSimulator';

// Generate a phenotype from the genotype
export default class PhenotypeGenerator {
  constructor(displays, filter) {
    this.simulators = [];
    displays.forEach(display => {
      this.simulators.push(PhysicsSimulator(display, 244, 191, [], filter));
    })
  }

  generatePhenotype(i, genotype, onSimulationFinished) {
    const simulator = this.simulators[i];
    simulator.clearPlants();
    simulator.addPlants(genotype);
    // Keep checking if physics simulator is settled
    this.simulatorChecker = this.check(simulator, onSimulationFinished);
  }

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
