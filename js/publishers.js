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
            const response = await fetch(this.basePath, {
            });

            if (!response.ok) {
                throw new Error("IMPOSSILE PRENDERE LE CASE EDITRICI");
            }

            const publisherData = await response.json();
            const publishers = publisherData.$values;

            return publishers;
        } catch (e) {
            return [];
        }
    }

    async getPublisher(Id) {
        try {
            if (typeof Id !== "number") {
                throw new Error("NON È UN ID VALIDO");
            }

            const response = await fetch(this.basePath + `/${Id}`, {
            });

            if (!response.ok) {
                throw new Error("IMPOSSILE PRENDERE LA CASA EDITRICE");
            }

            return response.json();
        } catch (e) {
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
                throw new Error("IMPOSSILE GENERARE LA CASA EDITRICE");
            }

            return await response.json();
        } catch (e) {
            console.error(e);
        }

    }

    async deletePublisher(publisherSId) {
        try {
            const response = await fetch(this.basePath + `/${publisherSId}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error("CASA EDITRICE NON ELIMINATA");
            }

            return await response.json();
        } catch (e) {
            console.error(e);
        }
    }

}

async function loadAllPublisher() {
    const publisherService = new PublisherService();

    const publishers = await publisherService.getPublishers();

    console.log(publishers);

    publishers.forEach((value, index, array) => {
        loadSinglePublisher(value);
    });
}

function loadSinglePublisher(publisher) {
    const listContainer = document.getElementById("publisher-list");

    const card = document.createElement("div");
    card.classList.add("mycard");

    const publisherTitle = document.createElement("div");
    publisherTitle.classList.add("card-title");
    publisherTitle.innerText = publisher.name;

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("d-flex", "gap-3", "justify-content-end");

    const eliminaButton = document.createElement("button");
    eliminaButton.classList.add("button-pers", "btn-pers");
    eliminaButton.innerText = "ELIMINA";

    const libriButtonHref = document.createElement("a");
    libriButtonHref.href = `/Views/lists/publishersBooks.html?publisherId=${publisher.id}`;
    libriButtonHref.classList.add("button-pers", "btn-pers");
    libriButtonHref.innerText = "LIBRI";

    buttonsContainer.append(eliminaButton, libriButtonHref);

    card.append(publisherTitle, buttonsContainer);

    listContainer.appendChild(card);

    eliminaButton.addEventListener("click", () => {
        console.log(`Tentativo di eliminare la casa editrice con ID: ${publisher.Id}`);

        async function removeAuthor() {
            try {
                const publisherService = new PublisherService();
                await publisherService.deletePublisher(publisher.id);
                card.remove();
                console.log(`Casa Editrice con ID ${publisher.id} eliminata con successo`);
            } catch (error) {
                console.error('Errore durante l\'eliminazione della casa ditrice:', error);
                alert('Errore durante l\'eliminazione della casa ditrice.');
            }
        }

        removeAuthor();
    });
}

loadAllPublisher();