import axios from "axios";

// Crée une instance personnalisée d'Axios
const api = axios.create({
  baseURL: "/api/",
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ou autre méthode pour stocker ton JWT

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
