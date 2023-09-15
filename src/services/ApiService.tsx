import axios, { AxiosRequestConfig } from "axios";
import { ResponseApi } from "../interfaces/service/ApiInterfaces";

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
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
  return post("/public/login", data);
};

export const logout = async (): Promise<ResponseApi> => {
  return post("/user/logout", {});
};
//#endregion

//#region MATERIAL
export const createMaterial = async (data: any): Promise<ResponseApi> => {
  return post("/admin/material", data);
};

export const getMaterials = async (): Promise<ResponseApi> => {
  return get("/user/material");
};

export const getMaterialsByType = async (
  type: string
): Promise<ResponseApi> => {
  return get(`/admin/material/search?type=${type}`);
};

export const updateMaterial = async (
  id: number,
  data: any
): Promise<ResponseApi> => {
  return put(`/admin/material/${id}`, data);
};

export const getMaterialByID = async (id: number): Promise<ResponseApi> => {
  return get(`/admin/material/${id}`);
};

export const deleteMaterial = async (
  id: number | null
): Promise<ResponseApi> => {
  return remove(`/admin/material/${id}`);
};

export const getMaterialFileById = (id: number) => {
  return `${API_BASE_URL}/public/file/load?file_id=${id}`;
};

export const getXlsxFile = () => {
  return `${API_BASE_URL}/public/generate_report`;
};

//#endregion

// #region CAMPO DE APLICACIÓN
export const createApplicationArea = async (
  data: any
): Promise<ResponseApi> => {
  return post("/admin/application_area", data);
};

export const getApplicationArea = async (): Promise<ResponseApi> => {
  return get("/user/application_area");
};

export const updateApplicationArea = async (
  id: number,
  data: any
): Promise<ResponseApi> => {
  return put(`/admin/application_area/${id}`, data);
};

export const getApplicationAreaByID = async (
  id: number
): Promise<ResponseApi> => {
  return get(`/admin/application_area/${id}`);
};

export const deleteApplicationArea = async (
  id: number | null
): Promise<ResponseApi> => {
  return remove(`/admin/application_area/${id}`);
};

//#endregion

//#region SISTEMA
export const createSystem = async (data: any): Promise<ResponseApi> => {
  return post("/admin/construction_system", data);
};

export const getSystems = async (): Promise<ResponseApi> => {
  return get("/user/construction_system");
};

export const getSystemByID = async (id: number): Promise<ResponseApi> => {
  return get(`/user/construction_system/${id}`);
};

export const updateSystem = async (
  id: number,
  data: any
): Promise<ResponseApi> => {
  return put(`/admin/construction_system/${id}`, data);
};

export const deleteSystem = async (id: number | null): Promise<ResponseApi> => {
  return remove(`/admin/construction_system/${id}`);
};

export const createSystemComment = async (
  id: number,
  data: any
): Promise<ResponseApi> => {
  return post(`/user/construction_system/${id}/comment`, data);
};

export const getSystemComment = async (id: number): Promise<ResponseApi> => {
  return get(`/user/construction_system/${id}/comment`);
};

export const deleteSystemComment = async (
  id: number | null
): Promise<ResponseApi> => {
  return remove(`/user/construction_system/comment/${id}`);
};

export const updateSystemComment = async (
  id: number,
  data: any
): Promise<ResponseApi> => {
  return put(`/admin/construction_system/${id}/comment`, data);
};

export const setSystemCommentStatus = async (
  id: number,
  data: any
): Promise<ResponseApi> => {
  return put(`/admin/construction_system/comment_status/${id}`, data);
};

export const setSystemCategory = async (
  id: number,
  data: any
): Promise<ResponseApi> => {
  return put(`/admin/construction_system/${id}/stdo`, data);
};

//#endregion

//#region GLOBAL VARIABLES

export const getQuotationDollar = async (): Promise<ResponseApi> => {
  return get("/user/global_variable/quotation_dollar");
};

export const saveDollarRate = async (data: any): Promise<ResponseApi> => {
  return post("/admin/global_variable/quotation_dollar", data);
};

export const getLaborCost = async (): Promise<ResponseApi> => {
  return get("/user/global_variable/labor_cost");
};

export const saveLaborCost = async (data: any): Promise<ResponseApi> => {
  return post("/admin/global_variable/labor_cost", data);
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
