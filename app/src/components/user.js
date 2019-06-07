import React from 'react';

class User extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        editing: false,
        // nameInput: this.props.username,
        users: []
    };
  }
  handleUpdate = e => {
    this.setState({ [e.target.username]: e.target.value });
  }
  initializeUpdate = e => {
    e.preventDefault();
    const [username] = [this.state.nameInput];
    this.setState({ editing: false });
    this.props.updateUser(this.props.id, { username });
  }
  render(){
    return this.state.editing 
      ? (
        <form onSubmit={this.initializeUpdate} className="update-form">
          <button  onClick={() => this.setState({ editing: false })}>Cancel</button>
          <input 
            placeholder="username"
            onChange={this.handleUpdate}
            username="nameInput"
            value={this.state.nameInput}
          />
         
          <button>Submit</button>

        </form>
      )
      : (
      <div className="User">
        <button className="edit"onClick={() => this.setState({ editing: true })}>Edit</button>
        <h3>I'm {this.props.user}</h3>
        <h5>ID: {this.props.id}</h5>
        {/* <p>I'm {this.props.age} User years old</p> */}
        <button className="delete" onClick={() => this.props.deleteUser(this.props.id)}>Delete User</button>
      </div>
    );
  }
}

User.defaultProps = {
    username: ''
};

export default User;