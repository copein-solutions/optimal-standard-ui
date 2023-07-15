import { MainContainer } from "../../../components/mainContainer/MainContainer";
import MaterialForm from "../materialForm"
import "./addMaterial.css";

const AddMaterial = () => {
  return (
    <MainContainer cardTitle="Alta de material">
      <MaterialForm/>
    </MainContainer>
  );
};

export default AddMaterial;