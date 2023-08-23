import { MainContainer } from "../../../components/mainContainer/MainContainer";
import SystemForm from "../systemForm";
import useIsMobile from "../../../utils/hooks";
import WarningNoMobile from "../../warningNoMobile/warningNoMobile";
import "./addSystem.css";

const AddMaterial = () => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <WarningNoMobile />
  ) : (
    <MainContainer cardTitle="Alta de sistema">
      <SystemForm isUpdateForm={false} />
    </MainContainer>
  );
};

export default AddMaterial;
