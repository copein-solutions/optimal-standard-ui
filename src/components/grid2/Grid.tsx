import React from "react";
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
  deleteSystem,
  setSystemCategory,
} from "../../services/ApiService";
import { useDispatch, useSelector } from "react-redux";
import Toast, { ToastType } from "../toast/toast";

import {
  GridColDef,
  GridColumnGroupingModel,
  esES,
  GridCellParams,
  DataGrid,
  GridToolbar,
} from "@mui/x-data-grid";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { RootState } from "../../redux/reducers/reducer";

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
  /** Si es true, se renderizará el botón de visualizar comentarios del elemento. */
  hasViewComment?: boolean;
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
  hasViewComment,
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
  const [applicationAreaName, setApplicationAreaName] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<ToastType>("success");
  const [selectedOption, setSelectedOption] = useState("");

  const systems = useSelector((state: RootState) => state.systems);

  const onDelete = async () => {
    let response: any;
    if (navigateTo === "material") {
      response = await deleteMaterial(deleteItemId);
      callDispatch("DELETE_MATERIAL", response);
    } else if (navigateTo === "application_area") {
      response = await deleteApplicationArea(deleteItemId);
      callDispatch("DELETE_APPLICATION_AREA", response);
    } else if (navigateTo === "system") {
      response = await deleteSystem(deleteItemId);
      callDispatch("DELETE_SYSTEM", response);
    }
  };

  function callDispatch(type: string, response: any) {
    if (response.status !== 200) {
      handleOpenToast("No se puede eliminar el elemento", "error");
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
        handleOpenToast("Algo salió mal al enviar tu comentario.", "error");
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

  const viewCommentButton = (id: number) => {
    <Tooltip title="Ver comentarios" placement="top">
      <Button
        sx={{
          borderRadius: "50%",
          height: "40px",
          width: "40px",
          minWidth: 0,
          marginRight: "20px",
        }}
        color="info"
        onClick={() => navigator(`/system/${id}/comments`)}
      >
        <CommentIcon />
      </Button>
    </Tooltip>;
  };

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

  const categoryButton = (system: any) => (
    <Tooltip title="Categorizar" placement="top">
      <Button
        sx={{
          borderRadius: "50%",
          height: "40px",
          width: "40px",
          minWidth: 0,
        }}
        color="success"
        onClick={() => openSetCategoryModal(system)}
      >
        <StarsIcon fontSize="large" />
      </Button>
    </Tooltip>
  );

  const openSetCategoryModal = (system: any) => {
    setSystemItemId(system.id);
    setApplicationAreaName(system.applicationAreaName);
    setModalWithChildrenOpen(true);
  };

  const closeCategoryModal = () => {
    setSystemItemId(null);
    setApplicationAreaName("");
    setSelectedOption("");
    setModalWithChildrenOpen(false);
  };

  const handleConfirmCategorization = async () => {
    setModalWithChildrenOpen(false);
    const type = { type: selectedOption };

    if (systemItemId) {
      const response: any = await setSystemCategory(systemItemId, type);
      if (response.status !== 200) {
        handleOpenToast(
          "Algo salió mal al definir el estándar óptimo.",
          "error"
        );
      } else {
        if (selectedOption === "OPTIMAL_STANDARD") {
          dispatch({ type: "SET_OPTIMAL_STANDARD", payload: systemItemId });
          handleOpenToast("Nuevo estándar optimo definido.", "success");
        }
        if (selectedOption === "ALTERNATIVE_OPTIMAL_STANDARD") {
          dispatch({
            type: "SET_ALTERNATIVE_OPTIMAL_STANDARD",
            payload: systemItemId,
          });
          handleOpenToast(
            "Nuevo estándar óptimo alternativo definido.",
            "success"
          );
        }
      }
    }
    setSelectedOption("");
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
        <MenuItem value="OPTIMAL_STANDARD">Estándar óptimo</MenuItem>
        <MenuItem value="ALTERNATIVE_OPTIMAL_STANDARD">
          Estándar óptimo alternativo
        </MenuItem>
        <MenuItem value="REMOVE">Quitar categorización</MenuItem>
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
    if (hasEdit || hasDelete || hasComment || hasCategory || hasViewComment) {
      rowData.actions = (
        <>
          {hasEdit && <>{editButton(item.id)}</>}
          {hasDelete && <>{deleteButton(item.id)}</>}
          {hasCategory && <>{categoryButton(item)}</>}
          {hasComment && <>{commentButton(item.id)}</>}
          {hasViewComment && <>{viewCommentButton(item.id)}</>}
        </>
      );
    }
    formatRows.push(rowData);
  });

  // TODO: ver como hacer que esto no se dispare todo el tiempo
  const getRowClassName = (params: any) => {
    const otimalStandardIds: number[] = [];
    const alternativeOtimalStandardIds: number[] = [];

    for (const objeto of systems) {
      if (objeto.systemCategory === "OPTIMAL_STANDARD") {
        otimalStandardIds.push(objeto.id);
      }
      if (objeto.systemCategory === "ALTERNATIVE_OPTIMAL_STANDARD") {
        alternativeOtimalStandardIds.push(objeto.id);
      }
    }

    if (otimalStandardIds.includes(params.row.id)) {
      return "optimal-standard-color";
    }
    if (alternativeOtimalStandardIds.includes(params.row.id)) {
      return "alternative-optimal-standard-color";
    }
    return "";
  };

  const columns: GridColDef[] =
    header?.map((col) => ({
      field: col.value,
      headerName: col.name,
      width: col.width ? col.width : 150,
      description: col.description,
    })) || [];

  if (hasEdit || hasDelete || hasComment || hasCategory || hasViewComment) {
    columns.push({
      field: "actions",
      headerName: "",
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => params.value,
    });
  }

  const onCellClick = (params: GridCellParams) => {
    console.log(params.row.id);
    const systemId = params.row.id;
    navigator(`/system/${systemId}/view`);
    // setToastMsg("Row clicked, not implemented.");
    // setShowToast(true);
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
        getRowClassName={getRowClassName}
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
          description={`Campo de aplicación: ${applicationAreaName}`}
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
