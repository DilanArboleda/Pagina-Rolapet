import { api } from "@api";
import API from "@endpoints";

export class UserService {
    async getAllUsers() {
        try {
            const response = await api.get(API.USER.FIND_ALL);
            return response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            // Assuming API.USER.DELETE is the base path and we append the ID
            // or if it's a full template, we need to handle it. 
            // Based on users-ui.js comments: api.delete(`${API.USER.DELETE}/${id}`);
            await api.delete(`${API.USER.DELETE}/${id}`);
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }
}
