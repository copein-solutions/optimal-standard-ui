import React, {
  forwardRef,
  ReactElement,
  ReactNode,
  Ref,
  useState,
} from "react";
import { InputAdornment, TextField, TextFieldProps } from "@mui/material";
import NumberFormat, {
  NumberFormatValues,
  SourceInfo,
  NumberFormatProps,
} from "react-number-format";

export type AmountFieldProps = {
  /** Propiedad necesaria para capturar la referencia del input*/
  inputRef: any;
  /** Propiedad necesaria para capturar la referencia del input*/
  prefix: ReactNode;
  onChange: () => void;
} & TextFieldProps &
  NumberFormatProps<any>;

const AmountField = forwardRef<HTMLInputElement, AmountFieldProps>(
  (
    {
      name,
      onChange,
      prefix,
      inputRef,
      required,
      error,
      helperText,
      label,
      decimalScale = 2,
      thousandSeparator,
      decimalSeparator = ",",
      fixedDecimalScale = true,
      value,
      onValueChange,
    }: AmountFieldProps,
    ref: Ref<HTMLInputElement>
  ): ReactElement => {
    const [inputValue, setInputValue] = useState(value);

    function handleValueChange(
      values: NumberFormatValues,
      sourceInfo: SourceInfo
    ) {
      const { formattedValue } = values;
      setInputValue(formattedValue);
      if (onValueChange) onValueChange(values, sourceInfo);
    }

    return (
      <NumberFormat
        name={name}
        onChange={onChange}
        inputRef={inputRef}
        required={required}
        error={error}
        helperText={helperText}
        fullWidth
        customInput={TextField}
        displayType={"input"}
        fixedDecimalScale={fixedDecimalScale}
        decimalScale={decimalScale}
        thousandSeparator={thousandSeparator}
        decimalSeparator={decimalSeparator}
        inputMode="numeric"
        value={inputValue}
        label={label}
        onValueChange={handleValueChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">{prefix}</InputAdornment>
          )
        }}
        // {...props}
      />
    );
  }
);

export default AmountField;
