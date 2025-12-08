
class UserProfilePage {
    constructor() {
        this.mainContent = document.getElementById('main-content');
    }

    init() {
        this.setupNavigation();
        // Load default view
        this.switchView('mi-perfil');
    }

    setupNavigation() {
        document.addEventListener('navigate-user', (e) => {
            const view = e.detail;
            this.switchView(view);
        });
    }

    switchView(view) {
        // Clear current content
        this.mainContent.innerHTML = '';
        let component;

        switch (view) {
            case 'mi-perfil':
                component = document.createElement('mi-perfil-component');
                break;
            case 'registro-vehiculos':
                component = document.createElement('registro-vehiculos-component');
                break;
            case 'mis-vehiculos':
                component = document.createElement('mis-vehiculos-component');
                break;
            case 'configuracion':
                component = document.createElement('configuracion-usuario-component');
                break;
            default:
                component = document.createElement('mi-perfil-component');
        }

        if (component) {
            // Container wrapper if needed, or just append component
            // The snippet had a .perfil-container wrapper. I'll include it here or inside components.
            // If I include it here, components are just the innards.
            // But the snippet structure was: .main-content > .perfil-container > .hero-simple + .content-grid
            // So maybe the 'mi-perfil' component IS the .perfil-container?
            // Actually, the snippet had a single monolithic "perfil-container".
            // The sections only changed the middle part?
            // "sections = document.querySelectorAll('#mainColumn .section');"
            // The user snippet has a "Hero" that seems to persist? NO, the hero is inside .perfil-container.
            // And "sections" are inside .content-grid -> #mainColumn.

            // To make it truly modular like admin:
            // The component should probably contain the whole view (Hero + Grid).
            // OR we have a layout component?

            // Let's assume each component renders the FULL content of .perfil-container for simplicity.
            // So each component starts with <div class="perfil-container">...

            this.mainContent.appendChild(component);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new UserProfilePage();
    page.init();
});
