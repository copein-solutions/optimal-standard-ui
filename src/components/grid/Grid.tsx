import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

type Column = {
  name: string;
  value: string;
};

// type BodyRow = {
//   value: string;
//   name: string;
// };

type GridProps = {
  /** Titulos de columna.  */
  columns?: Column[];
  /** Datos que se desplegaran en la lista. */
  rows?: any[];
  hasEdit?: boolean;
  hasDelete?: boolean;
};

export const GridCustom: React.FC<GridProps> = ({
  columns,
  rows,
  hasEdit,
  hasDelete,
}) => {
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
    <>
      <table className="table table-hover">
        <thead>
          {columns?.map((item, index) => (
            <th>{item.name}</th>
          ))}
          {hasEdit && (<th></th>)}
          {hasDelete && (<th></th>)}
        </thead>
        <tbody>
          {rows?.map((item, index) => (
            <tr key={index}>
              {columns?.map((col) => (
                <th>{item[col.value]}</th>
              ))}
              {hasEdit && (
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
              )}
              {hasDelete && (
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
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
