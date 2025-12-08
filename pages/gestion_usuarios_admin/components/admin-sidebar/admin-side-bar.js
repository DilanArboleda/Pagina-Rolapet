class AdminSidebar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const html = await fetch('/pages/gestion_usuarios_admin/components/admin-sidebar/admin-side-bar.html').then(response => response.text());
        const template = document.createElement('template');
        template.innerHTML = html;
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.setupNavigation();
        this.loadUserInfo();
    }

    setupNavigation() {
        const links = this.shadowRoot.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const view = link.getAttribute('data-view');

                // Dispatch event
                this.dispatchEvent(new CustomEvent('navigate-admin', {
                    detail: view,
                    bubbles: true,
                    composed: true
                }));

                // Update active state
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    loadUserInfo() {
        try {
            const userStr = localStorage.getItem('user'); // Adjust key if needed
            if (userStr) {
                const user = JSON.parse(userStr);
                const nameEl = this.shadowRoot.getElementById('adminName');
                const emailEl = this.shadowRoot.getElementById('adminEmail');
                if (nameEl) nameEl.textContent = user.nombre || 'Administrador';
                if (emailEl) emailEl.textContent = user.email || '';
            }
        } catch (e) { console.error('Error loading user info in sidebar', e); }
    }
}

customElements.define('admin-sidebar', AdminSidebar);