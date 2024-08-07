document.addEventListener("DOMContentLoaded", function () {
    // Funzione per caricare la sidebar
    function loadSidebar() {
        fetch('/Views/sidebar.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('sidebar-placeholder').innerHTML = data;
            })
            .catch(error => console.error('Error loading sidebar:', error));
    }
    loadSidebar();
});