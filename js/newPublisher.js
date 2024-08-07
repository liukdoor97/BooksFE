const CreaButton = document.getElementById("CreaButton");
const formPublisher = document.getElementById("formPublisher");

class Publishers {
    Id;
    name;
    address;
    country;

    constructor(Id, name, address, country) {
        this.Id = Id;
        this.name = name;
        this.address = address;
        this.country = country;
    }
}

class PublisherService {
    basePath = "http://localhost:5055/api/Publisher";

    async getPublishers() {
        try {
            const response = await fetch(this.basePath);
            if (!response.ok) {
                throw new Error("IMPOSSIBLE TO FETCH PUBLISHERS");
            }
            return response.json();
        } catch (e) {
            showError("Errore nel recupero delle case editrici: " + e.message);
            return [];
        }
    }

    async getPublisher(Id) {
        try {
            if (typeof Id !== "number") {
                throw new Error("NON È UN ID VALIDO");
            }

            const response = await fetch(`${this.basePath}/${Id}`);
            if (!response.ok) {
                throw new Error("IMPOSSIBLE TO FETCH PUBLISHER");
            }
            return response.json();
        } catch (e) {
            showError("Errore nel recupero della casa editrice: " + e.message);
            return null;
        }
    }

    async createPublisher(publisher) {
        if (!(publisher instanceof Publishers)) {
            throw new Error("PARAMETRO NON VALIDO");
        }

        try {
            const response = await fetch(this.basePath, {
                method: 'POST',
                body: JSON.stringify(publisher),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error("IMPOSSIBLE TO CREATE PUBLISHER");
            }

            showSuccess("Casa editrice inserita con successo");
            return await response.json();
        } catch (e) {
            showError("Errore durante la creazione della casa editrice: " + e.message);
            console.error(e);
        }
    }

    async deletePublisher(publisherId) {
        try {
            const response = await fetch(`${this.basePath}/${publisherId}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("PUBLISHER NOT DELETED");
            }

            showSuccess("Casa editrice eliminata con successo");
            return await response.json();
        } catch (e) {
            showError("Errore durante l'eliminazione della casa editrice: " + e.message);
            console.error(e);
        }
    }
}

function getPublisherFromFormData(rawName, rawAddress, rawCountry) {
    if (!rawName || !rawName.trim()) {
        showError("Nome non valido");
        throw new Error("NOME NON PRESENTE");
    }
    if (!rawAddress || !rawAddress.trim()) {
        showError("Indirizzo non valido");
        throw new Error("INDIRIZZO NON PRESENTE");
    }
    if (!rawCountry || !rawCountry.trim()) {
        showError("Paese non valido");
        throw new Error("PAESE NON PRESENTE");
    }

    return new Publishers(undefined, rawName, rawAddress, rawCountry);
}

CreaButton.addEventListener("click", async () => {
    let publisherService = new PublisherService();

    const rawName = formPublisher.elements["name"]?.value;
    const rawAddress = formPublisher.elements["address"]?.value;
    const rawCountry = formPublisher.elements["country"]?.value;

    try {
        await publisherService.createPublisher(getPublisherFromFormData(rawName, rawAddress, rawCountry));
    } catch (e) {
        showError("Errore durante la creazione della casa editrice: " + e.message);
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
