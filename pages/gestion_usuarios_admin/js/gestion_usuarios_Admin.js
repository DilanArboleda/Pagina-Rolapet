import { userService } from "@user-service";
import { UsersTable } from "./users-table.js";
import { exposeUIFunctions } from "./users-ui.js";

class UsersPage {
    constructor() {
        this.usersTable = null;
    }

    // esto inicia la pagina
    async init() {
        // expone las funciones iniciales
        exposeUIFunctions();

        // Cargar información del usuario actual
        this.loadCurrentUserInfo();

        // Inicializar tabla de usuarios
        this.usersTable = new UsersTable('table');
        await this.usersTable.load();
    }

    //
    loadCurrentUserInfo() {
        const currentUser = userService.getFromCache();

        const emailElement = document.getElementById('adminEmail');
        if (emailElement) {
            emailElement.textContent = currentUser?.email || 'No está registrado';
        }

        const nameElement = document.getElementById('adminName');
        if (nameElement) {
            nameElement.textContent = currentUser?.nombre || 'Administrador';
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const page = new UsersPage();
    page.init();
});