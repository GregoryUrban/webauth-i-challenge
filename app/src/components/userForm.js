import React, { Component } from 'react';
import axios from 'axios';

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: ''
    };
  }

  addUser = event => {
    const [name, password] = [this.state.name, this.state.password];
    event.preventDefault();
    // add code to create the User using the api
    axios
    .post('http://localhost:5000/api/register', { name, password })
    .then(res => {
      this.props.getUsers();
      this.props.history.push('/');
    })
    .catch(err => console.log(err, {message: err}));

    this.setState({
      name: '',
      password: ''
    });
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="UserForm">
        <form onSubmit={this.addUser}>
          <input
            onChange={this.handleInputChange}
            placeholder="name"
            value={this.state.name}
            name="name"
          />
            <input
            onChange={this.handleInputChange}
            placeholder="password"
            value={this.state.password}
            name="password"
          />
         
          <button type="submit">Add to the User List</button>
        </form>
      </div>
    );
  }
}

export default UserForm;