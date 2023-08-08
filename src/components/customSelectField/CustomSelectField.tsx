import { Controller } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";

type CustomSelectFieldProps = {
  name: string;
  label: string;
  options: any;
  control: any;
  rules?: any;
  error?: any;
  defaultValue?: ReactNode;
  onSelectOption?: (value: any) => void;
};

const CustomSelectField: React.FC<CustomSelectFieldProps> = ({
  name,
  label,
  options,
  control,
  rules,
  error,
  defaultValue = "",
  onSelectOption: onSelectOption,
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
              if (onSelectOption) {
                onSelectOption(value);
              }
            }}
          >
            {options.map((option: any, index: number) => (
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
