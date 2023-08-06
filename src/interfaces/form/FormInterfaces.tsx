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

// SystemForm
interface SystemFormInputs {
  id?: string | any;
  applicationAreaId: string;
  applicationArea: SystemMaterialApplicationAreaFormInputs | any;
  applicationMode: string;
  cured: boolean | string | any;
  layers: string;
  totalConsumption: string;
  supportConditions: string;
  baseConditions: string;
  materialAreaRestrictions: string;
  materials?: SystemMaterialFormInputs[] | any;
  [key: string]: string; //otros complementos - inputs dinámicos
}

interface SystemMaterialApplicationAreaFormInputs {
  id: string;
  name: string;
  considerations: string;
}

interface Material {
  id: number,
  product: string,
  brand: string,
  presentationQuantity: number,
  presentationUnit: string,
  presentationPrice: number,
  priceDate: string,
  currency: string,
  type: string,
  component: string,
  potLife: number,
  minApplicableTemp: number
}

interface SystemMaterialFormInputs {
  id: string;
  materialId: string;
  typeOfUse: string;
  coefficient?: string;
  description?: string;
  materialDescription?: string;
  coefficientDescription?: string;
  material: Material;
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
  ApplicationAreaInputs,
  LoginInputs,
  FormError,
  BackendError,
  MaterialInputs,
  SystemFormInputs,
  SystemMaterialFormInputs,
  Material,
};
