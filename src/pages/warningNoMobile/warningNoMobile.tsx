import { TextField } from "@mui/material";
import { ReactComponent as Icon } from "../../assets/icons/warning.svg";
import "./warningNoMobile.css";

const WarningNoMobile = () => {
  return (
    <div className="card-wrapper">
      <h1 className="">Hola!</h1>
      <Icon className="icon" />
      <h3 className="text-description">
        Parece que estás intentando acceder a una funcionalidad que requiere una
        resolución de pantalla mayor.
      </h3>
    </div>
  );
};

export default WarningNoMobile;
