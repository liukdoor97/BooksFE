document.addEventListener('DOMContentLoaded', event => {

    // Funzione per caricare il menu
    function loadMenu() {
        fetch('/Views/menu.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('menu-placeholder').innerHTML = data;
            })
            .catch(error => console.error('Error loading menu:', error));
    }

    loadMenu();
});

