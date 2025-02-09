import React, { Component } from 'react';
import logo from './maxwell.webp';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Cat Distribution System (CDS) Here. You've been granted a Cat!</h1>
        </header>
        <div className="App-intro">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
      </div>
    );
  }
}

export default App;
