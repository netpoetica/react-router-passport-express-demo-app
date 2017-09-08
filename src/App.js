import React from 'react'
import {
	BrowserRouter as Router,
	Route,
	Link,
	Redirect,
	withRouter
} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'

const AuthExample = () => (
	<Router>
		<div>
			<AuthButton/>
			<ul>
				<li><Link to="/public">Public Page</Link></li>
				<li><Link to="/protected">Protected Page</Link></li>
				<li><Link to="/register">Register a New User</Link></li>
			</ul>
			<Route path="/public" component={Public}/>
			<Route path="/login" component={Login}/>
			<Route path="/register" component={Register}/>
			<PrivateRoute path="/protected" component={Protected}/>
		</div>
	</Router>
)

const auth = {
	isAuthenticated: false,
	authenticate(cb) {
		// req.user on backend will contain user info if
		// this person has credentials that are valid
		fetch('/user', {
			credentials: 'include'
		})
		.then((res) => {
			this.isAuthenticated = true
			if (typeof cb === 'function') {
				cb(res.json().user);
			}
		})
		.catch((err) => {
			console.log('Error fetching authorized user.');
		});
	},
	signout(cb) {
		fetch('/logout', {
			method: 'POST',
			credentials: 'include'
		})
		.then((res) => {
			this.isAuthenticated = false; 
			if (typeof cb === 'function') {
				// user was logged out
				cb(true);
			}
		})
		.catch((err) => {
			console.log('Error logging out user.');
			if (typeof cb === 'function') {
				// user was not logged out
				cb(false);
			}
		});
	}
}

const AuthButton = withRouter(({ history }) => (
	auth.isAuthenticated ? (
		<p>
			Welcome! <button onClick={() => {
				auth.signout(() => history.push('/'))
			}}>Sign out</button>
		</p>
	) : (
		<p>You are not logged in.</p>
	)
))

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => (
		auth.isAuthenticated ? (
			<Component {...props}/>
		) : (
			<Redirect to={{
				pathname: '/login',
				state: { from: props.location }
			}}/>
		)
	)}/>
)

const Public = () => <h3>Public</h3>
const Protected = () => <h3>Protected</h3>

class Login extends React.Component {
	state = {
		redirectToReferrer: false
	}

	login = (data) => {
		console.log('Logging in ' + data.username);
		fetch('/login', {
			method: 'POST',
			body: JSON.stringify(data),
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then((response) => {
			if (response.status === 200) {
				auth.authenticate(() => {
					this.setState({ redirectToReferrer: true })
				});
			}
		})
		.catch((err) => {
			console.log('Error logging in.', err);
		});
	}

	render() {
		const { from } = this.props.location.state || { from: { pathname: '/' } }
		const { redirectToReferrer } = this.state
		
		if (redirectToReferrer) {
			return (
				<Redirect to={from}/>
			)
		}
		
		return (
			<div>
				<p>You must log in to view the page at {from.pathname}</p>
				<LoginForm onLogin={this.login} />
			</div>
		)
	}
}


class Register extends React.Component {
	state = {
		redirectToReferrer: false
	}

	register = (data) => {
		fetch('/register', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		.then((response) => {
			if (response.status === 200) {
				console.log('Succesfully registered user!');
			}
		})
		.catch((err) => {
			console.log('Error registering user.', err);
		});
	}

	render() {
		return (
			<div>
				<h1>Register a New User</h1>
				<RegisterForm onRegister={this.register} />
			</div>
		)
	}
}

export default AuthExample
