interface Response {
  data: any;
  status: number;
  response: HandlerError;
}

interface HandlerError {
  data: ErrorData;
  status: number;
}

interface ErrorData {
  message: string;
  validationErrors: ValidationErrors;
}

interface ValidationErrors {
  name: string;
}

interface ResponseApi {
  data: any,
  error: any,
  statusCode: number,
}


export type { Response, HandlerError, ValidationErrors, ErrorData, ResponseApi };