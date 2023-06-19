import { FC, ReactNode, useState } from "react";
import {
  BaseTextFieldProps,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { MenuItem, FormControl, Select, FormHelperText } from "@mui/material";

type Option = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  setPrefix?: (value: string) => void
  getRef?: any;
  label: string;
  options: Option[];
  error?: any;
  helperText?: string;
} & BaseTextFieldProps;

const CustomSelect: FC<CustomSelectProps> = ({
  setPrefix = () => {},
  options,
  label,
  getRef,
  error,
  helperText,
}) => {
  const [value, setValue] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setPrefix(`$/${event.target.value}`);
    setValue(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="custom-select-label">{label}</InputLabel>
      <Select
        inputRef={getRef}
        onChange={handleChange}
        value={value}
        label={label}
        labelId="custom-select-label"
        error={error}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText error>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;
