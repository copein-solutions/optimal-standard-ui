import axios from "axios";
import { ResponseApi }   from "../interfaces/service/ApiInterfaces";

const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// #region MATERIAL
export const createMaterial = async (data: any): Promise<ResponseApi> => {
  return post("/material", data);
};

export const getMaterials = async (): Promise<ResponseApi> =>  {
  return get("/materials");
}

export const updateMaterial = async (id: number, data: any): Promise<ResponseApi> => {
  return put(`/material/${id}`, data);
};

export const getMaterialByID = async (id: number): Promise<ResponseApi> => {
  return get(`/material/${id}`);
};

//#endregion

// #region CAMPO DE APLICACIÓN
export const createApplicationArea = async (data: any): Promise<ResponseApi> =>  {
  return post("/application_area", data);
}

export const getApplicationArea = async (): Promise<ResponseApi> =>  {
  return get("/application_areas");
}

//#endregion

const post = async (url: string, data: any): Promise<ResponseApi> => {
  try {
    return await api.post(url, data);
  } catch (error: any) {
    return error.response;
  }
};

const get = async (url: string): Promise<ResponseApi> => {
  try {
    return await api.get(url);
  } catch (error: any) {
    return error.response;
  }
};

const put = async (url: string, data: any): Promise<ResponseApi> => {
  try {
    return await api.put(url, data);
  } catch (error: any) {
    return error.response;
  }
};

const remove = async (url: string): Promise<ResponseApi> =>  {
  try {
    return await api.delete(url);    
  } catch (error: any) {
    return error.response;
  }
};
