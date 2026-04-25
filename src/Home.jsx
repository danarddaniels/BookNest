import { Link, useNavigate } from 'react-router-dom';
import './Home-styles.css';
import BookList from './BookList';

function Home() {
	const navigate = useNavigate();
	const handleLogout = () => {
		localStorage.removeItem('token');
		navigate('/');
	};

	return (
		<div>
			<header>
				<h1>BookNest</h1>
				<nav>
					<ul>
						<li>
							<Link to='/home'>Home</Link>
						</li>
						<li>
							<Link to='/home'>Wishlist</Link>
						</li>
						<li>
							<Link to='/' onClick={handleLogout}>Logout</Link>
						</li>
					</ul>
				</nav>
			</header>
			<BookList />
		</div>
	);
}

export default Home;
