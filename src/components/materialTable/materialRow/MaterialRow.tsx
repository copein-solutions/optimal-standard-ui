import { useDispatch, useSelector } from "react-redux";

import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const MaterialRow = ({
    materialName,
    materialBrand,
    materialPrice,
    materialUnity,
    materialQuantity,
    materialType,
    materialComponent,
    priceDate,
  }: {
    materialName: string;
    materialBrand: string;
    materialPrice: number;
    materialUnity: string;
    materialQuantity: number;
    materialType: string;
    materialComponent: string;
    priceDate: string;
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
      <td>{materialName}</td>
      <td>{materialBrand}</td>
      <td>{materialPrice}</td>
      <td>{materialType}</td>
      <td>{materialQuantity}</td>
      {/* <td>{materialComponent}</td> */}
      <td>{materialUnity}</td>
      <td>{priceDate}</td>
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

export default MaterialRow;
