import { Controller } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";

type Option = {
  value: string;
  label: string;
};

type CustomSelectFieldProps = {
  name: string;
  label: string;
  options: Option[];
  control: any;
  rules?: any;
  error?: any;
  defaultValue?: ReactNode;
};

const CustomSelectField: React.FC<CustomSelectFieldProps> = ({
  name,
  label,
  options,
  control,
  rules,
  error,
  defaultValue = "",
}) => {
  return (
    <FormControl fullWidth error={!!error} size="small">
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field }) => (
          <Select
            {...field}
            labelId={`${name}-label`}
            label={label}
            onChange={(e) => {
              const value = e.target.value as string;
              field.onChange(value);
            }}
          >
            {options.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {error && (
        <Typography
          variant="caption"
          align="left"
          sx={{ marginLeft: "14px" }}
          color="error"
        >
          {error.message}
        </Typography>
      )}
    </FormControl>
  );
};

export default CustomSelectField;
