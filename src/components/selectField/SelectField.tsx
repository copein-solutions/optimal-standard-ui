import { FC, useState } from "react";
import { InputLabel, SelectChangeEvent } from "@mui/material";
import { MenuItem, FormControl, Select } from "@mui/material";

type Option = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  refPrueba?: any;
  label: string;
  options: Option[];
};

const CustomSelect: FC<CustomSelectProps> = ({ options, label, refPrueba }) => {
  const [value, setValue] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="custom-select-label">{label}</InputLabel>
      <Select
        inputRef={refPrueba}
        onChange={handleChange}
        value={value}
        label={label}
        labelId="custom-select-label"
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
