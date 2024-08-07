class BookService {
  basePath = "http://localhost:5055/api/Book";

  async getBooks() {
    try {
      const response = await fetch(this.basePath);

      if (!response.ok) {
        throw new Error("IMPOSSILE PRENDERE I LIBRI");
      }

      const bookData = await response.json();
      const books = bookData.$values;

      return books;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async getBook(Id) {
    try {
      if (typeof Id !== "number") {
        throw new Error("NON È UN ID VALIDO");
      }

      const response = await fetch(this.basePath + `/${Id}`);

      if (!response.ok) {
        throw new Error("IMPOSSILE PRENDERE IL LIBRO");
      }

      return response.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async createBook(book) {
    if (!(book instanceof Books)) {
      throw new Error("PARAMETRO NON VALIDO");
    }

    try {
      const response = await fetch(this.basePath, {
        method: "POST",
        body: JSON.stringify(book),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error("IMPOSSILE GENERARE IL LIBRO");
      }

      return await response.json();
    } catch (e) {
      console.error(e);
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

async function fetchAdditionalData() {
  const [categories, authors, publishers] = await Promise.all([
    fetch("http://localhost:5055/api/Category").then(res => res.json()),
  ]);

  const data = {};
  categories.$values.forEach(c => data[c.$id] = c);

  console.log('Dati aggiuntivi:', data);

  return data;
}

function resolveReference(ref, data) {
  if (ref && ref.$ref) {
    return resolveReference(data[ref.$ref], data);
  }
  return ref;
}
async function loadAllBooks() {
  const bookService = new BookService();
  
  const books = await bookService.getBooks();
  
  const allData = await fetchAdditionalData();
  
  console.log('Libri:', books);
  
  books.forEach((value, index, array) => {
    console.log('Prima di risolvere i riferimenti:', value);

    value.category = resolveReference(value.category, allData);
    value.author = resolveReference(value.author, allData);
    value.publisher = resolveReference(value.publisher, allData);

    console.log('Dopo aver risolto i riferimenti:', value);
    
    loadSingleBook(value);
  });
}

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

document.addEventListener('DOMContentLoaded', loadAllBooks);
