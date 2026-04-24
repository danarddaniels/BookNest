import { useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login-styles.css';
function Login() {
	const API_URL = import.meta.env.VITE_API_URL;
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const result = await axios.post(`${API_URL}/user/login`, {
				email,
				password
			});

			if (result.data.success) {
				navigate('/home');
			}
		} catch (err) {
			alert(err.response?.data?.message || 'Login failed');
		}
	};
	return (
		<div>
			<div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
				<div className='bg-white p-3 rounded login-box'>
					<h2>Login</h2>
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
