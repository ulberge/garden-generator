import React, { Component } from 'react';

export default class Text extends Component {

  render() {
    const { individual } = this.props;

    let text = '';
    if (individual && individual.fitnessData) {
      text += 'Best: ';
      text += 'fitness: ' + Number.parseFloat(individual.fitnessData.fitness).toPrecision(6);
      text += ', legality: ' + Number.parseFloat(individual.fitnessData.legality).toPrecision(6);
      text += ', crowding: ' + Number.parseFloat(individual.fitnessData.crowding).toPrecision(6);
      text += ', avgContrast: ' + Number.parseFloat(individual.fitnessData.avgContrast).toPrecision(6);
      text += ', diversity: ' + Number.parseFloat(individual.fitnessData.std).toPrecision(6);
    }

    return (
      <div style={{ padding: '10px 0' }}>
        <span>{text}</span>
      </div>
    );
  }
}
