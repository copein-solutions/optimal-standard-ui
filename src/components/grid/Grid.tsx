import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import "./Grid.css";
import CustomModal from "../modal/customModal";
import { useState } from "react";
import {
  deleteApplicationArea,
  deleteMaterial,
} from "../../services/ApiService";
import { useDispatch } from "react-redux";
import Toast, { ToastType } from "../toast/toast";

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
  navigateTo?: string;
};

export const GridCustom: React.FC<GridProps> = ({
  header,
  body,
  hasEdit,
  hasDelete,
  navigateTo,
}) => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar el modal
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null); // Estado para rastrear el ID del elemento a eliminar
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<ToastType>("success");

  const onDelete = async () => {
    let response: any;
    if (navigateTo === "material") {
      response = await deleteMaterial(deleteItemId);
      callDispatch("DELETE_MATERIAL", response);
    } else if (navigateTo === "application_area") {
      response = await deleteApplicationArea(deleteItemId);
      callDispatch("DELETE_APPLICATION_AREA", response);
    }
  };

  function callDispatch(type: string, response: any) {
    if (response.status !== 200) {
      handleOpenToast(
        "No se puede eliminar el elemento ya que forma parte de un sistema",
        "error"
      );
    } else {
      handleOpenToast("Elemento eliminado con éxito", "success");
      dispatch({ type: type, payload: deleteItemId });
    }
  }

  const deleteButton = (id: number) => (
    <Button
      sx={{
        borderRadius: "50%",
        height: "40px",
        width: "40px",
        minWidth: 0,
      }}
      color="error"
      variant="text"
      onClick={() => openDeleteModal(id)} // Abre el modal al hacer clic en el botón de eliminar
    >
      <DeleteIcon />
    </Button>
  );

  const onEdit = (id: number) => {
    navigator(`/${navigateTo}/${id}/update`);
  };

  const openDeleteModal = (id: number) => {
    setDeleteItemId(id);
    setModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteItemId(null);
    setModalOpen(false);
  };

  const handleOpenToast = (msg: string, type: ToastType) => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
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
      variant="text"
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
                <td key={index}>{item[col.value]}</td>
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
      <Toast
        type={toastType}
        message={toastMsg}
        open={showToast}
        onClose={handleCloseToast}
      />
    </>
  );
};
