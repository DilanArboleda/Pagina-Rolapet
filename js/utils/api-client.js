import { authService as tokenService } from "../services/auth-service.js";
import API from "./endpoints.js";

class ApiClient {
    // constructor
    constructor() {
        this.refreshing = false;
    }

    // Refresh token
    async refreshToken() {
        if (this.refreshing) return;
        this.refreshing = true;

        const refresh = tokenService.getRefresh();
        // devolvemos error si no hay refresh token
        if (!refresh) throw new Error("No refresh token");

        const res = await fetch(API.AUTH.REFRESH, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: refresh }),
        });
        // la propiedad que viene: 
        /**
         * {
            "status": "success",
            "message": "Token exitoso",
            "data": {
                    "accessToken": "",
                    "refreshToken": "",
                    "expiresAt": "",
                    "isValid": true
                    },
            "code": 200
            }
        */
        const data = await res.json();
        const wasRemembered = !!localStorage.getItem("auth");
        tokenService.save(data.data, wasRemembered);

        this.refreshing = false;
        return data.data.accessToken;
    }

    // Request cualquiera 
    async request(url, opts = {}) {
        const token = tokenService.getAccess();

        const config = {
            method: opts.method || "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` })
            },
            body: opts.body ? JSON.stringify(opts.body) : undefined,
        };
        let res = await fetch(url, config);

        if (res.status === 401 || res.status === 403) {
            try {
                const newToken = await this.refreshToken();
                config.headers.Authorization = `Bearer ${newToken}`;
                res = await fetch(url, config);
            } catch (err) {
                tokenService.clear();
                throw new Error("Sesión expirada");
            }
        }

        if (!res.ok) throw new Error(await res.text());
        return res.json().catch(() => ({}));
    }

    get(url) { return this.request(url); }
    post(url, body) { return this.request(url, { method: "POST", body }); }
    put(url, body) { return this.request(url, { method: "PUT", body }); }
    delete(url) { return this.request(url, { method: "DELETE" }); }
}

export const api = new ApiClient();
