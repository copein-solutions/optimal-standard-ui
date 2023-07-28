import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import "./Grid.css";

type Header = {
  name: string;
  value: string;
};

type GridProps = {
  /** Titulos de columna.  */
  header?: Header[];
  /** Datos que se desplegaran en la lista. */
  body?: { id: number; [key: string]: any }[];
  /** Si es true, se renderizará el botón de editar elemento. */
  hasEdit?: boolean;
  /** Si es false, se renderizará el botón de eliminar elemento. */
  hasDelete?: boolean;
  /** String que indica la url a la cual redireccionará el botón de edit. */
  editNav?: string;
};

export const GridCustom: React.FC<GridProps> = ({
  header,
  body,
  hasEdit,
  hasDelete,
  editNav,
}) => {
  const navigator = useNavigate();

  const onDelete = async (id: number) => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const onEdit = (id: number) => {
    console.log("edit", id);
    navigator(`/${editNav}/${id}/update`);
  };

  const editButton = (id: number) => (
    <Button
      sx={{
        borderRadius: "50%",
        height: "40px",
        width: "40px",
        minWidth: 0,
      }}
      color="success"
      variant="contained"
      onClick={() => onEdit(id)}
    >
      <EditIcon />
    </Button>
  );

  const deleteButton = (id: number) => (
    <Button
      sx={{
        borderRadius: "50%",
        height: "40px",
        width: "40px",
        minWidth: 0,
      }}
      color="error"
      variant="contained"
      onClick={() => onDelete(id)}
    >
      <DeleteIcon />
    </Button>
  );

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            {header?.map((item, index) => (
              <th key={index}>{item.name}</th>
            ))}
            {hasEdit && <th></th>}
            {hasDelete && <th></th>}
          </tr>
        </thead>
        <tbody>
          {body?.map((item, index) => (
            <tr key={index}>
              {header?.map((col, index) => (
                <td key={index}>{item[col.value]}</td>
              ))}
              {hasEdit && <td>{editButton(item.id)}</td>}
              {hasDelete && <td>{deleteButton(item.id)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
