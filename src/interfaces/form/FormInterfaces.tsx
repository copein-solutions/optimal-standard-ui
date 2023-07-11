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

interface MaterialInputs {
  materialName: string;
  materialBrand: string;
  materialQuantity: string;
  materialPrice: string;
  materialType: string;
  materialComponents: string;
  materialUnit: string;
  materialCurrency: string;
}

interface ApplicationAreaInputs {
  appAreaName: string;
  appAreaConsiderations: string;
}

export type { FormError, BackendError, MaterialInputs, ApplicationAreaInputs };
