import axios from "axios";
import { ResponseApi }   from "../interfaces/service/ApiInterfaces";

const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
});


export const createMaterial = async (data: any): Promise<ResponseApi> => {
  return post("/material", data);
};

const post = async (url: string, data: any): Promise<ResponseApi> => {
  try {
    return handleRequestResponse(await api.post(url, data));
  } catch (error: any) {
    return handleRequestError(error);
  }
};

const handleRequestResponse = (response: any): ResponseApi => {
  let responseApi: ResponseApi = { data: response.data, error: null, statusCode: response.status }; 
  return responseApi;
};

const handleRequestError = (error: any): ResponseApi => {
  let responseApi: ResponseApi = { data: null, error: null, statusCode: 400 }; 
  if(error?.response?.status && error?.response?.status !== 200) {
    responseApi.statusCode = error.response.status;
    responseApi.error = error.response.data;
  }
  return responseApi;
};

const get = async (url: string): Promise<ResponseApi> => {
  try {
    return await api.get(url);
  } catch (error: any) {
    return error;
  }
};

const put = async (url: string, data: any): Promise<ResponseApi> => {
  try {
    return await api.put(url, data);
  } catch (error: any) {
    return error;
  }
};

const remove = async (url: string): Promise<ResponseApi> =>  {
  try {
    return await api.delete(url);    
  } catch (error: any) {
    return error;
  }
};
