import { MainContainer } from "../../../components/mainContainer/MainContainer";
import SystemForm from "../systemForm"
import "./addSystem.css";

const AddMaterial = () => {
  return (
    <MainContainer cardTitle="Alta de sistema">
      <SystemForm isUpdateForm={false}/>
    </MainContainer>
  );
};

export default AddMaterial;