import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Run from './Run';
import PlantMenu from './PlantMenu';

const popSize = 8;

export default class DemoContainer extends Component {

  onChange = () => {
    this.forceUpdate();
  }

  restart = () => {
    this.forceUpdate();
  }

  render() {
    return (
      <Grid container spacing={24}>
        <Grid item xs={3}>
          <div>
            <Button variant="contained" style={{ margin: '20px' }} onClick={this.restart}>
              Restart
            </Button>
          </div>
          <PlantMenu onChange={this.onChange} />
        </Grid>
        <Grid item xs={9} >
          <Run popSize={popSize} />
        </Grid>
      </Grid>
    );
  }
}
