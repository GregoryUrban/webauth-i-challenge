import React, {Component} from 'react'
import axios from 'axios'

class LogIn extends Component {
    state = {
        credentials: {
            username: '',
            password: ''
        }
    }

    handleChange = event => {
        this.setState({
            credentials: {
                ...this.state.credentials,
                [event.target.name] : event.target.value
            }
        })
    }

    login = event => {
        event.preventDefault()

        axios
            .post( 'http://localhost:5000/api/auth/login', this.state.credentials)
            .then( res => {
                // this.props.getUsers();
                localStorage.setItem('session', res.data.session)
                this.props.history.push('/')
            })
            
            .catch( err => {
                console.log(err, {message: 'Cant login!'})
            })
    }


    render() {
        return (
            <>
                <h1>Log In</h1>

                <form onSubmit={this.login}>
                    <input
                        type='string'
                        name='username'
                        placeholder='Username'
                        value={this.state.credentials.username}
                        onChange={this.handleChange}
                    />
                
                    <input 
                        type='password'
                        name='password'
                        placeholder='Password'
                        value={this.state.credentials.password}
                        onChange={this.handleChange}
                    /> 
                 
                    <button> Log In </button>
                </form>
            </>
        )
    }
    
}

export default LogIn