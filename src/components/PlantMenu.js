import React, { Component } from 'react';
import PlantsEnum from '../js/PlantsEnum';

class PlantMenu extends Component {
  render() {
    const plantOptions = Object.keys(PlantsEnum).map(key => {
      const plant = PlantsEnum[key];
      const { label, color } = plant;
      return <li><span className="swatch" style={{ background: color, marginRight: '10px' }}></span><span>{label}</span></li>;
    });

    return (
      <div className="PlantMenu">
        <h3>Plant Menu</h3>
        <ul>{plantOptions}</ul>
      </div>
    );
  }
}

export default PlantMenu;
