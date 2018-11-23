import React from 'react';
import View3D from '../js/View3D';

/* global document */

/** Class for the 3D fly throughs of the model */
export default class Display3D extends React.Component {
  componentDidMount() {
    this.isWired = false;

    this.container = document.getElementById('display3D');
    this.view = new View3D(this.container);
    this.renderModel();
  }

  componentDidUpdate() {
    this.renderModel();
  }

  renderModel() {
    const { model } = this.props;
    if (this.view && model) {
      this.view.update(model);
    }
  }

  render() {
    this.width = 1200;
    this.height = 300;

    return (
      <div id="display3D" style={{ width: this.width, height: this.height, marginLeft: '-200px' }} />
    );
  }
}
