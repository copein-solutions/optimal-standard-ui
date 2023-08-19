import axios, { AxiosRequestConfig } from "axios";
import { ResponseApi } from "../interfaces/service/ApiInterfaces";

export const API_BASE_URL = "http://localhost:8080";
let config: AxiosRequestConfig = {
  headers: {
    "Content-Type": "Application/json",
  },
};

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchHeaders = () => {
  const credentials = localStorage.getItem("credentials");
  if (credentials && config.headers) {
    config.headers.Authorization = `Bearer ${JSON.parse(credentials)}`;
  } else if (config.headers) {
    config.headers.Authorization = null;
  }
  return config;
};

//#region USER
export const login = async (data: any): Promise<ResponseApi> => {
  return post("public/login", data);
};
//#endregion

//#region MATERIAL
export const createMaterial = async (data: any): Promise<ResponseApi> => {
  return post("/material", data);
};

export const getMaterials = async (): Promise<ResponseApi> => {
  return get("/material");
};

export const getMaterialsByType = async (
  type: string
): Promise<ResponseApi> => {
  return get(`/material/search?type=${type}`);
};

export const updateMaterial = async (
  id: number,
  data: any
): Promise<ResponseApi> => {
  return put(`/material/${id}`, data);
};

export const getMaterialByID = async (id: number): Promise<ResponseApi> => {
  return get(`/material/${id}`);
};

export const deleteMaterial = async (id: number | null): Promise<ResponseApi> => {
  return remove(`/material/${id}`);
};

//#endregion

// #region CAMPO DE APLICACIÓN
export const createApplicationArea = async (
  data: any
): Promise<ResponseApi> => {
  return post("/application_area", data);
};

export const getApplicationArea = async (): Promise<ResponseApi> => {
  return get("/application_area");
};

export const updateApplicationArea = async (
  id: number,
  data: any
): Promise<ResponseApi> => {
  return put(`/application_area/${id}`, data);
};

export const getApplicationAreaByID = async (
  id: number
): Promise<ResponseApi> => {
  return get(`/application_area/${id}`);
};

export const deleteApplicationArea = async (id: number | null): Promise<ResponseApi> => {
  return remove(`/application_area/${id}`);
};

//#endregion

//#region SISTEMA

export const createSystem = async (data: any): Promise<ResponseApi> => {
  return post("/construction_system", data);
};

export const getSystems = async (): Promise<ResponseApi> => {
  return get("/construction_system");
};

export const getSystemByID = async (id: number): Promise<ResponseApi> => {
  return get(`/construction_system/${id}`);
};

export const updateSystem = async (
  id: number,
  data: any
): Promise<ResponseApi> => {
  return put(`/construction_system/${id}`, data);
};

//#endregion
const post = async (url: string, data: any): Promise<ResponseApi> => {
  try {
    return await api.post(url, data, fetchHeaders());
  } catch (error: any) {
    return error.response;
  }
};

const get = async (url: string): Promise<ResponseApi> => {
  try {
    return await api.get(url, fetchHeaders());
  } catch (error: any) {
    return error.response;
  }
};

const put = async (url: string, data: any): Promise<ResponseApi> => {
  try {
    return await api.put(url, data, fetchHeaders());
  } catch (error: any) {
    return error.response;
  }
};

const remove = async (url: string): Promise<ResponseApi> => {
  try {
    return await api.delete(url, fetchHeaders());
  } catch (error: any) {
    return error.response;
  }
};
