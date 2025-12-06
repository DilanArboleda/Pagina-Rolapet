import { api } from "@api";
import API from "@endpoints";
import { tokenService } from "@token-service";
import { userService } from "@user-service";


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

            userService.saveToCache(me.data, remember);

            // redireccionamos
            console.log(me.data.rol);
            switch (me.data.rol) {
                case "user":
                    window.location.href = "/home_usuario.html";
                    break;
                case "provider":
                    window.location.href = "/home_proveedor.html";
                    break;
                case "Moderador":
                    window.location.href = "/pages/home_admin/home_admin.html";
                    break;
            }

        } catch (err) {
            window.alert(err.message || "Error en el login");
        }
    });
});
