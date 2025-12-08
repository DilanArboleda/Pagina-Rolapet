class HeaderUsuarioComponent extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        const html = await fetch('/components/header-usuario/header-usuario.html').then(response => response.text());
        const template = document.createElement('template');
        template.innerHTML = html;
        this.appendChild(template.content.cloneNode(true));
    }

}

customElements.define('header-usuario', HeaderUsuarioComponent);    