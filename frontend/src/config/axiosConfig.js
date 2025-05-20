// frontend/src/config/axiosConfig.js
import axios from 'axios';

// Leggi la URL base dell'API dalle variabili d'ambiente di Vite
// Nel file .env (nella root di /frontend), dovrai definire:
// VITE_API_BASE_URL=http://localhost:3001/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Potresti aggiungere altri header di default qui, es. per l'autenticazione
  },
});

// Interceptor per le richieste (opzionale, utile per aggiungere token JWT)
apiClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('authToken'); // Esempio recupero token
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor per le risposte (opzionale, utile per gestione errori globali)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Esempio: gestisci errori 401 (Unauthorized) globalmente
    // if (error.response && error.response.status === 401) {
    //   // Effettua il logout o reindirizza alla pagina di login
    //   console.error("Unauthorized! Logging out...");
    //   // authStore.getState().logout(); // Se usi Zustand per auth
    //   // window.location.href = '/login';
    // }
    return Promise.reject(error);
  }
);

export default apiClient;
