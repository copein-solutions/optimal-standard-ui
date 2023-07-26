import { MainContainer } from "../../../components/mainContainer/MainContainer";
import SystemForm from "../systemForm"
import "./addSystem.css";

const AddMaterial = () => {
  return (
    <MainContainer cardTitle="Alta de sistema">
      <SystemForm/>
    </MainContainer>
  );
};

export default AddMaterial;