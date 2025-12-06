export const tokenServiceLocal = {
    getAccess() {
        return localStorage.getItem("access_token");
    },

    getRefresh() {
        return localStorage.getItem("refresh_token");
    },

    save({ accessToken, refreshToken }) {
        if (accessToken) localStorage.setItem("access_token", accessToken);
        if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
    },

    clear() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    }
};


export const tokenServiceSession = {
    getAccess() {
        return sessionStorage.getItem("access_token");
    },

    getRefresh() {
        return sessionStorage.getItem("refresh_token");
    },

    save({ accessToken, refreshToken }) {
        if (accessToken) sessionStorage.setItem("access_token", accessToken);
        if (refreshToken) sessionStorage.setItem("refresh_token", refreshToken);
    },

    clear() {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
    }
};