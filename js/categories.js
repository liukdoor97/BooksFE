

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
            const response = await fetch(this.basePath);
            if (!response.ok) {
                throw new Error("IMPOSSIBILE PRENDERE LE CATEGORIE");
            }
            const categoryData = await response.json();
            const categories = categoryData.$values;

            return categories;
        } catch (e) {
            console.error(e);
            return [];
        }
    }


    async getCategory(Id) {
        try {
            if (typeof Id !== "number") {
                throw new Error("NON È UN ID VALIDO");
            }

            const response = await fetch(this.basePath + `/${Id}`, {
            });

            if (!response.ok) {
                throw new Error("IMPOSSILE PRENDERE LA CATEGORIA");
            }

            return response.json();
        } catch (e) {
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
                throw new Error("IMPOSSILE GENERARE LA CATEGORIA");
            }

            return await response.json();
        } catch (e) {
            console.error(e);
        }

    }

    deleteCategory(categoryId) {
        if (!categoryId) {
            console.error('ID categoria non definito');
            throw new Error('ID categoria non definito');
        }

        console.log(`Tentativo di eliminare la categoria con ID: ${categoryId}`);

        return fetch(this.basePath + `/${categoryId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('CATEGORIA NON ELIMINATA');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Errore durante l\'eliminazione della categoria:', error);
            throw error;
        });
    }

}


function loadSingleCategory(category) {
    if (!category || !category.id) {
        console.error('Oggetto categoria non valido:', category);
        return;
    }

    const listContainer = document.getElementById("category-list");

    const card = document.createElement("div");
    card.classList.add("mycard");

    const categoryTitle = document.createElement("div");
    categoryTitle.classList.add("card-title");
    categoryTitle.innerText = category.name;

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("d-flex", "gap-3", "justify-content-end");

    const eliminaButton = document.createElement("button");
    eliminaButton.classList.add("button-pers", "btn-pers");
    eliminaButton.innerText = "ELIMINA";

    const libriButtonHref = document.createElement("a");
    libriButtonHref.href = `/Views/lists/categoriesBooks.html?categoryId=${category.id}`;
    libriButtonHref.classList.add("button-pers", "btn-pers");
    libriButtonHref.innerText = "LIBRI";

    buttonsContainer.append(eliminaButton, libriButtonHref);
    card.append(categoryTitle, buttonsContainer);
    listContainer.appendChild(card);

    eliminaButton.addEventListener("click", () => {
        console.log(`Tentativo di eliminare la categoria con ID: ${category.Id}`);

        async function removeCategory() {
            try {
                const categoryService = new CategoryService();
                await categoryService.deleteCategory(category.id);
                card.remove();
                console.log(`Categoria con ID ${category.id} eliminata con successo`);
            } catch (error) {
                console.error('Errore durante l\'eliminazione della categoria:', error);
                alert('Errore durante l\'eliminazione della categoria.');
            }
        }

        removeCategory();
    });
}

// Carica tutte le categorie al caricamento del documento
async function loadAllCategories() {
    const categoryService = new CategoryService();
    const categories = await categoryService.getCategories();

    categories.forEach(category => {
        loadSingleCategory(category);
    });
}

document.addEventListener('DOMContentLoaded', loadAllCategories);
