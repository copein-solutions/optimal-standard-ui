import {
  BaseTextFieldProps,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { ChangeEvent } from "react";

type RadioList = {
  /** Label de cada input radio */
  label: string;
  /** Propiedad value de cada input radio */
  value: string;
};

type RadioGroupProps = {
  /** Función mediante la cual se obtiene el value del Radio seleccionado*/
  onChange: ( event: ChangeEvent<HTMLInputElement> ) => void;
  /** Radio que comenzará seleccionado por defecto*/
  defaultValue?: string;
  /** Propiedad name asignada al input Radio Group*/
  name: string;
  /** Propiedad id asignada al input Radio Group*/
  id: string;
  /** Label del conjunto de radio buttons*/
  formLabel: string;
  /** Si es true, los radio se mostrarán en una fila*/
  row?: boolean;
  /** Array de opciones. Cada una será un radio*/
  options: RadioList[];
} & BaseTextFieldProps ;

export const RadioGroupCustom: React.FC<RadioGroupProps> = ({
  onChange,
  defaultValue,
  name,
  id,
  formLabel,
  options,
  row,
}) => {
  return (
    <FormControl>
      <FormLabel id={id}>{formLabel}</FormLabel>
      <RadioGroup
        row={row}
        aria-labelledby={id}
        onChange={onChange}
        defaultValue={defaultValue}
        name={name}
      >
        {options.map((item, index) => (
          <FormControlLabel
            key={index}
            value={item.value}
            control={<Radio />}
            label={item.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioGroupCustom;
