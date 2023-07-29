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
  id?: string;
  product: string;
  brand: string;
  presentationQuantity: string;
  presentationPrice: string;
  type: string;
  priceDate: string;
  presentationUnit: string;
  currency: string;
  component: string;
  potLife?: string;
  minApplicableTemp?: string;
}

// systemForm
interface systemFormInputs {
  id: string;
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
  systemMaterialAreaRestrictions: string;
}

// Login
interface LoginInputs {
  username: string;
  password: string;
}

interface ApplicationAreaInputs {
  id?: string;
  name: string;
  considerations: string;
}

export type {

};

export type {
  ApplicationAreaInputs,
  LoginInputs,
  FormError,
  BackendError,
  MaterialInputs,
  systemFormInputs
};
