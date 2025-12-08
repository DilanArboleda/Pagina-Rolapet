class ModeracionAdminComponent extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        const html = await fetch('/pages/gestion_usuarios_admin/components/moderacion-admin/moderacion-admin-component.html').then(response => response.text());
        const template = document.createElement('template');
        template.innerHTML = html;
        this.appendChild(template.content.cloneNode(true));
    }

}

customElements.define('moderacion-admin-component', ModeracionAdminComponent);


// TODO- Ver si moderacion_admin.js sirve de algo