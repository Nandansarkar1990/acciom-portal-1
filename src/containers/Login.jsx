import React, { Component } from "react";
import { connect } from 'react-redux';
import { Row, Button, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
// import { isEmail, isEmpty, isLength, isContainWhiteSpace } from '../shared/validator';
 
import './login.scss';
import styled from 'styled-components';

// import { loginToPortal } from '../middleware';

// const FormContainer = styled.div`

// `;

class Login extends Component {

	constructor(props) {
		super(props);

		this.state = {
			formData: {}, // Contains login form data
			errors: {}, // Contains login field errors
			formSubmitted: false, // Indicates submit status of login form 
			loading: false // Indicates in progress state of login form
		}
	}

	handleInputChange = ({target}) => {
		const value = target.value;
		const name = target.name;

		const { formData } = this.state;
		formData[name] = value;

		this.setState({
			formData: formData
		});
	}

	validateLoginForm = (e) => {
		
		let errors = {};
		const { formData } = this.state;

		if (isEmpty(formData.email)) {
			errors.email = "Email can't be blank";
		} else if (!isEmail(formData.email)) {
			errors.email = "Please enter a valid email";
		}

		if (isEmpty(formData.password)) {
			errors.password = "Password can't be blank";
		}  else if (isContainWhiteSpace(formData.password)) {
			errors.password = "Password should not contain white spaces";
		} else if (!isLength(formData.password, { gte: 6, lte: 16, trim: true })) {
			errors.password = "Password's length must between 6 to 16";
		}

		if (isEmpty(errors)) {
			console.log(this.props);
			this.props.loginToPortal({})
			return true;
		} else {
			return errors;
		}    
	}

	login = (e) => {		
		e.preventDefault();
		const errors = this.validateLoginForm();

		if(errors === true){
			// alert("You are successfully signed in...");
			window.location.reload();
		} else {
			this.setState({
				errors,
				formSubmitted: true
			});
		}
	}

	render() {

		const { errors, formSubmitted } = this.state;

		return (
			<div className="Login">
				<Row>
					Login form 
					<form onSubmit={this.login}>
						<FormGroup controlId="email" validationState={ formSubmitted ? (errors.email ? 'error' : 'success') : null }>
							<ControlLabel>Email</ControlLabel>
							<FormControl type="text" name="email" placeholder="Enter your email" onChange={this.handleInputChange} />
							{ errors.email && 
								<HelpBlock>{errors.email}</HelpBlock> 
							}
						</FormGroup >
						<FormGroup controlId="password" validationState={ formSubmitted ? (errors.password ? 'error' : 'success') : null }>
							<ControlLabel>Password</ControlLabel>
							<FormControl type="password" name="password" placeholder="Enter your password" onChange={this.handleInputChange} />
							{ errors.password && 
								<HelpBlock>{errors.password}</HelpBlock> 
							}
						</FormGroup>
						<Button type="submit" bsStyle="primary">Sign-In</Button>
					</form>
				</Row>
			</div>
		)
	}
}

// const mapStateToProps = function (state) {
// 	console.log("Login.state", state);
// 	return {
// 		loginData: state.`loginData`
// 	}
// };

// export default connect(mapStateToProps, {
// 	loginToPortal
//   })(Login);

export default Login;