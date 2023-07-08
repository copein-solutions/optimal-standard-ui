import { Controller, FieldError } from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";
import { ReactNode } from "react";

type CustomTextFieldProps = {
  name: string;
  control: any;
  rules?: any;
  error?: any;
  helperText?: string;
  defaultValue?: ReactNode;
} & TextFieldProps;

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  name,
  control,
  rules,
  error,
  helperText,
  defaultValue = "",
  ...textFieldProps
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field }) => (
        <TextField
          {...field}
          {...textFieldProps}
          error={!!error}
          helperText={error ? error.message : helperText}
        />
      )}
    />
  );
};

export default CustomTextField;
