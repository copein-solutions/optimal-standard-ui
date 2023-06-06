import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

type RadioList = {
  /** Label de cada input radio */
  label: string;
  /** Propiedad value de cada input radio */
  value: string;
};

type RadioGroupProps = {
  /** Radio que comenzará seleccionado por defecto*/
  defaultValue: string;
  /** Propiedad name asignada al input Radio Group*/
  name: string;
  /** Propiedad id asignada al input Radio Group*/
  id: string;
  /** Label del conjunto de radio buttons*/
  formLabel: string;
  /** Si es true, los radio se mostrarán en una fila*/
  row?: boolean,
  /** Array de opciones. Cada una será un radio*/
  options: RadioList[];
};

export const RadioGroupCustom: React.FC<RadioGroupProps> = ({
  defaultValue,
  name,
  id,
  formLabel,
  options,
  row
}) => {
  return (
    <FormControl>
      <FormLabel id={id}>{formLabel}</FormLabel>
      <RadioGroup row={row} aria-labelledby={id} defaultValue={defaultValue} name={name}>
        {options.map((item) => (
          <FormControlLabel value={item.value} control={<Radio />} label={item.label} />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioGroupCustom;
