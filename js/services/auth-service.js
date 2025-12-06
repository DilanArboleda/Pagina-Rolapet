
class AuthService {

    // auth service guardará un objeto como: 
    /* 
    *   accesToken
    *   refreshToken
    *   isValid
    */

    constructor() {
        this.auth = {
            accessToken: null,
            refreshToken: null,
            isValid: false
        };
    }


    getFromCache() {
        const local = localStorage.getItem('authInfo');
        const session = sessionStorage.getItem('authInfo');

        if (local && JSON.parse(local).isValid) {
            this.auth = JSON.parse(local);
        } else if (session && JSON.parse(session).isValid) {
            this.auth = JSON.parse(session);
        } else {
            this.auth = {};
            this.clear();
        }
        return this.auth;
    }

    saveToCache(auth, remember = true) {
        this.auth = auth;
        if (remember) {
            localStorage.setItem('authInfo', JSON.stringify(auth));
        } else {
            sessionStorage.setItem('authInfo', JSON.stringify(auth));
        }
    }

    clear() {
        this.auth = {};
        localStorage.removeItem('authInfo');
        sessionStorage.removeItem('authInfo');
    }


    validateToken() {
        const auth = this.getFromCache();
        if (auth.isValid && auth.accessToken && auth.refreshToken) {
            return true;
        } else {
            this.clear();
            return false;
        }
    }
}