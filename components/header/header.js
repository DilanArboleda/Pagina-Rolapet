class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        // Removed Shadow DOM to allow global styles (Bootstrap) to apply
        // this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const html = await fetch("/components/header/header.html").then((response) => response.text());
        const template = document.createElement("template");
        template.innerHTML = html;
        // Append directly to the component (Light DOM)
        this.appendChild(template.content.cloneNode(true));
    }
}


customElements.define("header-component", HeaderComponent);