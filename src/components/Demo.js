import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import FinalDisplay from './FinalDisplay';
import PlantMenu from './PlantMenu';
import GardenDesignPopulation from '../js/GardenDesignPopulation';

import FitnessCalculator from '../js/FitnessCalculator';
import PhenotypeGenerator from '../js/PhenotypeGenerator';
import FitnessViewer from '../js/FitnessViewer';
import Filter from '../js/Filter';

const popSize = 12;

// Maintains a population of individuals
// Each individual has a genotype and a fitness
// When all the fitnesses are calculated, a new generation is produced
export default class Demo extends Component {
  state = {
    individuals: [],
    bestIndividual: null,
    remaining: popSize,
    displayPopulation: true,
    filter: null
  }

  componentDidMount() {
    this.popSize = this.state.remaining;
    this.pause = false;
    this.generation = 1;
    this.runCount = 1;

    const simulatorDisplays = [];
    const fitnessDisplays = [];
    for (let i = 0; i < this.popSize; i += 1) {
      const el = document.getElementById('simulation' + i);
      simulatorDisplays.push(el);
      const fitnessEl = document.getElementById('fitness' + i);
      fitnessDisplays.push(fitnessEl);
    }
    this.fitnessViewer = new FitnessViewer(fitnessDisplays);

    this.filter = new Filter(() => {
      this.phenotypeGenerator = new PhenotypeGenerator(simulatorDisplays, this.filter);
      // Create a population of garden designs
      this.population = new GardenDesignPopulation(this.popSize, this.filter);
      this.run();
    });

    this.setState({ filter: this.filter });
  }

  restart = () => {
    this.pause = false;
    this.generation = 1;
    this.runCount += 1;
    this.fitnessViewer.clear();
    this.setState({
      bestIndividual: null,
      remaining: popSize
    });
    this.population = new GardenDesignPopulation(this.popSize, this.filter);
    this.run();
  }

  run = () => {
    const individuals = this.population.getIndividuals();
    const runCount = this.runCount;
    individuals.forEach((individual, i) => {
      this.phenotypeGenerator.generatePhenotype(i, individual, phenotype => { this.onPhenotypeGenerated(i, runCount, individual, phenotype) });
    });
  }

  onPhenotypeGenerated = (i, runCount, individual, phenotype) => {
    console.log(runCount, this.runCount, this.state.remaining-1);
    if (runCount !== this.runCount) {
      return;
    }

    if (!individual.fitness) {
      individual.phenotype = phenotype;
      const { fitness, fitnessData } = FitnessCalculator.calculateFitness(phenotype, this.filter);
      individual.fitness = fitness;
      individual.fitnessData = fitnessData;
    }
    this.fitnessViewer.render(i, individual);
    const remaining = this.state.remaining - 1;
    // Check if done calculating
    if (remaining === 0) {
      // show calculations
      // const individuals = this.population.getIndividuals();
      // individuals.forEach((individual, i) => this.fitnessViewer.render(i, individual));

      this.population.sort();
      const bestIndividual = this.population.getBestIndividual();
      this.setState({ remaining: this.popSize, bestIndividual });

      const pauseTime = 500;
      // And then next generation after pause
      const unPause = () => {
        if (this.pause) {
          setTimeout(unPause, pauseTime);
          return;
        }

        this.fitnessViewer.clear();
        this.next();
      };
      setTimeout(unPause, pauseTime);
    } else {
      this.setState({ remaining });
    }
  }

  // Breed the next generation based on the fitnesses of the last
  next = () => {
    // Breed a new group of individuals based on fitnesses
    this.population.next();
    const individuals = this.population.getIndividuals();
    this.generation += 1;
    this.setState({ individuals });

    this.run();
  }

  render() {
    const { bestIndividual, displayPopulation } = this.state;

    const simulatorElements = [];
    for (let i = 0; i < popSize; i += 1) {
      simulatorElements.push((
        <Grid item xs={4} style={{ transform: 'scale(1.6)', margin: '55px 0' }}>
          <div style={{ position: 'relative', width: '244px', height: '191px', margin: '5px 0' }}>
            <div key={i} id={'simulation' + i}></div>
            <canvas id={'fitness' + i} width={244} height={191}
              style={{ background: 'transparent', position: 'absolute',  top: 0, left: 0 }} />
          </div>
        </Grid>
      ));
    }

    const display = displayPopulation ? 'flex' : 'none';

    let text = '';
    if (bestIndividual && bestIndividual.fitnessData) {
      text += 'run #: ' + this.runCount;
      text += ', generation: ' + this.generation;
      text += ', id: ' + bestIndividual.id;
      text += ', fitness: ' + Number.parseFloat(bestIndividual.fitnessData.fitness).toPrecision(6);
      text += ', legality: ' + Number.parseFloat(bestIndividual.fitnessData.legality).toPrecision(6);
      text += ', crowding: ' + Number.parseFloat(bestIndividual.fitnessData.crowding).toPrecision(6);
      text += ', avgContrast: ' + Number.parseFloat(bestIndividual.fitnessData.avgContrast).toPrecision(6);
      text += ', diversity: ' + Number.parseFloat(bestIndividual.fitnessData.std).toPrecision(6);
    }

    return (
      <div style={{ margin: '0 auto', width: '1200px' }} >
        <Grid container spacing={24}>
          <Grid item xs={9} >
            <div style={{ position: 'relative', left: '-100px', top: '0px' }}>
              <div style={{ transform: 'scale(0.787)', transformOrigin: 'top' }}>
                <FinalDisplay individual={bestIndividual} filter={this.state.filter} />
              </div>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div style={{ background: '#CADEA7' }}>
              <h4 style={{ color: '#000', margin: 0, padding: '10px 0' }}>Plants</h4>
            </div>
            <PlantMenu onChange={this.restart}/>
          </Grid>
        </Grid>
        <div style={{ position: 'relative', left: '-225px', top: '-150px', fontSize: '12px' }}>
          All illustrations from the King County Native Plant Guide (https://green2.kingcounty.gov/gonative/Plan.aspx?Act=view&PlanID=13)
        </div>
        <div style={{ position: 'relative', top: '-100px', paddingBottom: '80px', margin: '0' }}>
          <div>
            <Button variant="contained" style={{ margin: '20px' }} onClick={this.restart}>
              Restart
            </Button>
            <Button variant="contained" style={{ margin: '20px' }} onClick={() => this.pause = !this.pause}>
              Pause Breeding
            </Button>
            <Button variant="contained" style={{ margin: '20px' }} onClick={window.toggleShowFitness}>
              Show Fitness
            </Button>
            <div style={{ padding: '10px 0' }}>
              <span>{text}</span>
            </div>
          </div>
          <Grid container spacing={0} style={{ display: display, marginLeft: '120px' }} >
            { simulatorElements }
          </Grid>
        </div>
      </div>
    );
  }
}
