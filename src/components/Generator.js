import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/lab/Slider';

import GardenGenerator from '../js/GardenGenerator';

const styles = {
  root: {
    width: 300,
  },
  slider: {
    padding: '22px 0px',
  },
};

class Generator extends Component {
  state = {
    value: 3,
  };

  componentDidMount() {
    this.generator = new GardenGenerator();
  }

  onClick = e => {
    e.preventDefault();
    const { updateModel } = this.props;
    const model = this.generator.generate();
    updateModel(model);
  }

  render() {
    const { value } = this.state;

    return (
      <div className="Generator">
        <Button variant="contained" onClick={e => this.onClick(e)} color="">
          Generate
        </Button>
        <div className={styles.root}>
          <Slider
            classes={{ container: styles.slider }}
            value={value}
            min={0}
            max={6}
            step={1}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}

export default Generator;
