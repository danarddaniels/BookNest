import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route path='/register' element={<Signup />}></Route>
					<Route path='/' element={<Login />}></Route>
					<Route path='/home' element={<Home />}></Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
//npm run dev
