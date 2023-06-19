import { useDispatch, useSelector } from "react-redux";

import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ApplicationAreaRow = ({
    applicationAreaName,
    applicationAreaSpecification
  }: {
    applicationAreaName: string;
    applicationAreaSpecification: string;
  }) => {
  //   const { apiKey } = useSelector((state) => state.user.loggedUser);

  //   const dispatch = useDispatch();

  const onEdit = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <tr>
      <td>{applicationAreaName}</td>
      <td>{applicationAreaSpecification}</td>
      <td>
        <Button
          sx={{
            borderRadius: "20%",
            height: "45px",
            width: "45px",
            minWidth: 0,
          }}
          color="success"
          variant="contained"
          onClick={onEdit}
        >
          <EditIcon />
        </Button>
      </td>
      <td>
        <Button
          sx={{
            borderRadius: "20%",
            height: "45px",
            width: "45px",
            minWidth: 0,
          }}
          color="error"
          variant="contained"
          onClick={onDelete}
        >
          <DeleteIcon />
        </Button>
      </td>
    </tr>
  );
};

export default ApplicationAreaRow;