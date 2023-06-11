import { FC } from "react";
import { InputLabel } from "@mui/material";
import { MenuItem, FormControl, Select } from "@mui/material";

type Option = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  label: string;
  options: Option[];
};

const CustomSelect: FC<CustomSelectProps> = ({ options, label }) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="custom-select-label">{label}</InputLabel>
      <Select label={label} labelId="custom-select-label">
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
