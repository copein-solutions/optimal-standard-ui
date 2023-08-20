import * as React from "react";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type CustomToolbarProps = {
  value: string;
  onChange: (value: string) => void;
};

const CustomToolbar: React.FC<CustomToolbarProps> = ({ value, onChange }) => {
  return (
    <GridToolbarContainer>
      <TextField
        label="Filtrar"
        variant="standard"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        InputProps={{
          startAdornment: <SearchIcon />,
        }}
      />
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
