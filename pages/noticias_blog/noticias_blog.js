import { publicacionService } from '../../js/services/publicacion-service.js';
import { comentarioService } from '../../js/services/comentario-service.js';
import { foroService } from '../../js/services/foro-service.js';
import { api } from '../../js/utils/api-client.js';
import API from '../../js/utils/endpoints.js';

const state = {
    publicaciones: [],
    filteredPublicaciones: [],
    currentForo: 'TODOS',
    currentForoId: null,
    searchTerm: '',
    foros: []
};

const elements = {
    postsContainer: null,
    searchInput: null,
    filterTabs: null,
    loadingState: null,
    emptyState: null,
    forumsList: null
};

function initializeElements() {
    elements.postsContainer = document.getElementById('posts-container');
    elements.searchInput = document.getElementById('search-input');
    elements.filterTabs = document.querySelectorAll('.filter-tab');
    elements.loadingState = document.getElementById('loading-state');
    elements.emptyState = document.getElementById('empty-state');
    elements.forumsList = document.getElementById('forums-list');
}

function showLoading() {
    if (elements.loadingState) elements.loadingState.style.display = 'block';
    if (elements.emptyState) elements.emptyState.style.display = 'none';
    if (elements.postsContainer) elements.postsContainer.style.display = 'none';
}

function hideLoading() {
    if (elements.loadingState) elements.loadingState.style.display = 'none';
    if (elements.postsContainer) elements.postsContainer.style.display = 'block';
}

function showEmptyState() {
    if (elements.emptyState) elements.emptyState.style.display = 'block';
    if (elements.postsContainer) elements.postsContainer.style.display = 'none';
}

function hideEmptyState() {
    if (elements.emptyState) elements.emptyState.style.display = 'none';
}

async function fetchPublicaciones() {
    try {
        showLoading();

        let publicaciones;

        if (state.currentForoId) {
            const response = await api.get(`${API.CONTENIDO.GET_PUBLICACIONES_BY_FORO}${state.currentForoId}`);
            if (response.status === 'success' && response.data) {
                publicaciones = publicacionService.mapPublicaciones(response.data);
            } else {
                publicaciones = [];
            }
        } else if (state.currentForo === 'TODOS') {
            publicaciones = await publicacionService.getAllPublicaciones();
        } else {
            publicaciones = await publicacionService.getPublicacionesByForo(state.currentForo);
        }

        state.publicaciones = publicaciones;
        filterPublicaciones();

    } catch (error) {
        console.error('Error al cargar publicaciones:', error);
        state.publicaciones = [];
        state.filteredPublicaciones = [];
        hideLoading();
        showEmptyState();
    }
}

async function loadForums() {
    try {
        const foros = await foroService.getAllForos();
        state.foros = foros;
        renderForums(foros);
    } catch (error) {
        console.error('Error al cargar foros:', error);
        if (elements.forumsList) {
            elements.forumsList.innerHTML = '<div style="text-align: center; padding: 1rem; color: #d32f2f;">Error al cargar foros</div>';
        }
    }
}

function renderForums(foros) {
    if (!elements.forumsList) return;

    elements.forumsList.innerHTML = '';

    if (foros.length === 0) {
        elements.forumsList.innerHTML = '<div style="text-align: center; padding: 1rem; color: var(--medium-gray);">No hay foros</div>';
        return;
    }

    foros.forEach(foro => {
        const forumItem = document.createElement('div');
        forumItem.className = 'forum-item';
        forumItem.dataset.foroId = foro.id;

        const iconos = {
            'General': 'forum',
            'Mascotas': 'pets',
            'Salud': 'health_and_safety',
            'Tecnologia': 'computer',
            'Deportes': 'sports_soccer'
        };

        const icono = iconos[foro.nombre] || 'article';

        forumItem.innerHTML = `
            <span class="material-symbols-outlined">${icono}</span>
            <span>${foro.nombre}</span>
        `;

        forumItem.addEventListener('click', () => handleForumClick(foro.id, forumItem));

        elements.forumsList.appendChild(forumItem);
    });
}

async function handleForumClick(foroId, forumItem) {
    state.currentForoId = foroId;
    state.currentForo = null;

    elements.filterTabs.forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.forum-item').forEach(item => item.classList.remove('active'));
    forumItem.classList.add('active');

    await fetchPublicaciones();
}

function filterPublicaciones() {
    let filtered = [...state.publicaciones];

    if (state.searchTerm) {
        filtered = publicacionService.filterBySearch(filtered, state.searchTerm);
    }

    state.filteredPublicaciones = filtered;
    renderPublicaciones();
}

function renderPublicaciones() {
    hideLoading();

    if (!elements.postsContainer) return;

    elements.postsContainer.innerHTML = '';

    if (state.filteredPublicaciones.length === 0) {
        showEmptyState();
        return;
    }

    hideEmptyState();

    state.filteredPublicaciones.forEach(publicacion => {
        const postCard = createPostCard(publicacion);
        elements.postsContainer.appendChild(postCard);
    });

    setupCommentToggles();
}

function createPostCard(publicacion) {
    const article = document.createElement('article');
    article.className = 'post-card';
    article.dataset.postId = publicacion.id;

    const badgeColors = publicacionService.getBadgeColors(publicacion.foro);
    const icon = publicacionService.getForoIcon(publicacion.foro);

    article.innerHTML = `
        <div class="post-header">
            <div class="user-info">
                <div class="avatar" style="background-color: ${badgeColors.bg}; color: ${badgeColors.text};">
                    <span class="material-symbols-outlined">${icon}</span>
                </div>
                <div class="user-details">
                    <h3>${publicacion.usuarioNombre}</h3>
                    <span>${publicacion.tiempoRelativo}</span>
                </div>
            </div>
            <div class="post-badge" style="background-color: ${badgeColors.bg}; color: ${badgeColors.text};">
                ${publicacion.foro}
            </div>
        </div>

        <div class="post-content">
            <h4 class="post-title" style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--dark-gray);">
                ${publicacion.titulo}
            </h4>
            <p class="post-text">${publicacion.contenido}</p>
        </div>

        <div class="post-actions">
            <button class="action-btn ${publicacion.likes > 0 ? 'liked' : ''}">
                <span class="material-symbols-outlined">favorite</span>
                ${publicacion.likes || 0} Likes
            </button>
            <button class="action-btn toggle-comments" data-publicacion-id="${publicacion.id}">
                <span class="material-symbols-outlined">chat_bubble</span>
                <span class="comment-count">Ver comentarios</span>
            </button>
            <button class="action-btn" style="margin-left: auto;">
                <span class="material-symbols-outlined">share</span>
            </button>
        </div>

        <div class="comments-section">
            <div class="label" style="margin-bottom: 1rem;">Comentarios</div>
            
            <div class="comments-list" data-publicacion-id="${publicacion.id}">
                <div class="loading-comments" style="text-align: center; padding: 1rem; color: var(--medium-gray);">
                    Cargando comentarios...
                </div>
            </div>
            
            <div class="comment-input-area">
                <input type="text" class="input-field comment-input" placeholder="Escribe un comentario..." data-publicacion-id="${publicacion.id}">
                <button class="btn-primary send-comment" style="padding: 0.5rem 1rem;" data-publicacion-id="${publicacion.id}">
                    <span class="material-symbols-outlined">send</span>
                </button>
            </div>
        </div>
    `;

    return article;
}

async function renderComentarios(publicacionId, commentsList) {
    try {
        const comentarios = await comentarioService.getComentariosByPublicacion(publicacionId);

        commentsList.innerHTML = '';

        if (comentarios.length === 0) {
            commentsList.innerHTML = `
                <div style="text-align: center; padding: 1rem; color: var(--medium-gray); font-size: 0.9rem;">
                    No hay comentarios aún. ¡Sé el primero en comentar!
                </div>
            `;
            updateCommentCount(publicacionId, 0);
            return;
        }

        const principales = comentarios.filter(c => !c.idComentarioPadre);
        const respuestas = comentarios.filter(c => c.idComentarioPadre);

        principales.forEach(comentario => {
            commentsList.appendChild(createComentarioElement(comentario));

            const susRespuestas = respuestas.filter(r => r.idComentarioPadre === comentario.id);
            susRespuestas.forEach(respuesta => {
                commentsList.appendChild(createComentarioElement(respuesta, true));
            });
        });

        updateCommentCount(publicacionId, comentarios.length);

    } catch (error) {
        console.error('Error al renderizar comentarios:', error);
        commentsList.innerHTML = `
            <div style="text-align: center; padding: 1rem; color: #d32f2f; font-size: 0.9rem;">
                Error al cargar comentarios
            </div>
        `;
    }
}

function createComentarioElement(comentario, esRespuesta = false) {
    const div = document.createElement('div');
    div.className = 'comment-item';
    if (esRespuesta) div.style.marginLeft = '2.5rem';

    const avatarColor = comentarioService.getAvatarColor(comentario.usuario);
    const iniciales = comentarioService.getIniciales(comentario.usuario);
    const tiempoRelativo = comentarioService.calcularTiempoRelativo(comentario.fechaContenido);

    div.innerHTML = `
        <div class="avatar" style="width: 32px; height: 32px; font-size: 0.8rem; background-color: ${avatarColor.bg}; color: ${avatarColor.text};">
            ${iniciales}
        </div>
        <div class="comment-bubble">
            <span class="comment-author">Usuario ${comentario.usuario}</span>
            <span class="comment-time" style="font-size: 0.75rem; color: var(--medium-gray); margin-left: 0.5rem;">${tiempoRelativo}</span>
            <p class="comment-text">${comentario.textoContenido}</p>
        </div>
    `;

    return div;
}

function updateCommentCount(publicacionId, count) {
    const postCard = document.querySelector(`[data-post-id="${publicacionId}"]`);
    if (!postCard) return;

    const commentCountSpan = postCard.querySelector('.comment-count');
    if (commentCountSpan) {
        commentCountSpan.textContent = count === 0 ? 'Ver comentarios' : `${count} ${count === 1 ? 'comentario' : 'comentarios'}`;
    }
}

function setupCommentToggles() {
    document.querySelectorAll('.toggle-comments').forEach(btn => {
        btn.addEventListener('click', async function () {
            const postCard = this.closest('.post-card');
            const commentsSection = postCard.querySelector('.comments-section');
            const publicacionId = parseInt(this.dataset.publicacionId);
            const commentsList = commentsSection.querySelector('.comments-list');

            commentsSection.classList.toggle('active');

            if (commentsSection.classList.contains('active')) {
                await renderComentarios(publicacionId, commentsList);
            }
        });
    });

    document.querySelectorAll('.send-comment').forEach(btn => {
        btn.addEventListener('click', async function () {
            const publicacionId = parseInt(this.dataset.publicacionId);
            const postCard = this.closest('.post-card');
            const input = postCard.querySelector(`.comment-input[data-publicacion-id="${publicacionId}"]`);
            const commentsList = postCard.querySelector(`.comments-list[data-publicacion-id="${publicacionId}"]`);

            await handleSendComment(publicacionId, input, commentsList);
        });
    });

    document.querySelectorAll('.comment-input').forEach(input => {
        input.addEventListener('keypress', async function (e) {
            if (e.key === 'Enter') {
                const publicacionId = parseInt(this.dataset.publicacionId);
                const postCard = this.closest('.post-card');
                const commentsList = postCard.querySelector(`.comments-list[data-publicacion-id="${publicacionId}"]`);

                await handleSendComment(publicacionId, this, commentsList);
            }
        });
    });
}

async function handleSendComment(publicacionId, input, commentsList) {
    const texto = input.value.trim();
    if (!texto) return;

    try {
        input.disabled = true;

        const usuarioId = 1;

        await comentarioService.crearComentario({
            texto: texto,
            publicacionId: publicacionId,
            usuarioId: usuarioId
        });

        input.value = '';
        await renderComentarios(publicacionId, commentsList);

    } catch (error) {
        console.error('Error al enviar comentario:', error);
        alert('Error al enviar el comentario');
    } finally {
        input.disabled = false;
        input.focus();
    }
}

function setupFilterListeners() {
    elements.filterTabs.forEach(tab => {
        tab.addEventListener('click', async function () {
            const foro = this.dataset.foro;

            state.currentForoId = null;
            document.querySelectorAll('.forum-item').forEach(item => item.classList.remove('active'));

            elements.filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            state.currentForo = foro;
            await fetchPublicaciones();
        });
    });
}

function setupSearchListener() {
    let debounceTimer;

    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', function (e) {
            clearTimeout(debounceTimer);

            debounceTimer = setTimeout(() => {
                state.searchTerm = e.target.value;
                filterPublicaciones();
            }, 300);
        });
    }
}

function setupEventListeners() {
    setupFilterListeners();
    setupSearchListener();
}

async function init() {
    try {
        initializeElements();
        setupEventListeners();

        await Promise.all([
            loadForums(),
            fetchPublicaciones()
        ]);
    } catch (error) {
        console.error('Error al inicializar el blog:', error);
        hideLoading();
        showEmptyState();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
