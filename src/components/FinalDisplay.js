import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FitnessViewer from '../js/FitnessViewer';

const DF_IMG = new Image();
DF_IMG.src = './img/sprites/DOUGLAS_FIR.png';
const PD_IMG = new Image();
PD_IMG.src = './img/sprites/PACIFIC_DOGWOOD.png';
const FILTER = new Image();
FILTER.src = './img/filter.png';

// convert phenotype to sprites and draw to a canvas
export default class FinalDisplay extends Component {

  componentDidMount() {
    this.canvas = ReactDOM.findDOMNode(this).getElementsByClassName('phenotypeDisplay')[0];
    this.ctx = this.canvas.getContext('2d');
    this.fitnessViewer = new FitnessViewer([this.canvas], 4);
    this.renderPhenotype();
    window.showFitness = false;
    window.toggleShowFitness = () => {
      window.showFitness = !window.showFitness;

      this.renderPhenotype();
    };
  }

  componentDidUpdate() {
    this.renderPhenotype();
  }

  renderPhenotype = () => {
    // clear
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const { individual } = this.props;
    if (!individual) {
      return;
    }

    const { phenotype } = individual;
    const scale = 4;
    if (phenotype) {
      phenotype.sort((i0, i1) => {
        if (i0.type.h > i1.type.h) {
          return 1;
        } else if (i0.type.h === i1.type.h) {
          return 0;
        } else {
          return -1;
        }
      });

      phenotype.forEach(plant => {
        // draw plant
        const { pos, type } = plant;
        const { r } = type;
        let r_display = r;
        if (type.r_display) {
          r_display = type.r_display;
        }
        const { x, y } = pos;
        type.draw(this.ctx, { x: x * scale, y: y * scale }, r_display * scale * 1);
        // render the circle from the physics simulator
        // this.ctx.beginPath();
        // this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, true);
        // this.ctx.closePath();
        // this.ctx.stroke();
      });

      // render trees
      this.ctx.save();
      this.ctx.globalAlpha = 0.7;
      const renderTree = (img, x, y, size) => {
        this.ctx.drawImage(img, (x*scale) - (size/2), (y*scale) - (size/2), size, size);
      }
      renderTree(DF_IMG, 23, 19, 270);
      renderTree(DF_IMG, 80, 8, 270);
      renderTree(DF_IMG, 233, 9, 330);

      renderTree(PD_IMG, 61, 60, 230);
      renderTree(PD_IMG, 230, 68, 230);
      this.ctx.restore();
    }

    if (individual && individual.fitness && window.showFitness) {
      this.fitnessViewer.render(0, individual);
    }
  }

  render() {
    let background = 'url("./img/background.png")';

    return (
      <div style={{ backgroundImage: background, width: '976px', height: '764px', margin: 'auto' }} >
        <canvas className="phenotypeDisplay" width={976} height={764} style={{ background: 'transparent' }} />
      </div>
    );
  }
}
