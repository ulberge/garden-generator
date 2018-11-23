import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/lab/Slider';
import LinearProgress from '@material-ui/core/LinearProgress';

import GardenGenerator from '../js/GardenGenerator';

const styles = {
  container: {
    //margin: '10px 20px',
  },
  root: {
    display: 'flex',
    height: '60px',
    justifyContent: 'center'
  },
  sliderRoot: {
    width: '0',
    display: 'inline-block',
    margin: '0 5%'
  },
  slider: {
    //padding: '0px 10px',
  },
  buttons: {
    margin: '0px auto',
    maxWidth: '200px',
    textAlign: 'center'
  },
  progress: {
    margin: '20px',
    height: '10px'
  }
};

const swatch = (color) => {
  return {
    marginLeft: '-9px',
    marginBottom: '20px',
    width: '18px',
    height: '18px',
    background: color
  };
};

const colors = [
  { key: 'green', hex: '#4EAF68' },
  { key: 'darkGreen', hex: '#226233' },
  { key: 'red', hex: '#AF4E51' },
  { key: 'yellow', hex: '#FBE564' },
  { key: 'purple', hex: '#8C66BC' },
];

class Generator extends Component {
  state = {
    colors: {},
    running: false
  };

  componentDidMount() {
    this.generator = new GardenGenerator();
    const newState = {
      colors: {}
    };
    colors.forEach(color => newState.colors[color.key] = 50);
    this.setState(newState);
  }

  start = e => {
    e.preventDefault();
    this.generate();
  }

  generate = e => {
    const { updateModel } = this.props;
    const { colors } = this.state;
    const model = this.generator.generate(colors);
    updateModel(model);

    // Recursively call generate until cleared
    this.startTimeout = setTimeout(() => this.generate(), 2000);
    this.setState({
      running: true
    });
  }

  stop = e => {
    e.preventDefault();
    clearTimeout(this.startTimeout);
    this.setState({
      running: false
    });
  }

  handleChange = (event, value, key) => {
    const colors = this.state.colors;
    colors[key] = value;
    this.setState({ colors: colors });
  }

  render() {
    const colorSliders = colors.map(color => {
      const { key, hex } = color;
      const value = this.state.colors[key];
      if (value === undefined) {
        return null;
      }

      return (
        <div key={key} style={styles.sliderRoot}>
          <div style={swatch(hex)}/>
          <Slider
            style={styles.sliderRoot}
            value={value}
            id={key}
            aria-labelledby="label"
            onChange={(e, v) => this.handleChange(e, v, key)}
            vertical
          />
        </div>
      )
    });

    const { running } = this.state;

    return (
      <div className="Generator" style={styles.container}>
        <div style={styles.buttons}>
          <Button variant="contained" style={{ marginRight: '20px' }} onClick={e => this.start(e)}>
            Generate
          </Button>
          <Button variant="contained" onClick={e => this.stop(e)}>
            Stop
          </Button>
          { running ? <LinearProgress color="primary" style={styles.progress}/> : null }
        </div>
        <h3>Color</h3>
        <div style={styles.root}>
          {colorSliders}
        </div>
      </div>
    );
  }
}

export default Generator;
