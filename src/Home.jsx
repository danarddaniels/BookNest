import { Link } from 'react-router-dom';
import './Home-styles.css';
import BookList from './BookList';

function Home() {
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
							<Link to='/'>Logout</Link>
						</li>
					</ul>
				</nav>
			</header>
			<BookList />
		</div>
	);
}

export default Home;
