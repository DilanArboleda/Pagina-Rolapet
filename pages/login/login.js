import { api } from "../../js/utils/api-client.js";
import API from "../../js/utils/endpoints.js";
import { tokenService } from "../../js/utils/tokenService.js";

// Estado
let currentUserType = null;

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const remember = document.getElementById("remember").checked;

        try {
            // login
            const data = await api.post(API.AUTH.LOGIN, { email, password });

            const { accessToken, refreshToken, isValid } = data.data;

            if (!isValid) {
                showError("Credenciales inválidas");
                return;
            }

            tokenService.save(accessToken, refreshToken, currentUserType, remember);

            // obtenemos el usuario
            const me = await api.get(API.USER.ME, currentUserType);

            sessionStorage.setItem("userInfo", JSON.stringify(me.data));

            // redireccionamos
            console.log(me.data.rol);
            switch (me.data.rol) {
                case "user": /* window.location.href = "/dashboard/user" */; break;
                case "provider": /* window.location.href = "/dashboard/provider" */; break;
                case "Moderador": /* window.location.href = "../home_admin/home_admin.html" */ console.log("accedimos"); break;
            }

        } catch (err) {
            showError(err.message || "Error en el login");
        }
    });
});
