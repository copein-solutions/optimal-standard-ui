import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL
});

export const get = async (url) => {
    try {
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      handleRequestError(error);
      throw error;
    }
  };
  
  export const post = async (url, data) => {
    try {
      const response = await api.post(url, data);
      return response.data;
    } catch (error) {
      handleRequestError(error);
      throw error;
    }
  };
  
  export const put = async (url, data) => {
    try {
      const response = await api.put(url, data);
      return response.data;
    } catch (error) {
      handleRequestError(error);
      throw error;
    }
  };
  
  export const remove = async (url) => {
    try {
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      handleRequestError(error);
      throw error;
    }
  };
  
  const handleRequestError = (error) => {
    if (error.response) {
      // Error de respuesta del servidor (código de estado HTTP fuera del rango 2xx)
      console.error('Error de respuesta del servidor:', error.response.data);
      console.error('Código de estado HTTP:', error.response.status);
    } else if (error.request) {
      // No se recibió respuesta del servidor
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      // Error durante la configuración de la solicitud
      console.error('Error durante la configuración de la solicitud:', error.message);
    }
  };