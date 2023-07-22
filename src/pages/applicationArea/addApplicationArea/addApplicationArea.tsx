import { MainContainer } from "../../../components/mainContainer/MainContainer";
import ApplicationAreaForm from "../applicationAreaForm/ApplicationAreaForm"
import "./addApplicationArea.css";

const AddApplicationArea = () => {
  return (
    <MainContainer cardTitle="Alta de campo de aplicación">
      <ApplicationAreaForm isUpdateForm={ false }/>
    </MainContainer>
  );
};

export default AddApplicationArea;