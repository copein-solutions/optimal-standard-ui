import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const createMaterial = (data) => {
    return post("/material", data);
}

export const createApplicationArea = (data) => {
  return post("/application_area", data);
}

const post = async (url, data) => {
  try {
    return await api.post(url, data);
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
};

export const get = async (url) => {
  try {
    return await api.get(url);
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
};

const put = async (url, data) => {
  try {
    return await api.put(url, data);
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
};

export const remove = async (url) => {
  try {
    return await api.delete(url);    
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
};

const handleRequestError = (error) => {
  if (error.response) {
    // Error de respuesta del servidor (código de estado HTTP fuera del rango 2xx)
    console.error("Error de respuesta del servidor:", error.response.data);
    console.error("Código de estado HTTP:", error.response.status);
  } else if (error.request) {
    // No se recibió respuesta del servidor
    console.error("No se recibió respuesta del servidor:", error.request);
  } else {
    // Error durante la configuración de la solicitud
    console.error(
      "Error durante la configuración de la solicitud:",
      error.message
    );
  }
};
