import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';

export default class Simulators extends Component {
  render() {
    const { popSize } = this.props;

    const simulatorElements = [];
    for (let i = 0; i < popSize; i += 1) {
      simulatorElements.push((
        <Grid item xs={6}>
          <div style={{ position: 'relative', width: '244px', height: '191px', margin: '5px 0' }}>
            <div key={i} id={'simulation' + i}></div>
            <canvas id={'fitness' + i} width={244} height={191}
              style={{ background: 'transparent', position: 'absolute',  top: 0, left: 0 }} />
          </div>
        </Grid>
      ));
    }

    return (
      <Grid container spacing={0} >
        { simulatorElements }
      </Grid>
    );
  }
}
