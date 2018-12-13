import React, { Component } from 'react';
import './App.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Population from './components/Population';
import Demo from './components/Demo';

const theme = createMuiTheme();

class App extends Component {

  render() {
    return (
      <div className="App">
        <MuiThemeProvider theme={theme}>
          <header className="App-header">
            <h2 style={{ marginTop: '30px' }}>Garden Generator by Erik Ulberg</h2>
          </header>
          <div>
            <Demo />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
