import React, { Component } from 'react';
import PlantsEnum from '../js/PlantsEnum';
import Checkbox from '@material-ui/core/Checkbox';

// Class for the right hand plant menu with a plant list and checkboxes
class PlantMenu extends Component {
  state = {
    unchecked: {}
  };

  // On check or uncheck plant, update the global plant list.
  onCheck = (key) => {
    const { onChange } = this.props;
    const { unchecked } = this.state;
    const current = unchecked[key];

    // Must have at least two plants remaining
    if (!current && Object.values(PlantsEnum).filter(type => !type.unchecked).length < 3) {
      return;
    }

    // Reverse check state
    unchecked[key] = !current ? true : false;
    PlantsEnum[key].unchecked = unchecked[key];
    this.setState({ unchecked });

    // Wait for 2sec before triggering update from change in plant list in case there are multiple changes
    // Changing can be slightly slow!
    if (this.changeList) {
      clearTimeout(this.changeList);
    }
    this.changeList = setTimeout(() => {
      onChange();
    }, 2000);
  }

  // Get all the plant list elements
  getPlantListElements = () => {
    let plantListElements = null;
    if (PlantsEnum) {
      plantListElements = Object.keys(PlantsEnum).map((key, i) => {
        const plant = PlantsEnum[key];
        return this.getPlantListElement(plant);
      });
    }
    return plantListElements;
  }

  // Get a single line in the plant menu for the given plant
  getPlantListElement = (plant) => {
    const key = plant.key;
    return (
      <tr className="plantItem" key={key} style={{ padding: '4px' }}>
        <td>
          <span className="plantIconContainer">
            <img src={'./img/sprites/' + key + '.png' } alt="" className={'plantIcon ' + key} />
          </span>
        </td>
        <td style={{ padding: '4px', fontSize: '9px' }}>
          <div style={{ padding: '2px', fontSize: '14px' }}>{plant.label}</div>
          <div>sun: {this.getType(plant.shade[0])} - {this.getType(plant.shade[1])}</div>
          <div>foliage: {plant.foliageSize} size {plant.foliageColor} {plant.foliageShape}</div>
        </td>
        <td>
          <Checkbox
            checked={!this.state.unchecked[key]}
            onChange={() => this.onCheck(key)}
            color="default"
            value={'checked' + key}
          />
        </td>
      </tr>
    );
  }

  // Given a int representing a sun level, return the appropriate String
  getType = (num) => {
    switch (num) {
      case 0:
        return 'shade';
      case 1:
        return 'part shade';
      case 2:
        return 'part sun';
      default:
        return 'sun';
    }
  }

  render() {
    return (
      <table style={{ width: '100%' }}>
        <tbody>
          { this.getPlantListElements() }
        </tbody>
      </table>
    );
  }
}

export default PlantMenu;
