import { useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup-styles.css';

function Signup() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		const API_URL = import.meta.env.VITE_API_URL;
		e.preventDefault();
		axios
			.post(`${API_URL}/user/register`, { name, email, password })
			.then((result) => {
				console.log(result);
				console.log(result.ok);
				if (result.data.status === 'SUCCESS') {
					alert(result.data.message);
					navigate('/');
				} else {
					alert(result.data.message);
				}
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
			<div className='bg-white p-3 rounded signin-box'>
				<h2>Register</h2>
				<form onSubmit={handleSubmit}>
					<div className='mb-3'>
						<label htmlFor='name'>
							<strong>Name</strong>
						</label>
						<input
							type='text'
							placeholder='Enter Name'
							autoComplete='off'
							name='name'
							className='form-control rounded-0'
							onChange={(e) => {
								setName(e.target.value);
							}}
						/>
					</div>
					<div className='mb-3'>
						<label htmlFor='email'>
							<strong>Email</strong>
						</label>
						<input
							type='text'
							placeholder='Enter Email'
							autoComplete='off'
							name='email'
							className='form-control rounded-0'
							onChange={(e) => {
								setEmail(e.target.value);
							}}
						/>
					</div>
					<div className='mb-3'>
						<label htmlFor='password'>
							<strong>Password</strong>
						</label>
						<input
							type='text'
							placeholder='Enter Password'
							autoComplete='off'
							name='password'
							className='form-control rounded-0'
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						/>
					</div>
					<button type='submit' className='btn btn-success w-100 rounded-0'>
						Register
					</button>
				</form>
				<p>Already Have an Account?</p>
				<Link
					to='/'
					className='btn btn-default border w-100 bg-light rounded-0'
				>
					Login
				</Link>
			</div>
		</div>
	);
}

export default Signup;
