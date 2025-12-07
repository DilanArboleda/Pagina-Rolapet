class AuthService {

    constructor() {
        this.auth = null;
    }

    getAccess() {
        return this.getFromCache()?.accessToken || null;
    }

    getRefresh() {
        return this.getFromCache()?.refreshToken || null;
    }

    save(data, remember = true) {
        // data = { accessToken, refreshToken, expiresAt, isValid }
        this.auth = data;
        this.saveToCache(data, remember);
    }

    getFromCache() {
        if (this.auth) return this.auth;

        const raw = localStorage.getItem("auth") || sessionStorage.getItem("auth");
        if (!raw) return null;

        try {
            this.auth = JSON.parse(raw);
        } catch {
            this.auth = null;
        }
        return this.auth;
    }

    saveToCache(auth, remember = true) {
        const value = JSON.stringify(auth);

        if (remember) {
            localStorage.setItem("auth", value);
            sessionStorage.removeItem("auth");
        } else {
            sessionStorage.setItem("auth", value);
            localStorage.removeItem("auth");
        }
    }

    clear() {
        this.auth = null;
        localStorage.removeItem("auth");
        sessionStorage.removeItem("auth");
    }
}

export const authService = new AuthService();
