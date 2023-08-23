import { MainContainer } from "../../../components/mainContainer/MainContainer";
import MaterialForm from "../materialForm";
import "./addMaterial.css";
import WarningNoMobile from "../../warningNoMobile/warningNoMobile";
import useIsMobile from "../../../utils/hooks";

const AddMaterial = () => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <WarningNoMobile />
  ) : (
    <MainContainer cardTitle="Alta de material">
      <MaterialForm />
    </MainContainer>
  );
};

export default AddMaterial;
