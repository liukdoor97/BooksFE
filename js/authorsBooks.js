class Author {
    Id;
    name;
    lastName;
    address;
    country;

    constructor(Id, name, lastName, address, country) {
        this.Id = Id;
        this.name = name;
        this.lastName = lastName;
        this.address = address;
        this.country = country;
    }
}

class Categories {
    Id;
    name;

    constructor(Id, name) {
        this.Id = Id;
        this.name = name;
    }
}

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

    async GetBooksByAuthorId(authorId) {
        try {
            if (!authorId) {
                throw new Error("ID di autore non fornito");
            }

            const url = `${this.basePath}/GetBooksByAuthorId/${authorId}`;
            console.log(`Richiesta URL: ${url}`);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`IMPOSSIBILE PRENDERE I LIBRI: ${response.statusText}`);
            }

            const bookData = await response.json();
            console.log("Dati dei libri:", bookData);


            const books = bookData && Array.isArray(bookData.$values) 
                ? bookData.$values 
                : [];

            console.log("Libri estratti:", books);
            return books;
        } catch (e) {
            console.error("Errore durante il recupero dei libri:", e);
            return [];
        }
    }

    async deleteBook(bookId) {
        if (!bookId) {
          console.error('ID libro non definito');
          throw new Error('ID libro non definito');
        }
    
        console.log(`Tentativo di eliminare il libro con ID: ${bookId}`);
    
        return fetch(this.basePath + `/${bookId}`, {
          method: 'DELETE'
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('LIBRO NON ELIMINATO');
            }
            return response.json();
          })
          .catch(error => {
            console.error('Errore durante l\'eliminazione del libro:', error);
            throw error;
          });
    
      }
}



// Funzione per ottenere l'ID dell'autore dalla URL
function getAuthorIdFromUrl() {
    // Recupera i parametri della URL
    const params = new URLSearchParams(window.location.search);
    
    // Controlla se il parametro 'authorId' è presente
    if (!params.has('authorId')) {
        console.error("Parametro 'authorId' non trovato nella URL");
        return null;
    }

    // Recupera il valore del parametro 'authorId'
    const authorId = params.get('authorId');

    console.log(`Categoria ID recuperato: ${authorId}`);

    // Controlla se il valore di 'authorId' è definito e non è una stringa vuota
    if (!authorId) {
        console.error("Valore del parametro 'authorId' non valido");
        return null;
    }

    return authorId;
}


async function loadAllBooks() {
    const bookService = new BookService();

    // Recupera l'ID dell'autore dalla URL
    const authorId = getAuthorIdFromUrl();

    // Se l'ID della categoria non è valido, interrompi l'esecuzione
    if (!authorId) {
        console.error("Nessun ID di autore trovato o ID non valido nei parametri URL");
        return;
    }

    console.log(`ID Autore: ${authorId}`);

    try {
        // Richiama il servizio con l'ID dell'autore
        const books = await bookService.GetBooksByAuthorId(authorId);

        console.log("Libri:", books); // Debug: Mostra i libri recuperati

        if (!Array.isArray(books)) {
            throw new TypeError("La risposta dei libri non è un array");
        }

        books.forEach((book) => {
            loadSingleBook(book); // Mostra i libri nella pagina
        });
    } catch (e) {
        console.error("Errore durante il caricamento dei libri:", e);
    }
}

// Carica i libri quando la pagina è pronta
document.addEventListener('DOMContentLoaded', loadAllBooks);

function loadSingleBook(book) {
    const listContainer = document.getElementById("book-list");

    const card = document.createElement("div");
    card.classList.add("mycard");

    const bookYear = document.createElement("div");
    bookYear.classList.add("book-year");
    bookYear.innerText = book.year;

    const bookCategory = document.createElement("div");
    bookCategory.classList.add("book-category");
    bookCategory.innerText = book.category ? book.category.name : "N/A";

    const bookTitle = document.createElement("div");
    bookTitle.classList.add("card-title");
    bookTitle.innerText = book.title;

    const eliminaButton = document.createElement("button");
    eliminaButton.classList.add("button-pers", "btn-pers");
    eliminaButton.innerText = "ELIMINA";

    card.append(bookYear, bookCategory, bookTitle, eliminaButton);
    listContainer.appendChild(card);

    const authorUp = document.getElementById("authorUp");
    authorUp.innerText = book.author ? book.author.name + ' ' +  book.author.lastName: "N/A"

    eliminaButton.addEventListener("click", () => {
        console.log(`Tentativo di eliminare il libro con ID: ${book.id}`);
    
        async function removeBook() {
          try {
            const bookService = new BookService();
            await bookService.deleteBook(book.id);
            card.remove();
            console.log(`Libro con ID ${book.id} eliminato con successo`);
          } catch (error) {
            console.error('Errore durante l\'eliminazione del libro:', error);
            alert('Errore durante l\'eliminazione del libro.');
          }
        }
    
        removeBook();
      });
}
