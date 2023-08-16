import React from "react";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import "./Grid.css";

import { DataGrid, GridRowsProp, GridColDef, GridToolbar } from "@mui/x-data-grid";

type Header = {
  name: string;
  value: string;
};

type RowData = {
  id: number;
  [key: string]: any;
  actions: React.ReactNode;
};

type GridProps = {
  header?: Header[];
  body?: { id: number; [key: string]: any }[];
  hasEdit?: boolean;
  hasDelete?: boolean;
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
      // Agregar aquí la lógica para eliminar
    } catch (error) {
      console.log(error);
    }
  };

  const onEdit = (id: number) => {
    navigator(`/${editNav}/${id}/update`);
  };

  const formatRows: RowData[] = [];
  body?.forEach((item, index) => {
    const rowData: RowData = { id: index + 1, actions: <></> };
    header?.forEach((col) => {
      rowData[col.name] = item[col.value];
    });
    if (hasEdit || hasDelete) {
      rowData.actions = (
        <>
          {hasEdit && (
            <Button
              sx={{
                borderRadius: "50%",
                height: "40px",
                width: "40px",
                minWidth: 0,
              }}
              color="success"
              variant="contained"
              onClick={() => onEdit(item.id)}
            >
              <EditIcon />
            </Button>
          )}
          {hasDelete && (
            <Button
              sx={{
                borderRadius: "50%",
                height: "40px",
                width: "40px",
                minWidth: 0,
              }}
              color="error"
              variant="contained"
              onClick={() => onDelete(item.id)}
            >
              <DeleteIcon />
            </Button>
          )}
        </>
      );
    }
    formatRows.push(rowData);
  });

  const columns: GridColDef[] = header?.map((col) => ({
    field: col.name,
    headerName: col.value,
    width: 150,
  })) || [];

  if (hasEdit || hasDelete) {
    columns.push({
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => params.value,
    });
  }

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={formatRows} columns={columns} 
      slots={ {toolbar: GridToolbar} }/>
    </div>
  );
};
