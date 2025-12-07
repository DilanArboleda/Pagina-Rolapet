const URL_BASE = "http://localhost:8888";


const API = {
    AUTH: {
        LOGIN: `${URL_BASE}/auth/api/v1/auth/login`,
        REFRESH: `${URL_BASE}/auth/api/v1/auth/refresh`,
        SIGNIN: `${URL_BASE}/auth/api/v1/auth/sign-in`,
    },
    USER: {
        ME: `${URL_BASE}/usuario/api/v1/jwt/users/me`,
        FIND_BY_ID: `${URL_BASE}/usuario/api/v1/jwt/users/findById`,
        FIND_ALL: `${URL_BASE}/usuario/api/v1/jwt/users`,
    }
};

export default API;