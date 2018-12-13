import React, { Component } from 'react';
import PlantsEnum from '../js/PlantsEnum';
import Checkbox from '@material-ui/core/Checkbox';

class PlantMenu extends Component {
  state = {
    unchecked: {}
  };

  getPlantListElements = () => {
    let plantListElements = null;
    if (PlantsEnum) {
      plantListElements = Object.keys(PlantsEnum).map((key, i) => {
        const plant = PlantsEnum[key];
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
                onChange={() => {
                  const { onChange } = this.props;
                  const { unchecked } = this.state;
                  const current = unchecked[key];

                  if (!current && Object.values(PlantsEnum).filter(type => !type.unchecked).length < 3) {
                    return;
                  }

                  unchecked[key] = !current ? true : false;
                  PlantsEnum[key].unchecked = unchecked[key];
                  this.setState({ unchecked });

                  if (this.changeList) {
                    clearTimeout(this.changeList);
                  }
                  this.changeList = setTimeout(() => {
                    onChange();
                  }, 2000);
                }}
                color="default"
                value={'checked' + key}
              />
            </td>
          </tr>
        );
      });
    }
    return plantListElements;
  }

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
    const plantListElements = this.getPlantListElements();

    return (
      <table style={{ width: '100%' }}>
        <tbody>
          { plantListElements }
        </tbody>
      </table>
    );
  }
}

export default PlantMenu;
