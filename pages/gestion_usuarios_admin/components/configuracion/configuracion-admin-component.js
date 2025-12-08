class ConfiguracionAdminComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const html = await fetch('/pages/gestion_usuarios_admin/components/configuracion/configuracion-admin-component.html').then(response => response.text());
        const template = document.createElement('template');
        template.innerHTML = html;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('configuracion-admin', ConfiguracionAdminComponent);