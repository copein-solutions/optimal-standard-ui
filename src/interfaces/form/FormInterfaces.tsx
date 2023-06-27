interface FormError {
  field: string;
  message: string;
  showError: boolean;
}

interface BackendError {
  field: string;
  message: string;
  showError: boolean;
}

interface Inputs {
  materialName: string;
  materialBrand: string;
  materialQuantity: string;
  materialPrice: string;
  materialType: string;
  materialComponents: string;
  materialUnity: string;
  materialCurrency: string;
}

export type { FormError, BackendError, Inputs };
