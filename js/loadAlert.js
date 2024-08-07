document.addEventListener('DOMContentLoaded', event => {
    // Funzione per caricare gli alert
    function loadAlert() {
        fetch('/Views/alert.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('alert-placeholder').innerHTML = data;
                setupModalEvents();
            })
            .catch(error => console.error('Error loading alert:', error));
    }

    // Funzione per impostare gli eventi dei modali
    function setupModalEvents() {
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

        document.querySelectorAll('.close').forEach(button => {
            button.addEventListener('click', handleCloseButtonClick);
        });

        window.addEventListener('click', handleWindowClick);
    }

    loadAlert();
});


