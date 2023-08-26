import React, { useRef } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import StarsIcon from "@mui/icons-material/Stars";
import CommentIcon from "@mui/icons-material/Comment";
import { useNavigate } from "react-router-dom";
import "./Grid.css";
import CustomModal from "../modal/customModal";
import { useState } from "react";
import {
  createSystemComment,
  deleteApplicationArea,
  deleteMaterial,
} from "../../services/ApiService";
import { useDispatch } from "react-redux";
import Toast, { ToastType } from "../toast/toast";

import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridColumnGroupingModel,
  esES,
} from "@mui/x-data-grid";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type Header = {
  name: string;
  value: string;
  width?: number;
  description?: string;
};

type RowData = {
  id: number;
  [key: string]: any;
  actions: React.ReactNode;
};

type GridProps = {
  /** Titulos de columna.  */
  header?: Header[];
  /** Titulos de columna agrupados.  */
  columnGroupingModel?: GridColumnGroupingModel;
  /** Datos que se desplegaran en la lista. */
  body?: { id: number; [key: string]: any }[];
  /** Si es true, se renderizará el botón de editar elemento. */
  hasEdit?: boolean;
  /** Si es true, se renderizará el botón de eliminar elemento. */
  hasDelete?: boolean;
  /** Si es true, se renderizará el botón para categorizar el sistema. */
  hasCategory?: boolean;
  /** Si es true, se renderizará el botón de comentar elemento. */
  hasComment?: boolean;
  /** String que indica la url a la cual redireccionará el botón de edit. */
  navigateTo?: string;
};

export const GridCustom: React.FC<GridProps> = ({
  header,
  body,
  hasEdit,
  hasDelete,
  hasCategory,
  hasComment,
  navigateTo,
  columnGroupingModel,
}) => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalWithChildrenOpen, setModalWithChildrenOpen] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [systemItemId, setSystemItemId] = useState<number | null>(null);
  const [commentItemId, setCommentItemId] = useState<number | null>(null);
  const [commentValue, setCommentValue] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<ToastType>("success");
  const [selectedOption, setSelectedOption] = useState("");

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
    <Tooltip title="Eliminar" placement="top">
      <Button
        sx={{
          borderRadius: "50%",
          height: "40px",
          width: "40px",
          minWidth: 0,
          marginRight: "20px",
        }}
        color="error"
        onClick={() => openDeleteModal(id)}
      >
        <DeleteIcon fontSize="large" />
      </Button>
    </Tooltip>
  );

  const onComment = async () => {
    const data = {
      comment: commentValue,
    };
    if (commentItemId) {
      let response: any = await createSystemComment(commentItemId, data);
      if (response.status !== 200) {
        handleOpenToast(
          "Algo salió mal al enviar tu comentario.",
          "error"
        );
      } else {
        handleOpenToast("Comentario registrado con éxito.", "success");
      }
    }
    setCommentValue("");
  };

  const commentButton = (id: number) => (
    <Tooltip title="Dejar un comentario" placement="top">
      <Button
        sx={{
          borderRadius: "50%",
          height: "40px",
          width: "40px",
          minWidth: 0,
          marginRight: "20px",
        }}
        color="success"
        onClick={() => openCommentModal(id)}
      >
        <CommentIcon />
      </Button>
    </Tooltip>
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

  const openCommentModal = (id: number) => {
    setCommentItemId(id);
    setCommentModalOpen(true);
  };

  const closeCommentModal = () => {
    setCommentItemId(null);
    setCommentModalOpen(false);
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
    <Tooltip title="Editar" placement="top">
      <Button
        sx={{
          borderRadius: "50%",
          height: "40px",
          width: "40px",
          minWidth: 0,
          marginRight: "20px",
        }}
        color="success"
        onClick={() => onEdit(id)}
      >
        <EditIcon fontSize="large" color="primary" />
      </Button>
    </Tooltip>
  );

  const categoryButton = (id: number) => (
    <Tooltip title="Categorizar" placement="top">
      <Button
        sx={{
          borderRadius: "50%",
          height: "40px",
          width: "40px",
          minWidth: 0,
        }}
        color="success"
        onClick={() => openSetCategoryModal(id)}
      >
        <StarsIcon fontSize="large" />
      </Button>
    </Tooltip>
  );

  const openSetCategoryModal = (id: number) => {
    setSystemItemId(id);
    setModalWithChildrenOpen(true);
  };

  const closeCategoryModal = () => {
    setSystemItemId(null);
    setModalWithChildrenOpen(false);
  };

  const handleConfirmCategorization = async () => {
    setModalWithChildrenOpen(false);
    if (systemItemId) {
      // TODO: crear llamara a api que setee STDO / STDOA
      if (selectedOption === "optimalStandard") {
        console.log("estandar optimo");
      }
      if (selectedOption === "alternativeOptimalStandard") {
        console.log("estandar optimo alternativo");
      }
    }
  };

  const handleOptionChange = (event: SelectChangeEvent<string>) => {
    setSelectedOption(event.target.value);
  };

  const modalChildren = (
    <FormControl fullWidth size="small">
      <InputLabel id="select-label">Seleccioná una opción</InputLabel>
      <Select
        labelId="select-label"
        label="Selecciona una opción"
        value={selectedOption}
        onChange={handleOptionChange}
      >
        <MenuItem value="optimalStandard">Estándar Óptimo</MenuItem>
        <MenuItem value="alternativeOptimalStandard">
          Estándar Óptimo Alternativo
        </MenuItem>
      </Select>
    </FormControl>
  );

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

  const formatRows: RowData[] = [];
  body?.forEach((item, index) => {
    const rowData: RowData = { id: index + 1, actions: <></> };
    header?.forEach((col) => {
      rowData[col.value] = item[col.value];
    });
    if (hasEdit || hasDelete || hasComment || hasCategory) {
      rowData.actions = (
        <>
          {hasEdit && <>{editButton(item.id)}</>}
          {hasDelete && <>{deleteButton(item.id)}</>}
          {hasCategory && <>{categoryButton(item.id)}</>}
          {hasComment && <>{commentButton(item.id)}</>}
        </>
      );
    }
    formatRows.push(rowData);
  });

  const columns: GridColDef[] =
    header?.map((col) => ({
      field: col.value,
      headerName: col.name,
      width: col.width ? col.width : 150,
      description: col.description,
    })) || [];

  if (hasEdit || hasDelete || hasComment || hasCategory) {
    columns.push({
      field: "actions",
      headerName: "",
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => params.value,
    });
  }

  const onCellClick = () => {
    setToastMsg("Row clicked, not implemented.");
    setShowToast(true);
  };

  function SortedDescendingIcon() {
    return <ExpandMoreIcon className="icon" />;
  }

  function SortedAscendingIcon() {
    return <ExpandLessIcon className="icon" />;
  }

  return (
    <div className="data-grid-wrapper">
      <DataGrid
        rows={formatRows}
        columns={columns}
        slots={{
          toolbar: GridToolbar,
          columnSortedDescendingIcon: SortedDescendingIcon,
          columnSortedAscendingIcon: SortedAscendingIcon,
        }}
        slotProps={{ toolbar: { showQuickFilter: true } }}
        disableDensitySelector
        disableRowSelectionOnClick
        hideFooter
        onCellDoubleClick={onCellClick}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        experimentalFeatures={{ columnGrouping: true }}
        columnGroupingModel={columnGroupingModel}
      />
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
      {modalWithChildrenOpen && (
        <CustomModal
          open={modalWithChildrenOpen}
          onClose={closeCategoryModal}
          title="Seleccione la categorización del sistema"
          children={modalChildren}
          onConfirm={() => {
            handleConfirmCategorization();
            closeCategoryModal();
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
    </div>
  );
};
