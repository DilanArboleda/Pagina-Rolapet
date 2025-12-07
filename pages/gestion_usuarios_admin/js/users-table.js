/**
 * users-table.js
 * Clase para manejar la tabla de usuarios (fetch, render, search)
 */

import { api } from "@api";
import API from "@endpoints";

export class UsersTable {
    constructor(tableSelector) {
        this.tableBody = document.querySelector(`${tableSelector} tbody`);
        this.searchInput = document.getElementById('searchInput');
        this.initSearch();
    }

    /**
     * Carga usuarios desde el API
     */
    async load() {
        this.showLoading();

        try {
            const response = await api.get(API.USER.FIND_ALL);
            const users = response.data;
            this.render(users);
        } catch (error) {
            console.error("Error loading users:", error);
            this.showError();
        }
    }

    /**
     * Renderiza la lista de usuarios
     */
    render(users) {
        this.tableBody.innerHTML = '';

        if (!users || users.length === 0) {
            this.showEmpty();
            return;
        }

        users.forEach(user => {
            const tr = this.createUserRow(user);
            this.tableBody.appendChild(tr);
        });
    }

    /**
     * Crea una fila de usuario
     */
    createUserRow(user) {
        const tr = document.createElement('tr');
        tr.className = 'user-row';
        tr.id = `user-${user.id}`;

        const fullName = `${user.name || ''} ${user.apellido_1 || ''}`.trim() || 'Sin Nombre';
        const email = user.email || 'No disponible';
        const rol = user.rol || 'Usuario';
        const fechaAlta = user.fecha_alta || '-';
        const estado = user.estado || 'Activo';

        tr.innerHTML = `
            <td data-label="Nombre de usuario">${fullName}</td>
            <td data-label="Correo electrónico">${email}</td>
            <td data-label="Rol">${rol}</td>
            <td data-label="Fecha de alta">${fechaAlta}</td>
            <td data-label="Estado"><span class="tag-active">${estado}</span></td>
            <td data-label="Acciones" class="actions">
                <i class="fa-solid fa-pen" title="Editar" onclick="window.openPanel()"></i>
                <i class="fa-solid fa-trash" title="Eliminar" onclick="window.deleteUser(${user.id})"></i>
            </td>
        `;

        return tr;
    }

    /**
     * Inicializa el filtro de búsqueda
     */
    initSearch() {
        if (!this.searchInput) return;

        this.searchInput.addEventListener('input', (e) => {
            const filter = e.target.value.toLowerCase();
            this.filterRows(filter);
        });
    }

    /**
     * Filtra las filas de la tabla
     */
    filterRows(filter) {
        document.querySelectorAll('.user-row').forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(filter) ? '' : 'none';
        });
    }

    /**
     * Muestra mensaje de carga
     */
    showLoading() {
        this.tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">Cargando usuarios...</td>
            </tr>
        `;
    }

    /**
     * Muestra mensaje de error
     */
    showError() {
        this.tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; color:red;">
                    Error al cargar usuarios
                </td>
            </tr>
        `;
    }

    /**
     * Muestra mensaje vacío
     */
    showEmpty() {
        this.tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No hay usuarios encontrados
                </td>
            </tr>
        `;
    }
}