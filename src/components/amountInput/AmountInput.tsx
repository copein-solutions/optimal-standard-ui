import React, { forwardRef, ReactElement, Ref, useState } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import NumberFormat, {
  NumberFormatValues,
  SourceInfo,
  NumberFormatProps,
} from "react-number-format";

export type AmountFieldProps = {} & TextFieldProps & NumberFormatProps<any>;

const AmountField = forwardRef<HTMLInputElement, AmountFieldProps>(
  (
    {
      inputRef,
      required,
      error,
      helperText,
      label,
      decimalScale = 2,
      thousandSeparator = ".",
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
      const { event, source } = sourceInfo;
      console.log(event);
      console.log(source);
      
      setInputValue(formattedValue);
      if (onValueChange) onValueChange(values, sourceInfo);
    }

    return (
      <NumberFormat
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
        getInputRef={inputRef}
        inputMode="numeric"
        value={inputValue}
        label={label}
        onValueChange={handleValueChange}
        // {...props}
      />
    );
  }
);

export default AmountField;
