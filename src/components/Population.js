import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Individual from './Individual';
import GardenDesignPopulation from '../js/GardenDesignPopulation';

// Maintains a population of individuals
// Each individual has a genotype and a fitness
// When all the fitnesses are calculated, a new generation is produced
export default class Population extends Component {
  state = {
    individuals: []
  }

  componentDidMount() {
    this.getFilter((filter) => {
      // Create a population of garden designs
      this.population = new GardenDesignPopulation(1, filter);

      // Get initial group of individuals
      const individuals = this.population.getIndividuals();
      this.setState({ individuals });
    });
  }

  getFilter = (onLoad) => {
    var img = new Image();
    img.src = './img/filter.png';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
      const filterContext = canvas.getContext('2d');
      const filter = {
        get: (position) => {
          const { x, y } = position;
          return filterContext.getImageData(x, y, 1, 1).data;
        }
      };

      onLoad(filter);
    };
  }

  // Collect fitnesses until you have them all, then get next generation
  onCalculateFitness = (i, fitness) => {
    let { individuals } = this.state;
    individuals[i].fitness = fitness;

    // If all fitnesses calculated, next generation
    if (individuals.filter(i => !i.fitness).length === 0) {
      //this.next();
    }
  }

  // Breed the next generation based on the fitnesses of the last
  next = () => {
    // Breed a new group of individuals based on fitnesses
    this.population.next();
    const individuals = this.population.getIndividuals();
    console.log(individuals.map(i => i.id));
    this.setState({
      individuals
    });
  }

  render() {
    const { individuals } = this.state;

    let individualElements = null;
    if (individuals) {
      individualElements = individuals.map((individual, i) => {
        return (
          <Grid key={individual.id} item xs={6}>
            <Individual individual={individual} renderSimulator={true} renderFitness={false} onCalculateFitness={(fitness) => this.onCalculateFitness(i, fitness)} />
          </Grid>
        );
      });
    }

    return (
      <div style={{ margin: '0 20px' }} >
        <Button variant="contained" style={{ marginBottom: '20px' }} onClick={this.next}>
          Next Generation
        </Button>
        <Grid container spacing={24}>
            {individualElements}
        </Grid>
      </div>
    );
  }
}
