const CreaButton = document.getElementById("CreaButton");
const formCategory = document.getElementById("formCategory");

class Categories {
    Id;
    name;

    constructor(Id, name) {
        this.Id = Id;
        this.name = name;
    }
}

class CategoryService {
    basePath = "http://localhost:5055/api/Category";

    async getCategories() {
        try {
            const response = await fetch(this.basePath, {});
            if (!response.ok) {
                throw new Error("IMPOSSIBILE PRENDERE LE CATEGORIE");
            }
            return response.json();
        } catch (e) {
            showError("Errore durante il recupero delle categorie: " + e.message);
            return [];
        }
    }

    async getCategory(Id) {
        try {
            if (typeof Id !== "number") {
                throw new Error("NON È UN ID VALIDO");
            }
            const response = await fetch(this.basePath + `/${Id}`, {});
            if (!response.ok) {
                throw new Error("IMPOSSIBILE PRENDERE LA CATEGORIA");
            }
            return response.json();
        } catch (e) {
            showError("Errore durante il recupero della categoria: " + e.message);
            return null;
        }
    }

    async createCategory(category) {
        if (!(category instanceof Categories)) {
            throw new Error("PARAMETRO NON VALIDO");
        }
        try {
            const response = await fetch(this.basePath, {
                method: 'POST',
                body: JSON.stringify(category),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error("IMPOSSIBILE GENERARE LA CATEGORIA");
            }
            const result = await response.json();
            showSuccess("Categoria inserita con successo");
            return result;
        } catch (e) {
            showError("Errore: " + e.message + " , categoria non inserita");
        }
    }

    async deleteCategory(categoriesId) {
        try {
            const response = await fetch(this.basePath + `/${categoriesId}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error("CATEGORIA NON ELIMINATA");
            }
            return await response.json();
        } catch (e) {
            showError("Errore durante l'eliminazione della categoria: " + e.message);
        }
    }
}

function getCategoryFromFormData(rawName) {
    if (!rawName) {
        showError("Errore: Nome non presente, categoria non inserita");
        throw new Error("NOME NON PRESENTE");
    }

    if (!rawName.trim()) {
        throw new Error("IL NOME NON È VALIDO");
    }

    return new Categories(undefined, rawName);
}

CreaButton.addEventListener("click", async () => {
    let categoryService = new CategoryService();

    const rawName = formCategory.elements["name"]?.value;

    await categoryService.createCategory(getCategoryFromFormData(rawName));

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
