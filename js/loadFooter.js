document.addEventListener('DOMContentLoaded', event => {

    // Funzione per caricare il footer
    function loadFooter() {
        fetch('/Views/footer.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('footer-placeholder').innerHTML = data;
            })
            .catch(error => console.error('Error loading footer:', error));
    }

    loadFooter();
});