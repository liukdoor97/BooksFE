const CreaButton = document.getElementById("CreaButton");
const formAuthor = document.getElementById("formAuthor");

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
            const response = await fetch(this.basePath);
            if (!response.ok) {
                throw new Error("IMPOSSIBLE TO FETCH AUTHORS");
            }
            return response.json();
        } catch (e) {
            showError("Errore nel recupero degli autori: " + e.message);
            return [];
        }
    }

    async getAuthor(Id) {
        try {
            if (typeof Id !== "number") {
                throw new Error("NON È UN ID VALIDO");
            }

            const response = await fetch(`${this.basePath}/${Id}`);
            if (!response.ok) {
                throw new Error("IMPOSSIBLE TO FETCH AUTHOR");
            }
            return response.json();
        } catch (e) {
            showError("Errore nel recupero dell'autore: " + e.message);
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
                throw new Error("IMPOSSIBLE TO CREATE AUTHOR");
            }

            showSuccess("Autore inserito con successo");
            return await response.json();
        } catch (e) {
            showError("Errore durante la creazione dell'autore: " + e.message);
            console.error(e);
        }
    }

    async deleteAuthor(authorsId) {
        try {
            const response = await fetch(`${this.basePath}/${authorsId}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("AUTHOR NOT DELETED");
            }

            showSuccess("Autore eliminato con successo");
            return await response.json();
        } catch (e) {
            showError("Errore durante l'eliminazione dell'autore: " + e.message);
            console.error(e);
        }
    }
}

function getAuthorFromFormData(rawName, rawlastName, rawAddress, rawCountry) {
    if (!rawName || !rawName.trim()) {
        showError("Nome non valido");
        throw new Error("NOME NON PRESENTE");
    }
    if (!rawlastName || !rawlastName.trim()) {
        showError("Cognome non valido");
        throw new Error("COGNOME NON PRESENTE");
    }
    if (!rawAddress || !rawAddress.trim()) {
        showError("Indirizzo non valido");
        throw new Error("INDIRIZZO NON PRESENTE");
    }
    if (!rawCountry || !rawCountry.trim()) {
        showError("Paese non valido");
        throw new Error("PAESE NON PRESENTE");
    }

    return new Authors(undefined, rawName, rawlastName, rawAddress, rawCountry);
}

CreaButton.addEventListener("click", async () => {
    let authorService = new AuthorService();

    const rawName = formAuthor.elements["name"]?.value;
    const rawlastName = formAuthor.elements["lastName"]?.value;
    const rawAddress = formAuthor.elements["address"]?.value;
    const rawCountry = formAuthor.elements["country"]?.value;

    try {
        await authorService.createAuthor(getAuthorFromFormData(rawName, rawlastName, rawAddress, rawCountry));
    } catch (e) {
        showError("Errore durante la creazione dell'autore: " + e.message);
    }
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
