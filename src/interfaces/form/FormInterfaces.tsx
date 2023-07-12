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

interface EditMaterialInputs {
  materialName: string;
  materialBrand: string;
  materialQuantity: string;
  materialPrice: string;
  materialType: string;
  materialComponents: string;
  materialUnit: string;
  materialCurrency: string;
}

// systemForm
interface systemFormInputs {
  systemApplicacionArea: string;
  systemMaterial: string;
  systemTotalConsumption: string;
  systemMaterialLayers: string;
  systemApplicationMode: string;
  systemCured: string;
  systemComplementaryMaterial: string;
  systemMeshHundredPercent: string; // Si / No 
  systemMeshHundredPercentName: string;
  systemParcialMesh: string; // Si / No
  systemParcialMeshName: string;
  systemParcialMeshCoefficient: string;
  systemParcialMeshComents: string;
  [key: string]: string; //otros complementos - inputs dinámicos
  systemBasicConditions: string;
  systemSupportConditions: string;
}

interface ApplicationAreaInputs {
  id?: string;
  name: string;
  considerations: string;
}

export type { FormError, BackendError, EditMaterialInputs, systemFormInputs, ApplicationAreaInputs };