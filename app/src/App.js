import React from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';

import './App.css';
import Users from './components/users.js';
// import ErrorBoundary from './components/errorBoundary.js'
import UserForm from './components/userForm.js'


class App extends React.Component {
constructor() {
  super()
  this.state = {
    users: []
  }
}


componentDidMount(){
  this.getUsers();
}
getUsers = () => {
    axios
    .get('http://localhost:5000/api/users')
    .then(res => this.setState({ users: res.data }))
    .catch(err => console.log(err,{message: err}));
}
deleteUser = id => {
  axios.delete(`http://localhost:5000/api/users/${id}`)
    .then(res => this.setState({ users: res.data }))
    .catch(err => console.log(err));
}
updateUser = (id, info) => {
  axios.put(`http://localhost:5000/api/users/${id}`, info)
    .then(res => this.setState({ users: res.data }))
    .catch(err => console.log(err));
}
render() {
  return (
    <div className="App">
     
      <Route 
        exact path="/"
        render={props => 
            <Users 
              {...props} 
              users={this.state.users} 
              deleteUser={this.deleteUser} 
              updateUser={this.updateUser}
              />
        }
        />
  <Route path="/register"
    render={props => 
    <UserForm {...props} getUsers={this.getUsers} />
    }
  
  
  />

    </div>
  );
}
}

export default App;
