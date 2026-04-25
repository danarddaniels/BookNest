import { useState } from 'react';
import { Link } from 'react-router';

import { useNavigate } from 'react-router-dom';
import './Login-styles.css';

function Login() {
	const API_URL = import.meta.env.VITE_API_URL;
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const API_URL = import.meta.env.VITE_API_URL;

		try {
			const response = await fetch(`${API_URL}/user/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const result = await response.json();

			if (result.success) {
				localStorage.setItem('token', result.token);
				navigate('/home');
			} else {
				alert(result.message);
			}
		} catch (err) {
			console.log(err);
			alert('Login failed');
		}
	};
	return (
		<div>
			<div className='d-flex justify-content-center align-items-center bg-secondary vh-100 body'>
				<h1>
					Welcome to Book Nest!
					<br /> <span>Your personal book-tracking app</span>{' '}
				</h1>
				<div className='bg-white p-3 rounded login-box'>
					<h2>Login</h2>
					<p>Please enter username and password:</p>
					<p>You can also enter the provided email and password or Sign up!</p>
					<form onSubmit={handleSubmit}>
						<div className='mb-3'>
							<label htmlFor='email'>
								<strong>Email</strong>
							</label>
							<input
								type='text'
								placeholder='example@example.com'
								autoComplete='off'
								name='email'
								className='form-control rounded-0'
								onChange={(e) => {
									setEmail(e.target.value.toLowerCase());
								}}
							/>
						</div>
						<div className='mb-3'>
							<label htmlFor='password'>
								<strong>Password</strong>
							</label>
							<input
								type='text'
								placeholder='test1234'
								autoComplete='off'
								name='password'
								className='form-control rounded-0'
								onChange={(e) => {
									setPassword(e.target.value);
								}}
							/>
						</div>
						<button type='submit' className='btn btn-success w-100 rounded-0'>
							Login
						</button>
					</form>
					<p>Don't Have an Account?</p>
					<Link
						to='/register'
						className='btn btn-default border w-100 bg-light rounded-0'
					>
						Sign Up
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Login;
