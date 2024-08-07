const CreaButton = document.getElementById("CreaButton");
const formBook = document.getElementById("formBook");

class Books {
    Id;
    title;
    year;
    categoryId;
    authorId;
    publisherId;

    constructor(Id, title, year, categoryId, authorId, publisherId) {
        this.Id = Id;
        this.title = title;
        this.year = year;
        this.categoryId = categoryId;
        this.authorId = authorId;
        this.publisherId = publisherId;
    }
}

class BookService {
    basePath = "http://localhost:5055/api/Book";

    async getBooks() {
        try {
            const response = await fetch(this.basePath);
            if (!response.ok) {
                throw new Error("IMPOSSIBLE TO FETCH BOOKS");
            }
            return response.json();
        } catch (e) {
            showError("Errore nel recupero dei libri: " + e.message);
            return [];
        }
    }

    async getBook(Id) {
        try {
            if (typeof Id !== "number") {
                throw new Error("INVALID ID");
            }

            const response = await fetch(`${this.basePath}/${Id}`);
            if (!response.ok) {
                throw new Error("IMPOSSIBLE TO FETCH BOOK");
            }
            return response.json();
        } catch (e) {
            showError("Errore nel recupero del libro: " + e.message);
            return null;
        }
    }

    async createBook(book) {
        if (!(book instanceof Books)) {
            throw new Error("INVALID PARAMETER");
        }

        try {
            const response = await fetch(this.basePath, {
                method: 'POST',
                body: JSON.stringify(book),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error("IMPOSSIBLE TO CREATE BOOK");
            }

            showSuccess("Libro inserito con successo");
            return await response.json();
        } catch (e) {
            showError("Errore durante la creazione del libro: " + e.message);
            console.error(e);
        }
    }

    async deleteBook(bookId) {
        try {
            const response = await fetch(`${this.basePath}/${bookId}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("BOOK NOT DELETED");
            }

            showSuccess("Libro eliminato con successo");
            return await response.json();
        } catch (e) {
            showError("Errore durante l'eliminazione del libro: " + e.message);
            console.error(e);
        }
    }
}

function getBookFromFormData(rawTitle, rawYear, rawCategoryId, rawAuthorId, rawPublisherId) {
    if (!rawTitle || !rawTitle.trim()) {
        showError("Titolo non valido");
        throw new Error("TITOLO NON PRESENTE");
    }
    if (!rawYear) {
        showError("Anno non valido");
        throw new Error("ANNO NON PRESENTE");
    }
    if (!rawCategoryId || !rawCategoryId.trim()) {
        showError("ID Categoria non valido");
        throw new Error("CATEGORY ID NON PRESENTE");
    }
    if (!rawAuthorId || !rawAuthorId.trim()) {
        showError("ID Autore non valido");
        throw new Error("AUTHOR ID NON PRESENTE");
    }
    if (!rawPublisherId || !rawPublisherId.trim()) {
        showError("ID Casa Editrice non valido");
        throw new Error("PUBLISHER ID NON PRESENTE");
    }

    if (rawYear.includes(".")) {
        showError("Anno non valido per numero decimale");
        throw new Error("ANNO NON VALIDO PER NUMERO DECIMALE");
    }
    if (rawCategoryId.includes(".")) {
        showError("ID Categoria non valido per numero decimale");
        throw new Error("CATEGORY ID NON VALIDO PER NUMERO DECIMALE");
    }
    if (rawAuthorId.includes(".")) {
        showError("ID Autore non valido per numero decimale");
        throw new Error("AUTHOR ID NON VALIDO PER NUMERO DECIMALE");
    }
    if (rawPublisherId.includes(".")) {
        showError("ID Casa Editrice non valido per numero decimale");
        throw new Error("PUBLISHER ID NON VALIDO PER NUMERO DECIMALE");
    }

    const year = Number(rawYear);
    const categoryId = Number(rawCategoryId);
    const authorId = Number(rawAuthorId);
    const publisherId = Number(rawPublisherId);

    if (isNaN(year) || year < 0) {
        showError("Anno non valido");
        throw new Error("ANNO NON VALIDO");
    }
    if (isNaN(categoryId) || categoryId < 0) {
        showError("ID Categoria non valido");
        throw new Error("CATEGORY ID NON VALIDO");
    }
    if (isNaN(authorId) || authorId < 0) {
        showError("ID Autore non valido");
        throw new Error("AUTHOR ID NON VALIDO");
    }
    if (isNaN(publisherId) || publisherId < 0) {
        showError("ID Casa Editrice non valido");
        throw new Error("PUBLISHER ID NON VALIDO");
    }

    return new Books(undefined, rawTitle, year, categoryId, authorId, publisherId);
}

CreaButton.addEventListener("click", async () => {
    let bookService = new BookService();

    const rawTitle = formBook.elements["title"]?.value;
    const rawYear = formBook.elements["year"]?.value;
    const rawCategoryId = formBook.elements["category"]?.value;
    const rawAuthorId = formBook.elements["author"]?.value;
    const rawPublisherId = formBook.elements["publisher"]?.value;

    try {
        await bookService.createBook(getBookFromFormData(rawTitle, rawYear, rawCategoryId, rawAuthorId, rawPublisherId));
    } catch (e) {
        showError("Errore durante la creazione del libro: " + e.message);
    }
});

// Funzione per popolare le dropdown list
async function populateDropdowns() {
    try {
        // Popolamento delle categorie
        const categoryResponse = await fetch('http://localhost:5055/api/Category');
        if (!categoryResponse.ok) {
            throw new Error(`HTTP error! Status: ${categoryResponse.status}`);
        }
        const categoryData = await categoryResponse.json();
        const categories = categoryData.$values;
        if (!Array.isArray(categories)) {
            throw new TypeError('Expected an array of categories');
        }
        const categorySelect = document.getElementById('category');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            option.classList.add("form-control");
            categorySelect.appendChild(option);
        });

        // Popolamento degli autori
        const authorResponse = await fetch('http://localhost:5055/api/Author');
        if (!authorResponse.ok) {
            throw new Error(`HTTP error! Status: ${authorResponse.status}`);
        }
        const authorData = await authorResponse.json();
        const authors = authorData.$values;
        if (!Array.isArray(authors)) {
            throw new TypeError('Expected an array of authors');
        }
        const authorSelect = document.getElementById('author');
        authors.forEach(author => {
            const option = document.createElement('option');
            option.classList.add("form-control");
            option.value = author.id;
            option.textContent = `${author.name} ${author.lastName}`;
            authorSelect.appendChild(option);
        });

        // Popolamento delle case editrici
        const publisherResponse = await fetch('http://localhost:5055/api/Publisher');
        if (!publisherResponse.ok) {
            throw new Error(`HTTP error! Status: ${publisherResponse.status}`);
        }
        const publisherData = await publisherResponse.json();
        const publishers = publisherData.$values;
        if (!Array.isArray(publishers)) {
            throw new TypeError('Expected an array of publishers');
        }
        const publisherSelect = document.getElementById('publisher');
        publishers.forEach(publisher => {
            const option = document.createElement('option');
            option.classList.add("form-control");
            option.value = publisher.id;
            option.textContent = publisher.name;
            publisherSelect.appendChild(option);
        });
    } catch (error) {
        showError('Errore nel recupero dei dati: ' + error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    populateDropdowns();
});

// Funzione per mostrare il modale di successo
function showSuccess(message) {
    document.getElementById('success-message').innerText = message;
    document.getElementById('success-modal').style.display = 'block';
}

// Funzione per mostrare il modale di errore
function showError(message) {
    document.getElementById('error-message').innerText = message;
    document.getElementById('error-modal').style.display = 'block';
}

// Funzione per chiudere il modale
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Funzione per gestire la chiusura dei modali
function handleCloseButtonClick(event) {
    const modalId = event.target.getAttribute('data-modal');
    if (modalId) {
        closeModal(modalId);
    }
}

// Funzione per gestire la chiusura dei modali cliccando fuori dal contenuto
function handleWindowClick(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Aggiungi event listeners ai pulsanti di chiusura
document.querySelectorAll('.close').forEach(button => {
    button.addEventListener('click', handleCloseButtonClick);
});

// Aggiungi event listener per chiudere il modale cliccando fuori dal contenuto
window.addEventListener('click', handleWindowClick);
