import { useState, useEffect } from 'react';
import './BookList-styles.css';

function BookList() {
	const API_URL = import.meta.env.VITE_API_URL;
	const [showPopup, setShowPopup] = useState(false);
	const [books, setBooks] = useState([]);
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [selectedBook, setSelectedBook] = useState(null);
	const [completed, setCompleted] = useState('');
	const [readPages, setReadPages] = useState('');
	const [endPage, setEndPage] = useState('');
	const [updateReadPage, setUpdateReadPage] = useState(true);
	const [showEditPages, setShowEditPages] = useState(false);

	const [filters, setFilters] = useState({
		search: '',
		author: '',
		status: 'all', // 'all' | 'completed' | 'not-completed'
		sort: 'newest', // 'newest' | 'oldest'
	});

	const filteredBooks = books
		// search by title
		.filter((book) =>
			book.title.toLowerCase().includes(filters.search.toLowerCase()),
		)

		// filter by author
		.filter((book) =>
			filters.author
				? book.author.toLowerCase().includes(filters.author.toLowerCase())
				: true,
		)

		// completed / not completed
		.filter((book) => {
			if (filters.status === 'completed') return book.completed === 'Yes';
			if (filters.status === 'not-completed') return book.completed === 'No';
			return true;
		})

		// sort
		.sort((a, b) => {
			if (filters.sort === 'author-asc') {
				return (a.author || '').toLowerCase().localeCompare(b.author || '');
			}
			if (filters.sort === 'author-desc') {
				return (b.author || '').toLowerCase().localeCompare(a.author || '');
			}
			return 0;
		});

	function handlePageCalc(selectedBook) {
		let calc =
			Math.floor(
				(selectedBook.readPages /
					(selectedBook.remainingPages || selectedBook.endPage)) *
					100,
			) + '%';

		if (parseInt(calc) >= 100) {
			selectedBook.completed = 'Yes';
			return;
		}
		return calc;
	}

	function handleShowEditPages(selectedBook) {
		const editButton = document.querySelector('.editBook');
		if (updateReadPage) {
			setShowEditPages(true);
			setUpdateReadPage(false);
			editButton.textContent = 'Submit Changes';
		} else {
			setShowEditPages(false);
			setUpdateReadPage(true);
			editButton.textContent = 'Edit Pages';
			selectedBook.readPages = readPages;
		}
	}

	function handleBookClick(book) {
		setSelectedBook(book);
	}

	function closeBookDetails() {
		setSelectedBook(null);
		setShowEditPages(false);
		setUpdateReadPage(true);
		setReadPages('');
	}

	async function deleteBook(bookId) {
		try {
			const token = localStorage.getItem('token');

			const res = await fetch(`${API_URL}/books/${bookId}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await res.json();

			if (!res.ok) {
				alert(data.message || 'Failed to delete book');
				return;
			}

			setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
			setSelectedBook(null);
		} catch (err) {
			console.log(err);
		}
	}

	function openPopup() {
		setShowPopup(true);
	}

	function closePopup() {
		setShowPopup(false);
		setTitle('');
		setAuthor('');
		setReadPages('');
		setEndPage('');
		setCompleted('');
	}

	useEffect(() => {
		const token = localStorage.getItem('token');

		fetch(`${API_URL}/books`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setBooks(data.books);
				} else {
					setBooks([]);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	async function addBook(e) {
		e.preventDefault();

		if (!title.trim()) {
			alert('Enter a title!');
			return;
		}

		if (!author) {
			alert('Enter author!');
			return;
		}

		if (completed === '') {
			alert('Check completed');
			return;
		}

		try {
			const response = await fetch(
				`${API_URL}/api/books?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`,
			);

			const data = await response.json();
			const bookInfo = data.items?.[0]?.volumeInfo;

			const newBook = {
				id: Date.now(),
				title: bookInfo?.title || title,
				author: bookInfo?.authors?.[0] || author,
				completed: completed,
				readPages: parseInt(readPages),
				remainingPages: bookInfo?.pageCount || parseInt(endPage),
				cover: bookInfo?.imageLinks?.thumbnail || '/book-placeholder2.png',
			};

			const token = localStorage.getItem('token');

			const res = await fetch(`${API_URL}/books`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(newBook),
			});

			const savedBook = await res.json();

			setBooks([savedBook, ...books]);
		} catch (err) {
			// fallback if API fails
			const newBook = {
				id: Date.now(),
				title,
				author,
				completed: completed,
				readPages: parseInt(readPages),
				remainingPages: parseInt(endPage),
				cover: '/book-placeholder2.png',
			};

			try {
				const token = localStorage.getItem('token');
				const res = await fetch(`${API_URL}/books`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(newBook),
				});
				const savedBook = await res.json();
				setBooks([savedBook, ...books]);
			} catch (serverErr) {
				console.log('Server is offline:', serverErr);
				// temporary local-only book
				setBooks([newBook, ...books]);
			}
		}

		closePopup();
	}

	return (
		<div className='booklist-page'>
			{console.log(e.target)}
			<section className='filter'>
				<input
					placeholder='Search title...'
					onChange={(e) => setFilters({ ...filters, search: e.target.value })}
				/>
				<input
					placeholder='Filter by author...'
					onChange={(e) => setFilters({ ...filters, author: e.target.value })}
				/>
				<select
					onChange={(e) => setFilters({ ...filters, status: e.target.value })}
				>
					<option value='all'>All</option>
					<option value='completed'>Completed</option>
					<option value='not-completed'>Not Completed</option>
				</select>
				<select
					onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
				>
					<option value='author-asc'>Author (A → Z)</option>
					<option value='author-desc'>Author (Z → A)</option>
				</select>
			</section>
			<section id='book-container'>
				<ul id='books'>
					{filteredBooks.map((book) => (
						<li
							key={book._id || book.id}
							className='book'
							style={{ backgroundImage: `url(${book.cover})` }}
							onClick={() => handleBookClick(book)}
						></li>
					))}

					{selectedBook && (
						<div className='popup-overlay'>
							<div className='popup-content'>
								<span className='close-btn' onClick={closeBookDetails}>
									&times;
								</span>
								<div className='bookInfo'>
									<div className='bookInfoHeader'>
										<h3>{selectedBook.title}</h3>
										<p>Author: {selectedBook.author}</p>
										<div className='pages'>
											<p>
												Completed:{' '}
												{selectedBook.completed === 'No'
													? handlePageCalc(selectedBook)
													: selectedBook.completed}
											</p>
											{showEditPages && (
												<div>
													<label for='start'>Stopping Page: </label>
													<input
														id='start'
														type='number'
														placeholder='page #'
														min={0}
														value={readPages}
														onChange={(e) =>
															setReadPages(e.target.value.trim())
														}
													/>
												</div>
											)}
										</div>
									</div>

									{selectedBook.cover && (
										<img src={selectedBook.cover} alt={selectedBook.title} />
									)}
								</div>
								<div className='buttons'>
									<button
										className='deleteBook'
										onClick={() => deleteBook(selectedBook._id)}
									>
										Delete Book
									</button>
									{selectedBook.completed == 'No' && (
										<button
											className='editBook'
											onClick={() => handleShowEditPages(selectedBook)}
										>
											Edit Pages
										</button>
									)}
								</div>
							</div>
						</div>
					)}

					<li id='add-Book' onClick={openPopup}>
						+
					</li>
				</ul>

				{showPopup && (
					<div className='popup-overlay'>
						<div className='popup-content'>
							<span className='close-btn' onClick={closePopup}>
								&times;
							</span>

							<h3>Add Book</h3>

							<form onSubmit={addBook}>
								<input
									type='text'
									placeholder='Title'
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
								<input
									type='text'
									placeholder='Author'
									value={author}
									onChange={(e) => setAuthor(e.target.value)}
								/>
								<fieldset>
									<legend>Completed:</legend>
									<div className='choices'>
										<div>
											<input
												type='radio'
												id='yes'
												name='answer'
												value='Yes'
												checked={completed === 'Yes'}
												onChange={(e) => setCompleted(e.target.value)}
											/>
											<label for='yes'>Yes</label>
										</div>

										<div>
											<input
												type='radio'
												id='no'
												name='answer'
												value='No'
												checked={completed === 'No'}
												onChange={(e) => setCompleted(e.target.value)}
											/>
											<label for='no'>No</label>
										</div>
									</div>
								</fieldset>
								{completed === 'No' && (
									<div className='pages'>
										<div>
											<label for='start'>Pages Read: </label>
											<input
												id='start'
												type='number'
												placeholder='page #'
												min={0}
												value={readPages}
												onChange={(e) => setReadPages(e.target.value.trim())}
											/>
										</div>
										<div>
											<label for='end'>Pages Left: </label>
											<input
												id='end'
												type='number'
												placeholder='page #'
												min={0}
												value={endPage}
												onChange={(e) => setEndPage(e.target.value.trim())}
											/>
										</div>
									</div>
								)}
								<button type='submit' id='submit-book'>
									Add Book
								</button>
							</form>
						</div>
					</div>
				)}
			</section>
		</div>
	);
}

export default BookList;
