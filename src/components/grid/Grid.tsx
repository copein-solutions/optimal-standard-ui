import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import "./Grid.css";
import { Check } from "@mui/icons-material";
import CustomModal from "../modal/customModal";
import { useState } from "react";
import { deleteMaterial } from "../../services/ApiService";
import { useDispatch } from "react-redux";

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
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar el modal
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null); // Estado para rastrear el ID del elemento a eliminar

  const onDelete = async () => {
    try {
      deleteMaterial(deleteItemId);
      dispatch({ type: "DELETE_MATERIAL", payload: deleteItemId});
    } catch (error) {
      console.log(error);
    }
  };

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
      onClick={() => openDeleteModal(id)} // Abre el modal al hacer clic en el botón de eliminar
    >
      <DeleteIcon />
    </Button>
  );

  const onEdit = (id: number) => {
    navigator(`/${editNav}/${id}/update`);
  };

  const openDeleteModal = (id: number) => {
    setDeleteItemId(id); // Establece el ID del elemento a eliminar
    setModalOpen(true); // Abre el modal
  };

  const closeDeleteModal = () => {
    setDeleteItemId(null); // Reinicia el ID del elemento a eliminar
    setModalOpen(false); // Cierra el modal
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
                <td key={index}>
                  {item[col.value] === "si" ? (
                    <Check />
                  ) : item[col.value] === "no" ? (
                    ""
                  ) : (
                    item[col.value]
                  )}
                </td>
              ))}
              {hasEdit && <td>{editButton(item.id)}</td>}
              {hasDelete && <td>{deleteButton(item.id)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {modalOpen && (
        <CustomModal
          open={modalOpen}
          onClose={closeDeleteModal}
          title="Eliminar Elemento"
          description="¿Estás seguro de que deseas eliminar este elemento?"
          onConfirm={() => {
            onDelete();
            closeDeleteModal();
          }}
        />
      )}
    </>
  );
};
