import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FitnessViewer from '../js/FitnessViewer';
import SitePlan from '../js/SitePlan';

// Scale up for larger version
const scale = 4;

/************************************************************
*
* FinalDisplay.js
* By: Erik Ulberg
*
* Class for final rendering of the best individual
*
*************************************************************/
export default class FinalDisplay extends Component {

  componentDidMount() {
    // Get the canvas and create the viewer
    this.canvas = ReactDOM.findDOMNode(this).getElementsByClassName('phenotypeDisplay')[0];
    this.ctx = this.canvas.getContext('2d');
    this.fitnessViewer = new FitnessViewer([this.canvas], 4);

    // Draw the garden
    this.renderPhenotype();

    // Allow user to toggle showing fitnessData from console or button
    window.showFitness = false;
    window.toggleShowFitness = () => {
      window.showFitness = !window.showFitness;
      this.renderPhenotype();
    };
  }

  // On updates of the individual, rerender
  componentDidUpdate() {
    this.renderPhenotype();
  }

  renderPhenotype = () => {
    // Clear view
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const { individual } = this.props;
    // Make sure there is something to render
    if (!individual) {
      return;
    }

    const { phenotype } = individual;
    if (phenotype) {
      // Sort the plants to render the tallest on top
      phenotype.sort((i0, i1) => {
        if (i0.type.h > i1.type.h) {
          return 1;
        } else if (i0.type.h === i1.type.h) {
          return 0;
        } else {
          return -1;
        }
      });

      // For each plant draw its sprite
      phenotype.forEach(plant => {
        const { pos, type } = plant;
        const { r } = type;
        let r_display = r;
        if (type.r_display) {
          r_display = type.r_display;
        }
        const { x, y } = pos;
        type.draw(this.ctx, { x: x * scale, y: y * scale }, r_display * scale * 1);

        // Render the circle from the physics simulator
        // this.ctx.beginPath();
        // this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, true);
        // this.ctx.closePath();
        // this.ctx.stroke();
      });

      // Render tree sprites
      this.ctx.save();
      this.ctx.globalAlpha = 0.7;
      SitePlan.trees.forEach(tree => this.renderTree(tree));
      this.ctx.restore();
    }

    // If showFitness, render the fitness for this individual
    if (individual && individual.fitness && window.showFitness) {
      this.fitnessViewer.render(0, individual);
    }
  }

  // Render a tree sprite from the site map
  renderTree = (tree) => {
    const x = tree[0];
    const y = tree[1];
    const size = tree[3];
    const img = tree[4];
    this.ctx.drawImage(img, (x*scale) - (size/2), (y*scale) - (size/2), size, size);
  }

  render() {
    return (
      <div style={{ backgroundImage: 'url("./img/background.png")', width: '976px', height: '764px', margin: 'auto' }} >
        <canvas className="phenotypeDisplay" width={976} height={764} style={{ background: 'transparent' }} />
      </div>
    );
  }
}
