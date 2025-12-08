import { userService } from "@user-service";

class AdminPage {
    constructor() {
        this.mainContent = document.getElementById('main-content-gestion-usuario-admin');
    }

    init() {
        this.loadCurrentUserInfo();
        this.setupNavigation();
    }

    loadCurrentUserInfo() {
        const currentUser = userService.getFromCache();
        // Since elements are now inside components (sidebar), we might need to handle this differently
        // if we want to display user info in the sidebar.
        // Assuming the sidebar handles its own data loading or we need to pass it.
        // For now, I'll leave this empty or logging, as the sidebar component should ideally handle itself.
        console.log("Admin Page Initialized for:", currentUser?.email);
    }

    setupNavigation() {
        document.addEventListener('navigate-admin', (e) => {
            const view = e.detail;
            this.switchView(view);
        });
    }

    switchView(view) {
        this.mainContent.innerHTML = '';
        let component;

        // Cleanup previous view if needed

        switch (view) {
            case 'users':
                component = document.createElement('users-admin-component');
                break;
            case 'config':
                component = document.createElement('configuracion-admin');
                break;
            case 'moderation':
                component = document.createElement('moderacion-admin-component');
                break;
            case 'points':
                component = document.createElement('puntos-interes-admin-component');
                break;
            case 'providers':
                component = document.createElement('gestion-proveedores-admin-component');
                break;
            default:
                component = document.createElement('users-admin-component');
        }

        if (component) {
            this.mainContent.appendChild(component);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const page = new AdminPage();
    page.init();
});