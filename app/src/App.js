import React from 'react';
import ReactDom from 'react-dom';
// import ReactScripts from 'react-scripts';

import './App.css';
import cors from "cors"
import Users from '../../index'

class App extends React.Component {
constructor() {
  super()
  this.state = {
    Users: []
  }
}

  render() {

    return (
      <div className="App">
        <h1>Cmon Users Page!</h1>
          <Users />
      </div>
    );
  }
}

export default App;
