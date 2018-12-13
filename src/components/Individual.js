import React, { Component } from 'react';

import PhysicsSimulator from '../js/PhysicsSimulator';
import GardenDesignPopulation from '../js/GardenDesignPopulation';
import ReactDOM from 'react-dom';

export default class Individual extends Component {

  componentDidMount() {
    // Run physics simulator on genotype to produce phenotype
    const { individual, renderSimulator } = this.props;
    const { genotype } = individual;
    if (genotype) {
      const el = renderSimulator ? ReactDOM.findDOMNode(this).getElementsByClassName('simulation')[0] : null;
      this.simulator = PhysicsSimulator(el, 244, 191, genotype);
      // Keep checking if physics simulator is settled
      this.simulatorChecker = this.check(this.simulator, this.onSimulationFinished);
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.individual.id !== this.props.individual.id;
  }

  onSimulationFinished = (phenotype) => {
    // get array of triangles for points
    const delaunay = GardenDesignPopulation.getDelaunay(phenotype);
    const fitness = GardenDesignPopulation.calculateFitness(phenotype, delaunay);

    if (this.props.renderFitness) {
      this.renderFitness(phenotype, delaunay);
    }
    this.props.onCalculateFitness(fitness);
  }

  check = (simulator, onFinished) => {
    return setTimeout(() => {
      if (simulator.isWorldSleeping()) {
        const phenotype = simulator.getPhenotype();
        this.setState({ phenotype });
        onFinished(phenotype);
      } else {
        this.simulatorChecker = this.check(simulator, onFinished);
      }
    }, 100);
  }

  // getDelaunay = (phenotype) => {
  //   if (phenotype && phenotype.length > 1) {
  //     const points = [];
  //     phenotype.forEach(plant => {
  //       const { pos } = plant;
  //       const { x, y } = pos;
  //       points.push([x, y]);
  //     });
  //     const delaunay = Delaunay.from(points);
  //     return delaunay;
  //   }
  // }

  renderFitness = (phenotype, delaunay) => {
    if (phenotype && phenotype.length > 1) {
      // const canvas = ReactDOM.findDOMNode(this).getElementsByClassName('fitness')[0];
      // this.ctx = canvas.getContext('2d');
      // this.ctx.strokeStyle = '#fff';

      // const {points, triangles} = delaunay;
      // for (let i = 0; i < triangles.length/3; i += 1) {
      //   const t0 = triangles[i * 3 + 0];
      //   const t1 = triangles[i * 3 + 1];
      //   const t2 = triangles[i * 3 + 2];
      //   this.ctx.moveTo(points[t0 * 2], points[t0 * 2 + 1]);
      //   this.ctx.lineTo(points[t1 * 2], points[t1 * 2 + 1]);
      //   this.ctx.lineTo(points[t2 * 2], points[t2 * 2 + 1]);
      //   this.ctx.closePath();
      // }
      // this.ctx.stroke();

      // phenotype.forEach(plant => {
      //   const { pos, type } = plant;
      //   const { r } = type;
      //   const { x, y } = pos;
      //   this.ctx.beginPath();
      //   this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
      //   this.ctx.closePath();
      //   this.ctx.stroke();
      // });
      // const voronoi = delaunay.voronoi([0, 0, 600, 300]);
      // voronoi.render(this.ctx);
      // this.ctx.closePath();
      // this.ctx.stroke();


      // let canvas = $('.simulation canvas');
      // let d = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
      // let v = [];
      // for (let i = 0; i < d.length/4; i += 1) {v[i] = d[i] ? 0 : 1}
    }
  }

  render() {
    const { renderSimulator, renderFitness } = this.props;

    return (
      <div className="Individual" style={{ position: 'relative' }} >
        { renderSimulator ?
          <div className="simulation"></div> :
          null
        }
        { renderFitness ?
          <canvas className="fitness" width={244} height={191}
            style={{ background: 'transparent', position: 'absolute',  top: 0, left: 0 }} /> :
          null
        }
      </div>
    );
  }
}
