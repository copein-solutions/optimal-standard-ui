import { MainContainer } from "../mainContainer/MainContainer";
import TextField from "@mui/material/TextField";

type MaterialFormProps = {};

export const MaterialForm: React.FC<MaterialFormProps> = ({}) => {
  return (
    <MainContainer cardTitle="Alta de material">
      <TextField label="Nombre" variant="outlined" />
    </MainContainer>
  );
};
