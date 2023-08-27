import { Button, FormControl, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import "./Grid.css";
import CustomModal from "../modal/customModal";
import { useState } from "react";
import {
  deleteApplicationArea,
  deleteMaterial,
  deleteSystemComment,
  updateSystemComment,
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
  const [systemId, setSystemId] = useState<number | null>(null);
  const [commentItemId, setCommentItemId] = useState<number | null>(null);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [commentValue, setCommentValue] = useState("");

  const onDelete = async () => {
    let response: any;
    if (navigateTo === "material") {
      response = await deleteMaterial(deleteItemId);
      callDispatch("DELETE_MATERIAL", response);
    } else if (navigateTo === "application_area") {
      response = await deleteApplicationArea(deleteItemId);
      callDispatch("DELETE_APPLICATION_AREA", response);
    } else if (navigateTo === "comment") {
      response = await deleteSystemComment(deleteItemId);
      if (response.status !== 200) {
        handleOpenToast(
          response.data.message,
          "error"
        );
      } else {
        handleOpenToast("Elemento eliminado con éxito", "success");
        dispatch({ type: "DELETE_COMMENT", payload: deleteItemId });
      }
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

  const onEdit = (data: any) => {
    if (navigateTo !== "comment") {
      navigator(`/${navigateTo}/${data.id}/update`);
    } else {
      setCommentItemId(data.id);
      setSystemId(data.constructionSystemId);
      setCommentModalOpen(true);
    }
  };

  const openDeleteModal = (id: number) => {
    setDeleteItemId(id);
    setModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteItemId(null);
    setModalOpen(false);
  };

  const closeCommentModal = () => {
    setCommentItemId(null);
    setCommentModalOpen(false);
  };

  const onComment = async () => {
    console.log(commentItemId, systemId);

    if (commentItemId && systemId) {
      const data = {
        id: commentItemId,
        comment: commentValue,
      };
      let response: any = await updateSystemComment(systemId, data);
      console.log(response);

      if (response.status !== 200) {
        let message = "Algo salió mal al enviar tu comentario.";
        if (response.data.message) message = response.data.message;
        handleOpenToast(message, "error");
      } else {
        handleOpenToast("Comentario registrado con éxito.", "success");
      }
    }
    setCommentValue("");
  };

  const handleCommentChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setCommentValue(event.target.value);
  };

  const modalCommentChildren = (
    <div style={{ height: "150px", width: "600px" }}>
      <FormControl fullWidth size="small">
        <TextField
          name="Comentario"
          value={commentValue}
          onChange={handleCommentChanged}
          minRows={5}
          multiline
        ></TextField>
      </FormControl>
    </div>
  );

  const handleOpenToast = (msg: string, type: ToastType) => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const editButton = (comment: any) => (
    <Button
      sx={{
        borderRadius: "50%",
        height: "40px",
        width: "40px",
        minWidth: 0,
      }}
      color="success"
      variant="text"
      onClick={() => onEdit(comment)}
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
              {hasEdit && <td>{editButton(item)}</td>}
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
      {commentModalOpen && (
        <CustomModal
          open={commentModalOpen}
          onClose={closeCommentModal}
          title="Comentar"
          children={modalCommentChildren}
          onConfirm={() => {
            onComment();
            closeCommentModal();
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
