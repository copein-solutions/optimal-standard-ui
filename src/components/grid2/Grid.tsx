import React from "react";
import { Button, Tooltip } from "@mui/material";
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

import { DataGrid, GridColDef, GridToolbar, esES } from "@mui/x-data-grid";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
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
    <Tooltip title="Eliminar" placement="top">
      <Button
        sx={{
          borderRadius: "50%",
          height: "40px",
          width: "40px",
          minWidth: 0,
        }}
        color="error"
        variant="contained"
        onClick={() => openDeleteModal(id)}
      >
        <DeleteIcon />
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
        variant="contained"
        onClick={() => onEdit(id)}
      >
        <EditIcon />
      </Button>
    </Tooltip>
  );

  const formatRows: RowData[] = [];
  body?.forEach((item, index) => {
    const rowData: RowData = { id: index + 1, actions: <></> };
    header?.forEach((col) => {
      rowData[col.value] = item[col.value];
    });
    if (hasEdit || hasDelete) {
      rowData.actions = (
        <>
          {hasEdit && <>{editButton(item.id)}</>}
          {hasDelete && <>{deleteButton(item.id)}</>}
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

  if (hasEdit || hasDelete) {
    columns.push({
      field: "actions",
      headerName: "",
      width: 150,
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
      <Toast
        type={toastType}
        message={toastMsg}
        open={showToast}
        onClose={handleCloseToast}
      />
    </div>
  );
};
