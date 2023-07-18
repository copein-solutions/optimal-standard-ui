import { useState } from "react";
import { Controller, FieldError } from "react-hook-form";
import {
  TextField,
  TextFieldProps,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ReactNode } from "react";

type CustomPasswordFieldProps = {
  name: string;
  control: any;
  rules?: any;
  error?: any;
  helperText?: string;
  defaultValue?: ReactNode;
} & TextFieldProps;

const CustomPasswordField: React.FC<CustomPasswordFieldProps> = ({
  name,
  control,
  rules,
  error,
  helperText,
  defaultValue = "",
  ...textFieldProps
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field }) => (
        <TextField
          size="small"
          {...field}
          {...textFieldProps}
          type={showPassword ? "text" : "password"}
          error={!!error}
          helperText={error ? error.message : helperText}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};

export default CustomPasswordField;
