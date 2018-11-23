import React, { Component } from 'react';
import './App.css';
import Grid from '@material-ui/core/Grid';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import PlantMenu from './components/PlantMenu';
import Display2D from './components/Display2D';
import Display3D from './components/Display3D';
import Generator from './components/Generator';
import PlantsEnum from './js/PlantsEnum';

const theme = createMuiTheme();

class App extends Component {
  state = {
    model: {
      plants: [
        {
          pos: [{
            x: 200,
            y: 200
          }],
          type: PlantsEnum.SITKA_SPRUCE,
          count: 1
        }
      ]
    }
  }

  updateModel = (model) => {
    this.setState({
      model
    });
  }

  render() {
    const { model } = this.state;
    return (
      <div className="App">
        <MuiThemeProvider theme={theme}>
          <header className="App-header">
            <h1>Garden Generator</h1>
          </header>
          <div>
            <Grid container spacing={24}>
              <Grid item xs={3}>
                <PlantMenu />
              </Grid>
              <Grid item xs={6}>
                <Display2D model={model} />
                <Display3D model={model} />
              </Grid>
              <Grid item xs={3}>
                <Generator updateModel={this.updateModel} />
              </Grid>
            </Grid>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
