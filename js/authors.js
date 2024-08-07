class Authors {
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

class AuthorService {
    basePath = "http://localhost:5055/api/Author";

    async getAuthors() {
        try {
            const response = await fetch(this.basePath, {
            });

            const authorData = await response.json();
            const authors = authorData.$values;

            if (!response.ok) {
                throw new Error("IMPOSSILE PRENDERE GLI AUTORI");
            }

            return authors;
        } catch (e) {
            return [];
        }
    }

    async getAuthor(Id) {
        try {
            if (typeof Id !== "number") {
                throw new Error("NON È UN ID VALIDO");
            }

            const response = await fetch(this.basePath + `/${Id}`, {
            });

            if (!response.ok) {
                throw new Error("IMPOSSILE PRENDERE L'AUTORE");
            }

            return response.json();
        } catch (e) {
            return null;
        }
    }

    async createAuthor(author) {
        if (!(author instanceof Authors)) {
            throw new Error("PARAMETRO NON VALIDO");
        }

        try {
            const response = await fetch(this.basePath, {
                method: 'POST',
                body: JSON.stringify(author),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json',
                }

            });

            if (!response.ok) {
                throw new Error("IMPOSSILE GENERARE L'AUTORE");
            }

            return await response.json();
        } catch (e) {
            console.error(e);
        }

    }

    async deleteAuthor(authorsId) {
        try {
            const response = await fetch(this.basePath + `/${authorsId}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error("AUTORE NON ELIMINATO");
            }

            return await response.json();
        } catch (e) {
            console.error(e);
        }
    }

}



async function loadAllAuthors() {
    const authorService = new AuthorService();

    const authors = await authorService.getAuthors();

    console.log(authors);

    authors.forEach((value, index, array) => {
        loadSingleAuthor(value);
    });
}

function loadSingleAuthor(author) {
    const listContainer = document.getElementById("author-list");

    const card = document.createElement("div");
    card.classList.add("mycard");

    const authorTitle = document.createElement("div");
    authorTitle.classList.add("card-title");
    authorTitle.innerText = author.name + ' ' + author.lastName;

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("d-flex", "gap-3", "justify-content-end");

    const eliminaButton = document.createElement("button");
    eliminaButton.classList.add("button-pers", "btn-pers");
    eliminaButton.innerText = "ELIMINA";

    const libriButtonHref = document.createElement("a");
    libriButtonHref.href = `/Views/lists/authorsBooks.html?authorId=${author.id}`;
    libriButtonHref.classList.add("button-pers", "btn-pers");
    libriButtonHref.innerText = "LIBRI";

    buttonsContainer.append(eliminaButton, libriButtonHref);

    card.append(authorTitle, buttonsContainer);

    listContainer.appendChild(card);

    eliminaButton.addEventListener("click", () => {
        console.log(`Tentativo di eliminare l'autore con ID: ${author.Id}`);

        async function removeAuthor() {
            try {
                const authorService = new AuthorService();
                await authorService.deleteAuthor(author.id);
                card.remove();
                console.log(`Autore con ID ${author.id} eliminato con successo`);
            } catch (error) {
                console.error('Errore durante l\'eliminazione dell\' autore:', error);
                alert('Errore durante l\'eliminazione dell\' autore.');
            }
        }

        removeAuthor();
    });
}

loadAllAuthors();
