import { api } from "@api";
import API from "@endpoints";
import { authService } from "@auth-service";
import { userService } from "@user-service";


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
            console.log("data recibida login: ", data.data);
            authService.save(data.data, remember);

            // obtenemos el usuario
            const me = await api.get(API.USER.ME);

            userService.saveToCache(me.data, remember);

            // redireccionamos
            switch (me.data.rol) {
                case "USUARIO COMUN":
                    window.location.href = "/home_usuario.html";
                    break;
                case "PROVEEDOR":
                    window.location.href = "/home_proveedor.html";
                    break;
                case "ADMIN":
                    window.location.href = "/pages/home_admin/home_admin.html";
                    break;
            }

        } catch (err) {
            window.alert("Error en el login: " + err.message || "Error en el login");
        }
    });
});
