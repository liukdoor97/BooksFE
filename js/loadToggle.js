document.addEventListener('DOMContentLoaded', event => {

    // Funzione per caricare la sidebar
    function loadSidebar() {
        fetch('/Views/sidebar.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('sidebar-placeholder').innerHTML = data;
                initializeSidebarToggle();
            })
            .catch(error => console.error('Error loading sidebar:', error));
    }

    // Funzione per inizializzare il toggle della sidebar
    function initializeSidebarToggle() {
        const sidebarToggle = document.body.querySelector('#sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', event => {
                event.preventDefault();
                document.body.classList.toggle('sb-sidenav-toggled');
                localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
            });
        }
    }

    loadSidebar();
});

