import { useState } from 'react';
import './BookList-styles.css';

function BookList() {
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


	function handlePageCalc(selectedBook) {
		let calc = Math.floor(
				(selectedBook.readPages /
					(selectedBook.remainingPages || selectedBook.endPage)) *
					100,
			) + '%';

		if(parseInt(calc)>= 100){
			selectedBook.completed = "Yes"
			return
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

	function deleteBook(bookId) {
		setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
		setSelectedBook(null);
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
		// editButton.textContent = 'Edit Pages';
	}

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
				`http://localhost:3000/api/books?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`,
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
				cover:
					bookInfo?.imageLinks?.thumbnail ||
					'./src/assets/book-placeholder2.png',
			};
			setBooks([newBook, ...books]);
		} catch (err) {
			// fallback if API fails
			const newBook = {
				id: Date.now(),
				title,
				author,
				completed: completed,
				readPages: parseInt(readPages),
				remainingPages: parseInt(endPage),
				cover: './src/assets/book-placeholder2.png',
			};

			setBooks([newBook, ...books]);
		}

		closePopup();
	}

	return (
		<div className='booklist-page'>
			<section id='book-container'>
				<ul id='books'>
					{books.map((book) => (
						<li
							key={book.id}
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
										class='deleteBook'
										onClick={() => deleteBook(selectedBook.id)}
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
