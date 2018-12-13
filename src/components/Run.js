import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import FinalDisplay from './FinalDisplay';
import Simulators from './Simulators';
import Text from './Text';

import GardenDesignPopulation from '../js/GardenDesignPopulation';

import FitnessCalculator from '../js/FitnessCalculator';
import PhenotypeGenerator from '../js/PhenotypeGenerator';
import FitnessViewer from '../js/FitnessViewer';
import Filter from '../js/Filter';

export default class Run extends Component {
  state = {
    bestIndividual: null
  }

  componentDidMount() {
    const { popSize } = this.props;
    this.remaining = popSize;

    this.filter = new Filter(() => {
      if (!this.phenotypeGenerator && !this.fitnessViewer) {
        const simulatorDisplays = [];
        const fitnessDisplays = [];
        for (let i = 0; i < popSize; i += 1) {
          const simulatorEl = document.getElementById('simulation' + i);
          simulatorDisplays.push(simulatorEl);
          const fitnessEl = document.getElementById('fitness' + i);
          fitnessDisplays.push(fitnessEl);
        }
        this.phenotypeGenerator = new PhenotypeGenerator(simulatorDisplays, this.filter);
        this.fitnessViewer = new FitnessViewer(fitnessDisplays);
      }

      this.population = new GardenDesignPopulation(popSize, this.filter);
      this.run();
    });
  }

  run = () => {
    const individuals = this.population.getIndividuals();
    individuals.forEach((individual, i) => {
      this.phenotypeGenerator.generatePhenotype(i, individual.genotype, phenotype => {
        this.onPhenotypeGenerated(i, individual, phenotype) });
    });
  }

  onPhenotypeGenerated = (i, individual, phenotype) => {
    const { fitness, fitnessData } = FitnessCalculator.calculateFitness(phenotype, this.filter);
    individual.phenotype = phenotype;
    individual.fitness = fitness;
    individual.fitnessData = fitnessData;
    this.fitnessViewer.render(i, individual);

    this.remaining -= 1;
    // Check if done calculating
    if (this.remaining === 0) {
      // And then next generation after pause
      const unPause = () => {
        if (this.pause) {
          setTimeout(unPause, 2000);
          return;
        }

        this.fitnessViewer.clear();
        this.population.sort();
        const bestIndividual = this.population.getBestIndividual();
        this.setState({ remaining: this.props.popSize, bestIndividual });
        this.population.next();
        this.run();
      };
      setTimeout(unPause, 2000);
    }
  }

  render() {
    const { popSize } = this.props;
    const { bestIndividual, filter } = this.state;

    return (
      <div>
        <Grid container spacing={24}>
          <Grid item xs={6}>
            <div style={{ position: 'relative', top: '5px', left: '-170px' }}>
              <div style={{ transform: 'scale(0.75)', transformOrigin: 'top' }}>
                <FinalDisplay individual={bestIndividual} filter={filter} />
              </div>
            </div>
            <div style={{ position: 'relative', top: '-180px', left: '0' }}>
              <Text individual={bestIndividual} />
            </div>
          </Grid>
          <Grid item xs={6} >
            <Button variant="contained" style={{ margin: '20px' }} onClick={() => this.pause = !this.pause }>
              Pause
            </Button>
            <div style={{ position: 'relative', top: '-20px', left: '20px' }}>
              <div style={{ transform: 'scale(0.75)', transformOrigin: 'top' }}>
                <Simulators popSize={popSize} />
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}
