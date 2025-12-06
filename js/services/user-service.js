class UserService {

    /**
     * Guardaremos la información del usuario de la forma: 
     * user_id
     * email
     * rol
     * nombre
     * apellido1
     * apellido2
     * fechaNacimiento
     * documento -> tipo y numero
     * imgPerfil
     * strikes
     */

    constructor() {
        this.currentUser = {
            user_id: null,
            email: null,
            rol: null,
            nombre: null,
            apellido1: null,
            apellido2: null,
            fechaNacimiento: null,
            documento: {
                tipo: null,
                numero: null
            },
            imgPerfil: null,
            strikes: null
        };
    }

    getFromCache() {
        const local = localStorage.getItem('userInfo');
        const session = sessionStorage.getItem('userInfo');

        if (local) {
            this.currentUser = JSON.parse(local);
            return this.currentUser;
        } else if (session) {
            this.currentUser = JSON.parse(session);
            return this.currentUser;
        } else {
            throw new Error("No se encontro informacion del usuario");
        }
    }


    saveToCache(user, remember = true) {
        this.currentUser = user;
        if (remember) {
            localStorage.setItem('userInfo', JSON.stringify(user));
        } else {
            sessionStorage.setItem('userInfo', JSON.stringify(user));
        }
    }

    clear() {
        this.currentUser = {};
        localStorage.removeItem('userInfo');
        sessionStorage.removeItem('userInfo');
    }
}

export const userService = new UserService();