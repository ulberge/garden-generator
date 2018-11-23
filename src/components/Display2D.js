import React, { Component } from 'react';

import View2D from '../js/View2D';

class Display2D extends Component {

  componentDidMount() {
    this.el = document.getElementById('view2D');
    this.updateView();
  }

  componentDidUpdate() {
    this.updateView();
  }

  updateView = () => {
    const { model } = this.props;
    const { plants } = model;
    if (plants) {
      if (!this.view) {
        this.view = View2D(this.el, plants);
      } else {
        this.view.clearPlants();
        this.view.addPlants(plants);
      }
    }
  }

  render() {
    return (
      <div className="Display2D">
        <div id="view2D"></div>
      </div>
    );
  }
}

export default Display2D;
